#!/Python27/python

import urllib2
import json
import csv
import cgi, cgitb 
cgitb.enable()  # for troubleshooting

#the cgi library gets vars from html
data = cgi.FieldStorage()

# Create lists to store friend data    
friends_name_list = []
friends_name_id_list = []
friends_id_list = []
mutual_friends_list = []

def crawlFriends( username, token ):

    username = turnUsernameIntoId(username)
    
    # Create the URL needed
    url = "https://graph.facebook.com/"+username+"/?fields=name,id,friends&access_token="+token
    	
    while( True ):

        # Get the friends of the user and store it in JSON
        response = urllib2.urlopen(url)
        content = response.read().decode(response.headers.get('Content-Type', '').split("=")[1])
        JSONdata = json.loads(content)
		
        # Open the data in this JSON file
        for friends in JSONdata["friends"]["data"]:

            # Retrieve all the relevant data
            name =  friends["name"].encode('ascii','ignore') #encoding to ascii loses special characters
            #print name
            friend_id =  friends["id"].encode('ascii','ignore')
            friends_id_list.append(friend_id)
            mutual_friends_list.append([friend_id,name])
            friends_name_list.append(friends["name"])
            name_id = [friends["name"],friend_id]
            #friends_name_id_list.append([friends["name"],friend_id])
            friends_name_id_list.append(name_id)
            
					
        if "paging" in JSONdata: url = JSONdata["paging"]["next"]
        else: break		
    
    # Using the friend id's of the user to get the mutual friends between the user and his/her friends
    for ids in range(len(friends_id_list)):
	    
        # Try to get the mutual friends 
        try:
            friends_url = "https://graph.facebook.com/"+friends_id_list[ids]+"/?fields=mutualfriends&access_token="+token
            #print "friend URL: ",ids+1,"/",len(friends_id_list)," ",friends_url,"\n"
            response = urllib2.urlopen(friends_url)
            content = response.read().decode(response.headers.get('Content-Type', '').split("=")[1])
            JSONfriendData = json.loads(content)
            
            # Add the friends to the friends of a friend (foaf) file
            for foaf in JSONfriendData["mutualfriends"]["data"]:
                friend = foaf["name"].encode('ascii','ignore') # this fails (in windows command prompt, not in IDLE)when the string contains unicode that is unknown
                id = foaf["id"].encode('ascii','ignore')
                #print "<",foaf["name"],"-",id,">"
                mutual_friends_list[ids].append(id)

        except:
            #print "NO MUTUAL FRIENDS"
            pass

    # Turn the list into a single string (['hello','world']) --> hello#@#world
    friends_id_str = '#@#'.join(friends_id_list)
    #print "The friends id's of the user:","\n",friends_id_str,"\n"
    friends_name_str = '#@#'.join(friends_name_list)
    #print "The friends names of the user:","\n",friends_name_str,"\n"
    

def turnUsernameIntoId(username):
    url = "https://graph.facebook.com/"+username+"?fields=id"
    response = urllib2.urlopen(url)
    content = response.read().decode(response.headers.get('Content-Type', '').split("=")[1])
    JSONdata = json.loads(content)
    return JSONdata["id"]

username = "rens.vanhonschooten"  #rens.vanhonschooten #203641139689699 frans bauer #100001897597088
token = "CAACEdEose0cBAAlFrwnMOeGZCbbbFPXArTpoIFkiMYgv44KoNZCTyqxWv5JaUevR9P0mX04h3MMj1fmZC6HL5umZC3xEQRIB9dnJZCe9UG8W1zuecnhxDN6qafLhNA5Fk1V6WHolzSeP567KwkhOQCetzDSUZBhztHIzLtIHEsJhlbAVy7ps7f27ZBYv2tSIZA4ZD"

#crawlFriends(username, token)

# Get userFriends in Json format
def getUserFriends( username, token ):
    url = "https://graph.facebook.com/"+username+"/?fields=name,id,friends&access_token="+token
    response = urllib2.urlopen(url)
    content = response.read().decode(response.headers.get('Content-Type', '').split("=")[1])
    JSONfriends = json.loads(content)
    print json.dumps(JSONfriends, sort_keys=True,indent=4, separators=(',', ': '))

    return JSONfriends

crawlFriends(username,token)
#print mutual_friends_list

#this is the actual output
print "Content-Type: text/html\n"
print mutual_friends_list
print "<br />"
print "<script>"
print "var mutual_friends_raw = ",mutual_friends_list,";"
print "</script>" 

