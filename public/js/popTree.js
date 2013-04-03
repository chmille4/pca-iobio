function createPopTree(jsonUrl, svg, m, w, h, onClickCallback) {
   var i=0;
   var root;
   
   var tree = d3.layout.tree()
       .size([w,h]);

   var diagonal = d3.svg.diagonal()
       .projection(function(d) { return [d.x, d.y]; });

   var vis = svg.append("svg:g")
       .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

   d3.json(jsonUrl, function(json) {

     root = json;
     root.x0 = h / 2;
     root.y0 = 0;

     function toggleAll(d) {
       if (d.children) {
         d.children.forEach(toggleAll);
         toggle(d);
       }
     }


     update(root);
     // update(roots[1])
   });

   function update(source) {
     var duration = d3.event && d3.event.altKey ? 5000 : 500;

     // Compute the new tree layout.
     var nodes = tree.nodes(root).reverse();

     // Normalize for fixed-depth.
     nodes.forEach(function(d) { d.y = d.depth * d.level * 50; });

     // Update the nodes…
     var node = vis.selectAll("g.node")
         .data(nodes, function(d) { return d.id || (d.id = ++i); });

     // Enter any new nodes at the parent's previous position.
     var nodeEnter = node.enter().append("svg:g")
         .attr("class", function(d) { if (d.root) return "root node"; else return d.level > 0 ? "node pop" : "node"; })
         .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
         .attr("id", function(d) { return d.name + "-vcf-graph"})
         .on("click", function(d) { toggle(d); update(d); onClickCallback(d); });

     nodeEnter.append("svg:circle")
         .attr("r", 1e-6)
         .style("fill", function(d) { return d._children || d._vcf ? "lightsteelblue" : "#fff"; });

     nodeEnter.append("svg:text")
         .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
         .attr("dy", ".35em")
         .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
         .text(function(d) { return d.name; })
         .style("fill-opacity", 1e-6);
      
      nodeEnter.filter(".pop").append("svg:rect")
         .attr("x", 0)
         .attr("y", 0)
         .attr("width", 1e-6)
         .attr("height", 1e-6)
         .style("stoke-opacity", 1e-6);

     // Transition nodes to their new position.
     var nodeUpdate = node.transition()
         .duration(duration)
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

     nodeUpdate.select("circle")
         .attr("r", 4.5)
         .style("fill", function(d) { return d._children || d._vcf ? "lightsteelblue" : "#fff"; });

     nodeUpdate.select("text")
         .style("fill-opacity", 1);

     var numBoxesPerLevel = nodeUpdate.selectAll("rect").length / 2;
     nodeUpdate.select("rect")
        .attr("x", w / numBoxesPerLevel / -2)
        .attr("y", 8)
        .attr("width", w / numBoxesPerLevel )
        .attr("height", 50)
        .attr("stroke-opacity", 1);
  
     nodeUpdate.filter(function(d) { return d._vcf; }).select("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1e-6)
        .attr("height", 1e-6)
        .attr('stroke-opacity', 1e-6);     

     // Transition exiting nodes to the parent's new position.
     var nodeExit = node.exit().transition()
         .duration(duration)
         .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
         .remove();

     nodeExit.select("circle")
         .attr("r", 1e-6);

     nodeExit.select("text")
         .style("fill-opacity", 1e-6);

     nodeExit.select("rect")
         .attr("width", 1e-6)
         .attr("height", 1e-6)
         .attr("x", 0)
         .attr("fill-opacity", 1e-6)

  
     // Update the links…
     var link = vis.selectAll("path.link")
         .data(tree.links(nodes), function(d) { return d.target.id; });

     // Enter any new links at the parent's previous position.
     link.enter().insert("svg:path", "g", "")
         .attr("class", function(d) { 
            return d.source.root ? "root link" : "link"
         })
         .attr("d", function(d) {
           var o = {x: source.x0, y: source.y0};
           return diagonal({source: o, target: o});
         })
       .transition()
         .duration(duration)
         .attr("d", diagonal);

     // Transition links to their new position.
     link.transition()
         .duration(duration)
         .attr("d", diagonal);

     // Transition exiting nodes to the parent's new position.
     link.exit().transition()
         .duration(duration)
         .attr("d", function(d) {
           var o = {x: source.x, y: source.y};
           return diagonal({source: o, target: o});
         })
         .remove();

     // Stash the old positions for transition.
     nodes.forEach(function(d) {
       d.x0 = d.x;
       d.y0 = d.y;
     });
   }

   // Toggle children.
   function toggle(d) {
     if (d.children) {
       d._children = d.children;
       d.children = null;
     } else {
       d.children = d._children;
       d._children = null;
     }
     if (d.vcf) {
       d._vcf = d.vcf
       d.vcf = null;
     } else {
       d.vcf = d._vcf;
       d._vcf = null;
     }
   }
}
