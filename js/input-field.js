var time = 0;
var prevTerms = [];
var prevMetadata = {};
var prevLikes = 0;

// update function
function updateVisuals() {

	var message = $('#message').val().toLowerCase();
	
	// force second timeout
	clearTimeout(time);
	time = setTimeout(function() {
	
		var photoSelected = document.getElementById('photo').checked * 1;
		var linkSelected = document.getElementById('link').checked * 1;

		// match message to data
		metadata = {night:1,morning:0,afternoon:0,evening:0,link:linkSelected,photo:photoSelected};
		dataset = match(message, metadata, data);

		$('.highlighter').html(dataset.terms.join(""));
		
		// act if terms changed
		if(dataset.matchingTerms.toString() != prevTerms.toString() || 
				!objectEquals(metadata, prevMetadata) ) {
			jQuery({animlikes: prevLikes}).animate({animlikes: dataset.likes}, {
				duration: 1000,
				easing: 'swing', // can be anything
				step: function() { // called on every step
				// Update the element's text with rounded-up value:
					$('#likes').text(Math.floor(this.animlikes) + " friends");
				}
			});

			prevTerms = dataset.matchingTerms.slice(0);
			prevMetadata = metadata;
			prevLikes = dataset.likes;

			// reset filtered friends if message is empty
			if(message.length == 0) {
				filteredFriends = [];
			}
			// Update other graphs
			updateBarchart(dataset.matchingTerms);
			updateNetwork(dataset.friendScores);
			updateWordcloud(dataset.nonMatchingTerms);
		}
	}, 200);
}

function objectEquals(obj1, obj2) {
    for (var i in obj1) {
        if (obj1.hasOwnProperty(i)) {
            if (!obj2.hasOwnProperty(i)) return false;
            if (obj1[i] != obj2[i]) return false;
        }
    }
    for (var i in obj2) {
        if (obj2.hasOwnProperty(i)) {
            if (!obj1.hasOwnProperty(i)) return false;
            if (obj1[i] != obj2[i]) return false;
        }
    }
    return true;
}

// act on input change
$('#message').bind('input propertychange', function() { updateVisuals(); });
$('#photo').change('input propertychange', function()  { updateVisuals(); });
$('#link').change('input propertychange', function()  { updateVisuals(); });
$('#neither').change('input propertychange', function()  { updateVisuals(); });