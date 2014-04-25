function crawl( username, token, limit ) {
    var username = turnUsernameIntoId(username);
    /** ["Message","Message Length","Time Posted","# Likes","# Shares","# Comments","Update Type","Link URL","Post URL"] **/
    var crawledPage = [];
    var url = createFacebookAPIURL(username, limit, token);
    pageNum = 0
    // while( True ):
        // pageNum += 1
        // print("Page "+ str(pageNum) +" being processed.")
        // JSONdata = JSONFromURL(url)
        // for statusUpdate in JSONdata["data"]:
            // if statusUpdate["from"]["id"] == username:
                // crawledPage.append(makeRowForPostData(statusUpdate))
        // if hasNextPage(JSONdata): url = getURLOfNextPage(JSONdata)
        // else: break
    // return crawledPage
}

// def makeRowForPostData(statusUpdate):
    // return [getMessageFrom(statusUpdate), len(getMessageFrom(statusUpdate).split()),
            // statusUpdate["created_time"], extractNumber("likes",statusUpdate),
            // getSharesFrom(statusUpdate), extractNumber("comments",statusUpdate),
            // statusUpdate["type"], getLinkURLFrom(statusUpdate), getPostURLFrom(statusUpdate)]

// def JSONFromURL(url):
    // response = openURLsafely(url)
    // content = decodeContent(response)
    // return json.loads(content)

function createFacebookAPIURL(username, limit, token) {
    return "https://graph.facebook.com/"+username+"/feed?limit="+str(limit)+
        "&fields=message,created_time,shares,from,comments.limit(1).summary(true),type,"+
        "link,actions,likes.limit(1).summary(true)&access_token="+token;
}

// def hasNextPage(JSONdata):
    // return "paging" in JSONdata

// def getURLOfNextPage(JSONdata):
    // return JSONdata["paging"]["next"]

// def getLinkURLFrom(statusUpdate):
    // if "link" in statusUpdate: return statusUpdate["link"]
    // else: return ""

// def getPostURLFrom(statusUpdate):
    // if "actions" in statusUpdate: return statusUpdate["actions"][0]["link"]
    // else: return ""

// def getMessageFrom(statusUpdate):
    // if "message" in statusUpdate: return statusUpdate["message"]
    // else: return ""

// def getSharesFrom(statusUpdate):
    // if "shares" in statusUpdate: return statusUpdate["shares"]["count"]
    // else: return 0
        



// def openURLsafely(URL):
    // try: response = urllib.request.urlopen(URL)
    // except NameError: response = urllib2.urlopen(URL)
    // return response

// def decodeContent(response):
    // # try: content = response.read().decode(response.headers.get_content_charset())
    // # except AttributeError: content = response.read().decode('utf8')
    // content = response.read().decode('utf8')
    // return content

// def extractNumber(category, statusUpdate):
    // if category in statusUpdate: number = statusUpdate[category]["summary"]["total_count"]
    // else: number = 0
    // return number

function turnUsernameIntoId(username) {
    url = "https://graph.facebook.com/"+username+"?fields=id"
    var JSONdata;
	$.getJSON(url, function(data) { JSONdata = data; });
    return JSONdata["id"];
}
