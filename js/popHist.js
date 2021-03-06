function createHistogram(svg, values, margin, width, height) {
   
   var formatCount = d3.format(",.0f");

   var x = d3.scale.linear()
       .domain([0, 1])
       .range([0, width]);

   // Generate a histogram using twenty uniformly-spaced bins.
   var data = d3.layout.histogram()
       .bins(x.ticks(20))
       (values);

   var y = d3.scale.linear()
       .domain([0, d3.max(data, function(d) { return d.y; })])
       .range([height, 0]);

   var xAxis = d3.svg.axis()
       .scale(x)
       .orient("bottom");

   var bar = svg.selectAll(".bar")
       .data(data)
     .enter().append("g")
       .attr("class", "bar")
       .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

   bar.append("rect")
       .attr("x", 1)
       .attr("width", x(data[0].dx) - 1)
       .attr("height", function(d) { return height - y(d.y); });

   bar.append("text")
       .attr("dy", ".75em")
       .attr("y", 6)
       .attr("x", x(data[0].dx) / 2)
       .attr("text-anchor", "middle")
       .text(function(d) { return formatCount(d.y); });

   svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
}