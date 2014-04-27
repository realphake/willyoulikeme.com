function preprocess(data) {
    var allWordsCounting = {};
    var postDicts = [];
    var fullRows = [];
    for (var i = 0; i < data.length; i++) {
		var row = data[i];
        if ( row == [] )
			continue;
        var post = formatPost(row[0]);
        var postDict = {};
		var words = post.split(" ");
        for ( var j = 0; j < words.length; j++ ) {
            var t = words[j].toLowerCase();
            postDict[t] = 1;
			allWordsCounting[t] = allWordsCounting[t] + 1 || 1;
		}
		postDicts.push(postDict);
        fullRows.push(makeRowOfFeatures(row));
	}
	delete allWordsCounting[""];
    var allWords = mostCommon(allWordsCounting, 50);
	var fullyProcessedDatabase = makeTheProcessedData(allWords,postDicts,fullRows);
    console.log( "Preprocessing done." );
	console.log(fullyProcessedDatabase);
    return fullyProcessedDatabase;
}

function mostCommon(counted, limit) {
	var sortedCount = sortObject(counted);
	var mostCommonList = [];
	for (var k = 0; k < Math.min(limit,sortedCount.length); k++ ) {
		mostCommonList[k] = sortedCount[k].key;
	}
	return mostCommonList;
}

function makeTheProcessedData(allWords,postDicts,fullRows) {
    var fullyProcessedDatabase = [];
    fullyProcessedDatabase.push(allWords);
    for ( var pD = 0; pD < postDicts.length; pD++ ) {
        var row = [];
        for ( var w = 0; w < allWords.length; w++ ) {
            row.push(1*(postDicts[pD].hasOwnProperty(allWords[w])));
		}
        row = row.concat(fullRows[pD]);
        fullyProcessedDatabase.push(row);
	}
    return fullyProcessedDatabase;
}
	
function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr;
}

function makeRowOfFeatures(row) {
    return [row[1], timeBetween(0,sSinceMid(row[2]),6), timeBetween(6,sSinceMid(row[2]),12),
            timeBetween(12,sSinceMid(row[2]),18), timeBetween(18,sSinceMid(row[2]),24),
            postHasA(row[6],'link'), postHasA(row[6],'photo'), row[3]];
}

function postHasA(postType, thing) {
    return (postType == thing) * 1;
}

function formatPost(post) {
    return post.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
	/** return ''.join(ch for ch in re.sub('\s+', ' ', post) if ch not in set(string.punctuation)); **/
}

function timeBetween(begin, ssm, end) {
    return (ssm >= 3600*begin && ssm < 3600*end)*1;
}

function sSinceMid(dateString) {
	return 3;
    // date = datetime.datetime.strptime(dateString[11:19], "%H:%M:%S")
    // try: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
    // except AttributeError: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).seconds
    // return secs_since_midnight
}
