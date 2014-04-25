function crawl( username, token, limit ) {
    var username = turnUsernameIntoId(username);
    /** ["Message","Message Length","Time Posted","# Likes","# Shares","# Comments","Update Type","Link URL","Post URL"] **/
    var crawledPage = [];
    var url = createFacebookAPIURL(username, limit, token);
    var pageNum = 0
    while( true ) {
        pageNum += 1;
        console.log("Page "+ pageNum +" being processed.");
        var JSONdata;
        $.getJSON(url, function(data) { JSONdata = data; });
        for ( var i = 0; i < JSONdata.data.length; i++ ) {
			var statusUpdate = JSONdata.data[i];
            if ( statusUpdate.from.id == username ) {
                crawledPage.push(makeRowForPostData(statusUpdate));
            }
        }
		
        if ( hasNextPage(JSONdata) )
			url = getURLOfNextPage(JSONdata);
        else
			break;
    }
    return crawledPage
}

function makeRowForPostData(statusUpdate) {
    return ["test", "yay"];
    // return [getMessageFrom(statusUpdate), len(getMessageFrom(statusUpdate).split()),
            // statusUpdate["created_time"], extractNumber("likes",statusUpdate),
            // getSharesFrom(statusUpdate), extractNumber("comments",statusUpdate),
            // statusUpdate["type"], getLinkURLFrom(statusUpdate), getPostURLFrom(statusUpdate)]
}

function createFacebookAPIURL(username, limit, token) {
    return "https://graph.facebook.com/"+username+"/feed?limit="+limit+
        "&fields=message,created_time,shares,from,comments.limit(1).summary(true),type,"+
        "link,actions,likes.limit(1).summary(true)&access_token="+token;
}

function hasNextPage(JSONdata) {
    return JSONdata.hasOwnProperty("paging");
}

function getURLOfNextPage(JSONdata) {
    return JSONdata.paging.next;
}

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

// def extractNumber(category, statusUpdate):
    // if category in statusUpdate: number = statusUpdate[category]["summary"]["total_count"]
    // else: number = 0
    // return number

function turnUsernameIntoId(username) {
    url = "https://graph.facebook.com/"+username+"?fields=id"
    var JSONdata;
	$.ajaxSetup({ async: false });
    $.getJSON(url, function(data) { JSONdata = data; });
    return JSONdata.id;
}
