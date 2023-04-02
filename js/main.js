var abila;
var kronos;
var svg;
var abilaProjection;
var margin = {top:20, right:20, bottom:40, left:40},
    width = 1580 - margin.left - margin.right,
    height = 954 - margin.top - margin.bottom;

var gpsData;
var data = [];

document.addEventListener('DOMContentLoaded',function(){
    Promise.all([d3.json('data/abila.geojson'),d3.csv('data/gps.csv')]).then(function(values){
        abila = values[0];
        gpsData = values[1];
        for(let i=0; i<gpsData.length; i++){
            if(gpsData[i].id == 35){
                data.push(gpsData[i]);
            }
        }
        console.log(data);
        svg = d3.select('svg');
        svg.append('image')
            .attr('x',0)
            .attr('y',0)
            .attr('xlink:href','data/MC2-tourist.jpg')
            .attr('height',height)
            .attr('width',width)
            .attr('class','image')
            .attr('opacity',0.75);
        abilaProjection = d3.geoEquirectangular()
                            .fitSize([width,height],abila);
        //console.log(usaProjection);
        
        abilaPath = d3.geoPath().projection(abilaProjection);
        plotUSA();
        plotGPS();
        
    })
})

function plotUSA(){
    svg.selectAll('.abila')
        .data(abila.features)
        .join('path')
        .attr('class','abila')
        .attr('d',abilaPath)
        .attr('fill','white')
        .attr('stroke','black')
        .attr('stroke-width','1px')
}

function plotKronos(){
    svg.selectAll('.kronos')
        .data(kronos.features)
        .join('path')
        .attr('class','kronos')
        .attr('d',kronosPath)
}

function plotGPS(){
    svg.selectAll('.gps')
        .data(data)
        .join(
            function(enter){
                return enter
                .append('circle');
            }
        )
        .attr('class','gps')
        .attr('cx',d => abilaProjection([+d.long,+d.lat])[0])
        .attr('cy',d => abilaProjection([+d.long,+d.lat])[1])
        .attr('r',3)
        .style('fill','red')
        .style('opacity',0.5)
}