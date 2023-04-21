document.addEventListener('DOMContentLoaded', function () {
  d3.json('MC2/network-plot.json')
    .then(function (values) {
      // console.log(data);
      drawNetworkPlot(values);
    });
});

function drawNetworkPlot(netData) {
  var margin = { top: 50, right: 30, bottom: 100, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
  var svg = d3.select('#network_svg');
  svg = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var type = ['Security', 'Information Technology', 'Facilities', 'Executive', 'Engineering']

  var image_ref = {
    0: "data/circle-15.svg",
    1: "data/square-15.svg",
    2: "data/triangle.svg",
    3: "data/Star.svg",
    4: "data/hexagon.svg",
    5: "data/penta.svg"
  }
  var color = d3.scaleOrdinal().domain(type).range(d3.schemeSet2);
  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(netData.links)
    .enter()
    .append("line")
    .style("stroke", "#aaa")
    .attr("id", d => "l" + d.source + "_" + d.target)

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(netData.nodes)
    .enter()
    .append('image')
    .attr("xlink:href", d => image_ref[d.group])
    .attr("width", 25)
    .attr("height", 25)
    // .attr("r", 20)
    .attr("id", d => "a" + d.id)
    .on("mouseover", function (d, i) {
      var id = d.target.id;
      netData.links.map(x => {

        if ("a" + x.source.id === id) {
          d3.select("#a" + x.target.id).attr("r", 25)
          d3.select("#l" + x.source.id + "_" + x.target.id).style("stroke", "blue").style("stroke-width", "3px")
        }
        if ("a" + x.target.id === id) {
          d3.select("#a" + x.source.id).attr("r", 25)
          d3.select("#l" + x.source.id + "_" + x.target.id).style("stroke", "blue").style("stroke-width", "3px")
        }
      })
    })
    .on("mouseout", function (d, i) {

      var id = d.target.id;
      netData.links.map(x => {

        if ("a" + x.source.id === id) {
          d3.select("#a" + x.target.id).attr("r", 20)
          d3.select("#l" + x.source.id + "_" + x.target.id).style("stroke", "#aaa").style("stroke-width", "1px")
        }
        if ("a" + x.target.id === id) {
          d3.select("#a" + x.source.id).attr("r", 20)
          d3.select("#l" + x.source.id + "_" + x.target.id).style("stroke", "#aaa").style("stroke-width", "1px")
        }
      })
    })


  // legend
  svg
    .selectAll("legends")
    .data(Object.values(image_ref))
    .enter()
    .append('image')
    .attr("xlink:href", d => d)
    .attr("x", width - 130)
    .attr("y", (_, i) => height - 130 + i * 35)
    .attr("width", 25)
    .attr("height", 25)

  const legendText = ['Location', 'Security', 'Information Technology', 'Facilities', 'Executive', 'Engineering']

  svg
    .selectAll("legends")
    .data(legendText)
    .enter()
    .append('text')
    .text(d => d)
    .attr("x", width - 80)
    .attr("y", (_, i) => height - 112 + i * 35)
    .attr("width", 25)
    .attr("height", 25)


  var simulation = d3.forceSimulation(netData.nodes)                 // Force algorithm is applied to netData.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
      .id(function (d) { return d.id; })                     // This provide  the id of a node
      .links(netData.links)                                    // and this the list of links
    )
    .force("charge", d3.forceManyBody().strength(-800))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);


  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("x", function (d) { return d.x - 12; })
      .attr("y", function (d) { return d.y - 12; });

  }
}


