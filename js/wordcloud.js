var width = $('#wordcloud').width() - 20,
	height = $('#wordcloud').height() - 80;

var fill = d3.scale.category20();
	
var svgbody = d3.select("#wordcloud")//create this 'shortcut-variable', so I don't have to type this code over and over again
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class","wordcloud")

d3.layout.cloud().size([width, height])
	.on("end", function(k){
		
		svgbody
		.append("g")
			.attr("transform", "translate("+width/2+","+height/2+")")//group words in the centre of the cloud
		.selectAll("text")
			.data(k, function(d) { return d.text; });
	})
	.start();


function updateWordcloud(input) {

filteredInput = deepCopy(input);

for(i = 0; i < filteredFriends.length; i++) {
	for(j = 1; j < filteredInput.length; j++) {
		if(filteredFriends[i] == filteredInput[j][0]) {
			filteredInput.splice(j,1);
		}
	}
}

// sum scores for each term
var termScores = [];
for(i = 1; i < filteredInput[0].length; i++)
{
	//get sum of prediction data for each term
	var score = 0;
	for(j = 1; j < filteredInput.length; j++) {
		score += filteredInput[j][i];
	}
	termScores.push([filteredInput[0][i],Math.round(score*100)/100]);
}

cloudScale = d3.scale.linear()
	.domain([d3.min(termScores, function(d) { return d[1]; }), d3.max(termScores, function(d) { return d[1]; })])
	.range([0, 1]);
	
	d3.layout.cloud()
		.size([width, height])
		.words(termScores.map(function(d,i) {
			//determine the size of a word here (I've created a formula that is based on the width height and array length. it seems to work for now)
			return {text: d[0], size: cloudScale(d[1])*(50+(width+height)/termScores.length)}
		}))
		
		//determine the angle of a word here (change 90 into 0 to not rotate any words)
		.rotate(0)
		.font("Impact")
		.fontSize(function(d) { return d.size; })
		.on("end", function(k){

				var cloud = svgbody.select("g").selectAll("text")
					.data(k, function(d) { return d.text; })
					
				cloud.enter()
					.append("text")
					.text(function(d) { return d.text; })
					.style("font-size", 1)
					.on("click", function(k) {
						if($('#message').val() == "") {
							$('#message').val(k.text);
						} else {
							$('#message').val($('#message').val() + " " + k.text);
						}
						updateVisuals();
					});
			
				cloud.transition()
					.duration(1000)
					.delay(function(d,i) {
						return i * 20;
					})
					.style("font-size", function(d) { return d.size + "px"; })
					.style("font-family", "Impact")
					.style("fill", function(d, i) { return fill(i); })//determine word color here
					.attr("text-anchor", "middle")
					.attr("transform", function(d) {
						return "translate(" + [d.x, d.y] + ")rotate(0)";
					})
					.text(function(d) { return d.text; });
					
				cloud.exit()
					.transition()
					.duration(1000)
					.style("font-size", 1)
					.remove();	
		})
		.start();
}