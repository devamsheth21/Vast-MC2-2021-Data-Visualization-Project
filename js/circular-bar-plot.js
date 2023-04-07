// This is completed code of 1st plot - circular bar plot

// Hint: This is a good place to declare your global variables

const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 860 - margin.left - margin.right,
    height = 860 - margin.top - margin.bottom,
    innerRadius = 150,
    outerRadius = Math.min(width, height) / 2 -70;
    // outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

document.addEventListener('DOMContentLoaded', function () {
// append the svg object
const svg = d3.select("#circular-bar-plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2 + margin.left}, ${height/2 + margin.top})`);

d3.csv("popularlocationdata.csv").then( function(data) {

  // X scale: common for 2 data series
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => d.location)); // The domain of the X axis is the list of states.

  // Y scale outer variable
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([2, 220]); // Domain of Y is from 0 to the max seen in the data

  // Second barplot Scales
  const ybis = d3.scaleRadial()
      .range([innerRadius, 3])   // Domain will be defined later.
      .domain([1, 220]);

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "#69b3a2")
      .attr("class", "yo")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['cc_count']))
          .startAngle(d => x(d.location))
          .endAngle(d => x(d.location) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (x(d.location) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.location) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['cc_count'])+10) + ",0)"; })
      .append("text")
        .text(d => d.location)
        .attr("transform", function(d) { return (x(d.location) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle")

  // Add the second series
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "red")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius( d => ybis(0))
          .outerRadius( d => ybis(d['loyalty_count']))
          .startAngle(d => x(d.location))
          .endAngle(d => x(d.location) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))


  

});
});


