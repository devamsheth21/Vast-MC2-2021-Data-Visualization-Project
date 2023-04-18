// This is completed code of 1st plot - circular bar plot

// Hint: This is a good place to declare your global variables
var data
const margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 860 - margin.left - margin.right,
  height = 860 - margin.top - margin.bottom,
  innerRadius = 150,
  outerRadius = Math.min(width, height) / 2 - 70;
// outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

document.addEventListener('DOMContentLoaded', function () {
  d3.csv("data/popularlocationdata.csv").then(function (values) {

    data = values;
    drawCircularBarPlot();

  });
});

function drawCircularBarPlot() {
  // append the svg object
  var svg = d3.select("#circular_bar_svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  svg = svg.append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);



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

  // Tooltip
  var tooltip = d3.select("#question_1_div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("color", "black")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");



  // Add the bars
  svg
    .selectAll(".cc_bars")
    .data(data)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("class", "cc_bars")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius(innerRadius)
      .outerRadius(d => y(d['cc_count']))
      .startAngle(d => x(d.location))
      .endAngle(d => x(d.location) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius))
    .on("mouseover", function (_, d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function (_, d) {
      tooltip.html("").style("opacity", 0);
      d3.select(this).style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      d3.select(this).style("opacity", 0.7);
      tooltip.html('Total Transactions: ' + d['cc_count'] + '<br>' + 'Location: ' + d.location)
        .style("left", event.clientX + window.scrollX + 20 + "px")
        .style("top", event.clientY + window.scrollY - 20 + "px");
    });

  // Add the labels
  svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("text-anchor", function (d) { return (x(d.location) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x(d.location) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['cc_count']) + 10) + ",0)"; })
    .append("text")
    .text(d => d.location)
    .attr("transform", function (d) { return (x(d.location) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "14px")
    .attr("alignment-baseline", "middle")

  // Add the second series
  svg
    .selectAll(".lc_bars")
    .data(data)
    .join("path")
    .attr("class", "lc_bars")
    .attr("fill", "red")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius(d => ybis(0))
      .outerRadius(d => ybis(d['loyalty_count']))
      .startAngle(d => x(d.location))
      .endAngle(d => x(d.location) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius))
    .on("mouseover", function (_, d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function (_, d) {
      tooltip.html("").style("opacity", 0);
      d3.select(this).style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      d3.select(this).style("opacity", 0.7);
      tooltip.html('Total Transactions: ' + d['loyalty_count'] + '<br>' + 'Location: ' + d.location)
        .style("left", event.clientX + window.scrollX + 20 + "px")
        .style("top", event.clientY + window.scrollY - 20 + "px");
    });

}


