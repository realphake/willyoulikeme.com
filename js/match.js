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

function match(message, data) {
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
			nonMatchingTerms[j].splice(i,i);
		}
	}
	
	// push friend names into friendScores
	var friendScores = [];
	for(i = 1; i < data.length; i++)
	{
		friendScores[data[i][0]] = [];
	}

	var moreData = likePrediction();
	
	// match terms to data
	for(i = 0; i <= moreData[0].length - 7; i++)
	{
		termScores.push(moreData[1][i]);

		// get terms matching data
		var match = false;
		for(j in terms)
		{
			if(terms[j].toLowerCase() == moreData[0][moreData[0].length - 7 - i].toLowerCase()) {
				match = true;
				matchingTerms.push([terms[j],moreData[1][moreData[0].length - 7 - i],parseInt(j)]);
				termCount++;
		
				// sum score for friend
				nonMatchingTerms[0].splice(moreData[0].length - 7 - i+1,1);
				for(k = 1; k < data.length; k++) {
					friendScores[data[k][0]] = data[k][moreData[0].length - 7 - i+1];
					nonMatchingTerms[k].splice(moreData[0].length - 7 - i+1,1);
				}
			}
		}
	}

	// calculate scores for friends and total likes
			// Not completely sure what this does:
			// friendScores[i] = 1 - (like / friendScores[i].length);
	if(termCount > 0) {
		var like = 0;
		for(j in moreData[1]) {
			if (j > moreData[1].length-8) break;
			if ( isIn(moreData[0][j], matchingTerms)) {
				like += moreData[1][j];
			}
		}
		var allTerms = message.slice(0);
		var wordCount = 0;
		for (q in allTerms) {
			if (allTerms[q] != "" && allTerms[q] != " " && allTerms[q] != "\n")
				wordCount++;
		}
		like += moreData[1][moreData[1].length-7] * wordCount; // length
		like += moreData[1][moreData[1].length-6] * 1.0; // night
		like += moreData[1][moreData[1].length-5] * 0.0; // morning
		like += moreData[1][moreData[1].length-4] * 0.0; // afternoon
		like += moreData[1][moreData[1].length-3] * 0.0; // evening
		like += moreData[1][moreData[1].length-2] * 1.0; // Has link
		like += moreData[1][moreData[1].length-1] * 0.0; // Has photo
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
