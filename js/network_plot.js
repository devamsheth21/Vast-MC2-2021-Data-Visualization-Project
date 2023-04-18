document.addEventListener('DOMContentLoaded', function () {
    d3.json('data/new_network.json')
         .then(function (values) {
            // console.log(data);
            drawNetworkPlot(values);
         });
});

function drawNetworkPlot(netData)
{
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
    var svg = d3.select('#network_svg');
    svg = svg.append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // Initialize the links
    var link = svg
    .selectAll("line")
    .data(netData.links)
    .enter()
    .append("line")
      .style("stroke", "#aaa")
      .attr("id", d => "l"+d.source+"_"+d.target)

  // Initialize the nodes
    var node = svg
    .selectAll("circle")
    .data(netData.nodes)
    .enter()
    .append("circle")
      .attr("r", 20)
    .attr("id", d => "a"+d.id)
      .style("fill", "#69b3a2")
      .on("mouseover", function(d,i){
        d3.select(this).attr("r",25);
        var id = d.target.id;
        netData.links.map( x => {

            if("a"+x.source.id === id)
            {
                console.log(id);
                d3.select("#a"+x.target.id).attr("r",25)
                d3.select("#l"+x.source.id+"_"+x.target.id).style("stroke","blue").style("stroke-width","3px")
            }
            if("a"+x.target.id === id)
            {
                d3.select("#a"+x.source.id).attr("r",25)
                d3.select("#l"+x.source.id+"_"+x.target.id).style("stroke","blue").style("stroke-width","3px")
            }
        })
      })
      .on("mouseout", function(d,i){
        d3.select(this).attr("r",20);
        var id = d.target.id;
        netData.links.map( x => {

            if("a"+x.source.id === id)
            {
                console.log(id);
                d3.select("#a"+x.target.id).attr("r",20)
                d3.select("#l"+x.source.id+"_"+x.target.id).style("stroke","#aaa").style("stroke-width","1px")
            }
            if("a"+x.target.id === id)
            {
                d3.select("#a"+x.source.id).attr("r",20)
                d3.select("#l"+x.source.id+"_"+x.target.id).style("stroke","#aaa").style("stroke-width","1px")
            }
        })
      })
    

      var simulation = d3.forceSimulation(netData.nodes)                 // Force algorithm is applied to netData.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(netData.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-800))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);


    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x+6; })
         .attr("cy", function(d) { return d.y-6; });
    
  } 

  netData.locationNodes.map(x => d3.select("#a"+x.id).style("fill","red"));


}


