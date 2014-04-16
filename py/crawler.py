try: import urllib2
except ImportError: import urllib.request
import json
import csv

def crawl( username, token, limit ):
    username = turnUsernameIntoId(username)
    # ["Message","Message Length","Time Posted","# Likes","# Shares","# Comments","Update Type","Link URL","Post URL"]
    crawledPage = []
    url = createFacebookAPIURL(username, limit, token)
    pageNum = 0
    while( True ):
        pageNum += 1
        print("Page "+ str(pageNum) +" being processed.")
        JSONdata = JSONFromURL(url)
        for statusUpdate in JSONdata["data"]:
            if statusUpdate["from"]["id"] == username:
                crawledPage.append(makeRowForPostData(statusUpdate))
        if hasNextPage(JSONdata): url = getURLOfNextPage(JSONdata)
        else: break
    return crawledPage

def makeRowForPostData(statusUpdate):
    return [getMessageFrom(statusUpdate), len(getMessageFrom(statusUpdate).split()),
            statusUpdate["created_time"], extractNumber("likes",statusUpdate),
            getSharesFrom(statusUpdate), extractNumber("comments",statusUpdate),
            statusUpdate["type"], getLinkURLFrom(statusUpdate), getPostURLFrom(statusUpdate)]

def JSONFromURL(url):
    response = openURLsafely(url)
    content = decodeContent(response)
    return json.loads(content)

def createFacebookAPIURL(username, limit, token):
    return "https://graph.facebook.com/"+username+"/feed?limit="+str(limit)+\
        "&fields=message,created_time,shares,from,comments.limit(1).summary(true),type,"+\
        "link,actions,likes.limit(1).summary(true)&access_token="+token

def hasNextPage(JSONdata):
    return "paging" in JSONdata

def getURLOfNextPage(JSONdata):
    return JSONdata["paging"]["next"]

def getLinkURLFrom(statusUpdate):
    if "link" in statusUpdate: linkURL = statusUpdate["link"]
    else: linkURL = ""
    return linkURL

def getPostURLFrom(statusUpdate):
    if "actions" in statusUpdate: postURL = statusUpdate["actions"][0]["link"]
    else: postURL = ""
    return postURL

def getMessageFrom(statusUpdate):
    if "message" in statusUpdate: message = statusUpdate["message"]
    else: message = ""
    return message

def getSharesFrom(statusUpdate):
    if "shares" in statusUpdate: shares = statusUpdate["shares"]["count"]
    else: shares = 0
    return shares
        

def crawlFriends( username, token ):

    username = turnUsernameIntoId(username)
    
    # Make a csv file with the users friends
    csvFile = open('friends.csv', 'w')
    csvWriter = csv.writer(csvFile, quotechar = '|')
    csvWriter.writerow(["friend_id","name"])
    
    # Create the URL needed
    url = "https://graph.facebook.com/"+username+"/?fields=name,id,friends&access_token="+token

    # Create list for id's to get friends of friends later
    friends_id_list = []
	
    while( True ):

        print("Processing friends...")
        response = openURLsafely(url)
        content = response.read().decode(response.headers.get('Content-Type', '').split("=")[1])
        JSONdata = json.loads(content)
		
        # Open the data in this JSON file
        for friends in JSONdata["friends"]["data"]:
            
            # Retrieve all the relevant data
            name =  friends["name"].encode('ascii','ignore') #encoding to ascii loses special characters
            friend_id =  friends["id"]
            friends_id_list.append(friend_id)
            csvWriter.writerow([friend_id, name])
					
        if "paging" in JSONdata: url = JSONdata["paging"]["next"]
        else: break		
    
    # Create a csv file for the friends of a friend
    csvFile.close()
    csvFile = open('foaf.csv', 'w')
    csvWriter = csv.writer(csvFile, quotechar = '|')
    csvWriter.writerow(["friend_id","name","user_id"])
	
    # Using the friend id's of the user to get the friends of the users friends. 
    # THIS ONLY WORKS FOR PUBLIC PROFILES, unfortunately
    for ids in range(len(friends_id_list)):
	    
        # Try to get the friends of a friend 
        try:
            friends_url = "https://graph.facebook.com/"+friends_id_list[ids]+"/?fields=name,id,friends&access_token="+token
            response = openURLsafely(url)
            content = decodeContent(response)            

            JSONfriendData = json.loads(content)
            # Add the friends to the friends of a friend (foaf) file
            for foaf in JSONfriendData["friends"]["data"]:
                friend = foaf["name"].encode('ascii','ignore') 
                # this fails (in windows command prompt, not in IDLE)when the string contains unicode that is unknown
                id = friends["id"]
                csvWriter.writerow([id, friend,friends_id_list[ids]])
        except:
            pass

def openURLsafely(URL):
    try: response = urllib.request.urlopen(URL)
    except NameError: response = urllib2.urlopen(URL)
    return response

def decodeContent(response):
    # try: content = response.read().decode(response.headers.get_content_charset())
    # except AttributeError: content = response.read().decode('utf8')
    content = response.read().decode('utf8')
    return content

def extractNumber(category, statusUpdate):
    if category in statusUpdate: number = statusUpdate[category]["summary"]["total_count"]
    else: number = 0
    return number

def turnUsernameIntoId(username):
    url = "https://graph.facebook.com/"+username+"?fields=id"
    response = openURLsafely(url)
    content = response.read().decode('utf8')
    JSONdata = json.loads(content)
    return JSONdata["id"]


if __name__ == '__main__':
    token = ''
    username = 'philip.anderson1'
    limit = 1000
    page = crawl(username, token, limit)
    #crawlFriends( username, token )
    

