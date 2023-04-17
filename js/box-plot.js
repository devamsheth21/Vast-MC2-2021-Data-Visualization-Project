// This is completed code of 5th plot - box plot
var margin_box = {top: 10, right: 30, bottom: 130, left: 70},
    width_box = 1060 - margin_box.left - margin_box.right,
    height_box = 900 - margin_box.top - margin_box.bottom;

var data
document.addEventListener('DOMContentLoaded', function () {

// append the svg object to the body of the page
var svg = d3.select("#box_plot_svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
  svg = svg.append("g")
    .attr("transform",
          "translate(" + margin_box.left + "," + margin_box.top + ")");
// Read the data and compute summary statistics for each specie
d3.csv("MC2/cc_data_box.csv").then( function(values) {
    data = values
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.rollup(data, function(d) {
    q1 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.25)
    median = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.5)
    q3 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.75)
    interQuantileRange = q3 - q1
    min = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),0)
    max = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),1)
    return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
  }, function(d) { return d.location;});
  //console.log(sumstat);
  
  var x = d3.scaleBand()
    .range([ 0, width_box ])
    .domain(["Abila Airport",
    "Abila Scrapyard",
    "Abila Zacharo",
    "Ahaggo Museum",
    "Albert's Fine Clothing",
    "Bean There Done That",
    "Brew've Been Served",
    "Brewed Awakenings",
    "Carlyle Chemical Inc.",
    "Chostus Hotel",
    "Coffee Cameleon",
    "Coffee Shack",
    "Daily Dealz",
    "Desafio Golf Course",
    "Frank's Fuel",
    "Frydos Autosupply n' More",
    "Gelatogalore",
    "General Grocer",
    "Guy's Gyros",
    "Hallowed Grounds",
    "Hippokampos",
    "Jack's Magical Beans",
    "Kalami Kafenion",
    "Katerina's Cafe",
    "Kronos Mart",
    "Kronos Pipe and Irrigation",
    "Maximum Iron and Steel",
    "Nationwide Refinery",
    "Octavio's Office Supplies",
    "Ouzeri Elian",
    "Roberts and Sons",
    "Shoppers' Delight",
    "Stewart and Sons Fabrication",
    "U-Pump"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height_box + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Show the Y scale
  var y = d3.scaleLog()
    .domain([2,12000])
    .range([height_box, 0])

  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d[0]))})
      .attr("x2", function(d){return(x(d[0]))})
      .attr("y1", function(d){//console.log(d[1]);
	  return(y(d[1].min))})
      .attr("y2", function(d){return(y(d[1].max))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 30
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d[0])-boxWidth/2)})
        .attr("y", function(d){return(y(d[1].q3))})
        .attr("height", function(d){return(y(d[1].q1)-y(d[1].q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d[0])-boxWidth/2) })
      .attr("x2", function(d){return(x(d[0])+boxWidth/2) })
      .attr("y1", function(d){return(y(d[1].median))})
      .attr("y2", function(d){return(y(d[1].median))})
      .attr("stroke", "black")
      .style("width", 80)

// Add individual points with jitter
var jitterWidth = 20
svg
  .selectAll("indPoints")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d){return(x(d.location) - jitterWidth/2 + Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d.price))})
    .attr("r", 3)
    .style("fill", "white")
    .attr("stroke", "black")

});
});


