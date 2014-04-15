var dataset = [];
	
var w = 450;
var h = $('#barchart').height() - 84;
	var padding = 20;
	var leftpadding = 100;
	
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var barPadding = h / dataset.length / 12;
	
	var barchart = d3.select("#barchart")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
	xScale = d3.scale.linear()
		.domain([0, 10])
		.range([leftpadding, w - padding]);

	xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(5);

	barchart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
		
		
function updateBarchart(dataset) {
			//var terms = ["time","person","year","way","day","thing","man","world","life","hand","part","child"]
			
			var barPadding = h / dataset.length / (3 + dataset.length);

			var lowest = d3.min(dataset, function(d) { return d[1]; });
			var min = 0;
			if(lowest < 0) {
					var min = lowest;
			}
			var highest = d3.max(dataset, function(d) { return d[1]; });
			var max = 0;
			if(highest > 0) {
				var max = highest;
			}
			
			xScale = d3.scale.linear()
				.domain([min, max])
				.range([leftpadding, w - padding]);

			yScale = d3.scale.linear()
				.domain([0, dataset.length])
				.range([0, h - 25]);
				
			xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(5);
			
			var sortItems = function (a, b) {
				return b.value - a.value;
			};
			
			var rects = barchart.selectAll("rect")
				.data(dataset, function(d) { return d[2]; });
			
			// bars
			rects.enter().append("rect")
				.attr("width", 0)
				.attr("x", xScale(0))
				.style("fill", function(d, i) { return fill(1); });
		
			rects.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.attr("x", function(d, i) {
					if(d[1] < 0) {
						return xScale(d[1]);
					} else {
						return xScale(0);
					}
				})
				.attr("width", function(d) {
					if(d[1] < 0) {
						return xScale(min - d[1]) - leftpadding;
					} else {
						return xScale(d[1] - Math.abs(min)) - leftpadding;
					}
				})
				.attr("y", function(d, i) {
					return yScale(i) + barPadding;
				})
				.attr("height", h / dataset.length - barPadding * 2)
				.style("fill", function(d, i) { return fill(d[2]); });
			
			rects.exit()
				.transition()
				.duration(1000)
				.attr("width", 0)							
				.remove();

			// values
			var values = barchart.selectAll("text.value")
				.data(dataset, function(d) { return d[2]; });
				
			values.enter().append("text")
				.attr("class", "value")
				.attr("x", xScale(0));

			values.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.text(function(d) {
					return Math.round(d[1]);
				})
				.attr("x", function(d) {
					if(d[1] < 0) {
						return xScale(d[1]) + 10;
					} else {					
						return xScale(d[1]) - 20;
					}
				})
				.attr("y", function(d, i) { 
					return yScale(i) + (h / dataset.length / 2) + 6;
				});
				
			values.exit()
				.remove();

			// names
			var names = barchart.selectAll("text.name")
				.data(dataset, function(d) { return d[2]; });
				
			names.enter().append("text")
				.attr("class", "name")
				.attr("text-anchor", "right")
				.attr("x", -10)
				.text(function(d, i) {
					return d[0];
				});

			names.sort(function(a, b) {
					return d3.descending(a[1], b[1]);
				})
				.transition()
				.duration(1000)
				.attr("y", function(d, i) { 
					return yScale(i) + (h / dataset.length / 2) + 6;
				})
				.attr("x", function(d) {
					return 0;
				})
				.text(function(d, i) {
					return d[0];
				});

			names.exit()
				.remove();
				
			barchart.select("g")
				.data(dataset)
				.transition()
				.duration(1000)
				.attr("transform", "translate(0," + (h - 20) + ")")
				.call(xAxis);
}