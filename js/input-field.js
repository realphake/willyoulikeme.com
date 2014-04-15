var time = 0;
var prevTerms = [];
var prevLikes = 0;

// update function
function updateVisuals() {	

	var message = $('#message').val().toLowerCase();
	
	// force second timeout
	clearTimeout(time);
	time = setTimeout(function() {

		// match message to data
		dataset = match(message, data);

		$('.highlighter').html(dataset.terms.join(""));

		// act if terms changed
		if(dataset.matchingTerms.toString() != prevTerms.toString()) {
			jQuery({animlikes: prevLikes}).animate({animlikes: dataset.likes}, {
				duration: 1000,
				easing: 'swing', // can be anything
				step: function() { // called on every step
				// Update the element's text with rounded-up value:
					$('#likes').text(Math.floor(this.animlikes) + " friends");
				}
			});

			prevTerms = dataset.matchingTerms.slice(0);
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

// act on input change
$('#message').bind('input propertychange', function() {
	updateVisuals();
});