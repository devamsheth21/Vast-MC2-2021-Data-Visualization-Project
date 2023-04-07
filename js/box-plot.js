// This is completed code of 5th plot - box plot



var margin = {top: 10, right: 30, bottom: 130, left: 70},
    width = 1060 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;
    
document.addEventListener('DOMContentLoaded', function () {
// append the svg object to the body of the page
var svg = d3.select("#box_plot_div")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Read the data and compute summary statistics for each specie
d3.csv("MC2/cc_data.csv").then( function(data) {
    console.log(data);
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.rollup(data, function(d) {
    q1 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.25)
    median = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.5)
    q3 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.75)
    interQuantileRange = q3 - q1
    min = q1 - 1.5 * interQuantileRange
    max = q3 + 1.5 * interQuantileRange
    return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
  }, function(d) { return d.location;});
  console.log(sumstat);
  
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["Brew've Been Served", 'Hallowed Grounds', 'Coffee Cameleon',
    'Abila Airport', 'Kronos Pipe and Irrigation',
    'Nationwide Refinery', 'Maximum Iron and Steel',
    'Stewart and Sons Fabrication', 'Carlyle Chemical Inc.',
    'Coffee Shack', 'Bean There Done That', 'Brewed Awakenings',
    "Jack's Magical Beans", "Katerina's Café", 'Hippokampos',
    'Abila Zacharo', 'Gelatogalore', 'Kalami Kafenion', 'Ouzeri Elian',
    "Guy's Gyros", 'U-Pump', "Frydos Autosupply n' More",
    "Albert's Fine Clothing", "Shoppers' Delight", 'Abila Scrapyard',
    "Frank's Fuel", 'Chostus Hotel', 'General Grocer', 'Kronos Mart',
    "Octavio's Office Supplies", 'Roberts and Sons', 'Ahaggo Museum',
    'Desafio Golf Course', 'Daily Dealz'])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([0,10000])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d[0]))})
      .attr("x2", function(d){return(x(d[0]))})
      .attr("y1", function(d){return(y(d[1].min))})
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


