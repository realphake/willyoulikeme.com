var filteredFriends = [];

var color = d3.scale.linear()
    .domain([0, 1])
    .range(["#ffeda0", "#f03b20"]);
	
var width = $('#network').width() - 20,
	height = $('#network').height() - 74;

var svg = d3.select("#network")
	.append("svg")
	.attr("width", width)
	.attr("height", height);	

var nodes = {};
var links = [];

var basesize = 4;
var sizechange = 4;
	
function setNetwork() {
	// get all unique friend
	for(i in friends) {
		nodes[friends[i][0]] = {id: friends[i][0], name: friends[i][1], type: 'normal'};
	}
	
	var processedFriends = [];
	for(i in friends) {
		// get all relations
		for(j in friends[i][2]) {
			if(!(friends[i][0]+""+friends[i][2][j] in processedFriends)) {
				links.push({id: friends[i][0]+""+friends[i][2][j], source: nodes[friends[i][0]], target: nodes[friends[i][2][j]], type: 'line'});
			}
			processedFriends[friends[i][2][j]+""+friends[i][0]] = true;
		}
	}
	
	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(d3.values(links))
		.size([width, height])
		.linkDistance( 50 )
		.charge(-50)
		.on("tick", tick)
		.start();

	var link = svg.selectAll(".line")
		.data(force.links(), function(d) { return d.id; })
		.enter().append("line")
		.attr("class", function(d) { return "line"; } )

	var node = svg.selectAll(".node")
		.data(force.nodes())
		.enter().append("g")
		.attr("class", "node")
		.attr("id", function(d) { return d.name } )
		.on("click", filter)
		.call(force.drag);

	node.append("circle")
		.attr("r", basesize)
		.attr("class", function(d) { return d.type })
		.style("fill", function(d, i) { return color(0); });

	node.append("text")
		.attr("x", 14)
		.attr("dy", ".40em")
		.text(function(d) { return d.name; });


	function tick() {
	  link
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })


	  node
		  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
}

function updateNetwork(friendScores) {

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(d3.values(links))
		.size([width, height])
		.linkDistance( 50 )
		.charge(-50)
		.on("tick", tick)
		.start();

	var node = svg.selectAll(".node")
		.data(force.nodes())
		.on("click", filter);
	
	node.select("circle").transition()
		.duration(1000)
		.attr("r", function(d) {
			if(filteredFriends.length == 0) {
				d.type = "normal";		
			}
			return basesize + friendScores[d.id] * sizechange; 
		})
		.style("fill", function(d, i) { 
			if(d.type == "normal") {
				return color(friendScores[d.id]);
			}
		});

	var link = svg.selectAll(".line")
		.data(force.links(), function(d) {
			return d.id;
		});
	
	function tick() {
	  link
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; })


	  node
		  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
}

function filter(d) {
	// update wordcloud filter
	if(d.type == "normal") {
		filteredFriends.push(d.id);
		d3.select(this).select("circle").transition()
			.attr("class", 	function(d) { return "ignored"; })
			.attr("r", function(d) { return basesize; })
			.style("fill", function(d) { return "#999"; });
		d.type = "ignored";	
	} else {
		// remove from filteredFriends
		for(var i in filteredFriends){
			if(filteredFriends[i] == d.id){
				filteredFriends.splice(i,1);
				break;
			}
		}
		d3.select(this).select("circle").transition()
			.attr("class", 	function(d) { return "normal"; })
			.attr("r", function(d) { return basesize + dataset.friendScores[d.id] * sizechange; })
			.style("fill", function(d) { return color(dataset.friendScores[d.id]); });
		d.type = "normal";	
	}
	updateWordcloud(dataset.nonMatchingTerms);
}