function makeGlobe(divId) {

    var diameter = d3.select(divId).style("width").split("px")[0],
        globeColor = d3.scale.category10();

    var projection = d3.geo.orthographic()
        .scale(150)
        .clipAngle(90);
        
    
    var canvas = d3.select(divId).append("canvas")
        .attr("width",  diameter)
        .attr("height", diameter) 

    var c = canvas.node().getContext("2d");
        c.translate(-280, 0)

    var path = d3.geo.path()
        .projection(projection)
        .context(c);

    var title = d3.select("#globe").append("div")
        .attr("class", "gtitle")
        .style("width", diameter+"px");

    var description = d3.select("#globe").append("div")
        .attr("class", 'description')
        .style("width", diameter+"px");

    queue()
        .defer(d3.json, "js/world-110m.json")
        .defer(d3.tsv, "js/world-country-names.tsv")
        .defer(d3.csv, "js/populations.csv")
        .await(ready);

    function ready(error, world, names, populations) {
      var globe = {type: "Sphere"},
          land = topojson.object(world, world.objects.land),
          countries = topojson.object(world, world.objects.countries).geometries,
          borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a.id !== b.id; }),
          i = -1,          
          n = populations.length;
          
      countries = countries.filter(function(d) {
        return names.some(function(n) {
          if (d.id == n.id) return d.name = n.name;
        });
      }).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      (function transition() {
            d3.transition()
                .duration(1250)
                .each("start", function() {
                  title.text(populations[i = (i + 1) % n].Population);
                  description.text(populations[i].Name);
                })
                .tween("rotate", function() {
                     var r = d3.interpolate(projection.rotate(), [-populations[i].Lon, -populations[i].Lat]);
                     return function(t) {      
                       projection.rotate(r(t));
                       var l = projection([populations[i].Lon,populations[i].Lat]);                  
                       // var l = projection([p[0],p[1]]);
                       c.clearRect(280, 0, diameter, diameter);
                       // c.fillStyle = "red", c.beginPath(), path(globe), c.fill();
                       c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
                       // c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();            
                       c.fillStyle = globeColor(populations[i].Region), c.beginPath(), c.arc(l[0], l[1], 5, 0, 5 * Math.PI, false), c.fill();
                       c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                       // c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
                       
                     };
                 })
              .transition()
                .each("end", transition);
          })();
    }
}