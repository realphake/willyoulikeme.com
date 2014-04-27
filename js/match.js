function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

function match(message, metadata, data) {
	// split message into terms
	var terms = message.match(/\s|\.|,|\/|#|!|$|%|\^|&|\*|;|:|{|}|\=|\-|_|`|~|\(|\)|@|\+|\?|>|<|\[|\]|\+|[a-zA-Z0-9]+/g);
	// set variables
	var likes = 0;
	var termCount = 0;
	var matchingTerms = [];
	var nonMatchingTerms = deepCopy(data);
	var termScores = [0];
	
	var len = nonMatchingTerms[0].length;
	for(i = nonMatchingTerms[0].length; i > len - 8; i--) {
		for(j = 0; j < nonMatchingTerms.length; j++) {
			nonMatchingTerms[j].splice(i,1);
		}
	}
	
	// push friend names into friendScores
	var friendScores = [];
	for(i = 1; i < data.length; i++)
	{
		friendScores[data[i][0]] = [];
	}
	
	// match terms to data
	for(i = 0; i <= data[0].length - 7; i++)
	{
		termScores.push(data[1][i]);

		// get terms matching data
		var match = false;
		for(j in terms)
		{
			if(terms[j].toLowerCase() == data[0][data[0].length - 7 - i].toLowerCase()) {
				match = true;
				matchingTerms.push([terms[j],data[1][data[0].length - 7 - i],parseInt(j)]);
				termCount++;
		
				// sum score for friend
				nonMatchingTerms[0].splice(data[0].length - 7 - i,1);
				for(k = 1; k < data.length; k++) {
					friendScores[data[k][0]] = data[k][data[0].length - 7 - i];
					nonMatchingTerms[k].splice(data[0].length - 7 - i,1);
				}
			}
		}
	}

	// calculate scores for friends and total likes
	// Not completely sure what this does:
	// friendScores[i] = 1 - (like / friendScores[i].length);
	if(termCount > 0) {
		var like = 0;
		for(j in data[1]) {
			if (j > data[1].length-8) break;
			if ( isIn(data[0][j], matchingTerms)) {
				like += data[1][j];
			}
		}
		var allTerms = message.slice(0);
		var wordCount = 0;
		for (q in allTerms) {
			if (allTerms[q] != "" && allTerms[q] != " " && allTerms[q] != "\n")
				wordCount++;
		}
		like += data[1][data[1].length-7] * wordCount; // length
		like += data[1][data[1].length-6] * metadata.night; // night
		like += data[1][data[1].length-5] * metadata.morning; // morning
		like += data[1][data[1].length-4] * metadata.afternoon; // afternoon
		like += data[1][data[1].length-3] * metadata.evening; // evening
		like += data[1][data[1].length-2] * metadata.link; // Has link
		like += data[1][data[1].length-1] * metadata.photo; // Has photo
		likes = like;
		if(likes < 0)
			likes = 0;
	}
	
	matchingTerms.sort(function(a,b) {
		return a[2] == b[2] ? 0 : (a[2] < b[2] ? -1 : 1)
	})

	// get unique terms
	var j = 0;
	var uniqueTerms = [];
	for(i in matchingTerms) {
		if(!(matchingTerms[i][0] in uniqueTerms)) {
			uniqueTerms[matchingTerms[i][0]] = j;
			j++;
		}
	}
	
	// highlight same terms
	var matched = [];
	var remove = [];
	for(i in matchingTerms) {
		if(matchingTerms[i][0] in matched) {
			terms[matchingTerms[i][2]] = "<span style='background: " + fill(uniqueTerms[matchingTerms[i][0]]) + "'>" + matchingTerms[i][0] + "</span>";	
			remove.push(i);
		} else {
			terms[matchingTerms[i][2]] = "<span style='background: " + fill(uniqueTerms[matchingTerms[i][0]]) + "'>" + matchingTerms[i][0] + "</span>";
			matchingTerms[i][2] = uniqueTerms[matchingTerms[i][0]];
			matched[matchingTerms[i][0]] = true;
		}
	}
	
	// remove duplicate terms from barchart
	var j = 0;
	for(i in remove) {
		matchingTerms.splice(remove[i]-j, 1);
		j++;
	}

	return {terms: terms, likes: likes, matchingTerms: matchingTerms, nonMatchingTerms: nonMatchingTerms, termScores: termScores, friendScores: friendScores}
}

function isIn(word, list) {
	for (part in list) {
		if (list[part][0] == word) return true;
	}
	return false;
}
