var ringdata,ringsvg,filtereddata,ringheight,ringwidth,inwidth,inringheight,maxRadius,minRadius,parseTime,parsedate
var dateToRadius,timeScale,uniquedates
var loc,cc

// var colorMap = {
//     "Travel and Accommodation": "#FFC107",
//     "Miscellaneous": "#9E9E9E",
//     "Retail": "#3F51B5",
//     "Food and Beverage": "#FF5722",
//     "Industrial": "#607D8B"
//   };
var colorMap = {
    "Travel and Accommodation": "#66c2a5",
    "Miscellaneous": "#fc8d62",
    "Retail": "#8da0cb",
    "Food and Beverage": "#e78ac3",
    "Industrial": "#a6d854",
  };
  var loctype = {
    "Abila Airport": "Travel and Accommodation",
    "Abila Scrapyard": "Miscellaneous",
    "Abila Zacharo": "Miscellaneous",
    "Ahaggo Museum": "Travel and Accommodation",
    "Albert's Fine Clothing": "Retail",
    "Bean There Done That": "Food and Beverage",
    "Brew've Been Served": "Food and Beverage",
    "Brewed Awakenings": "Food and Beverage",
    "Carlyle Chemical Inc.": "Industrial",
    "Chostus Hotel": "Travel and Accommodation",
    "Coffee Cameleon": "Food and Beverage",
    "Coffee Shack": "Food and Beverage",
    "Daily Dealz": "Retail",
    "Desafio Golf Course": "Travel and Accommodation",
    "Frank's Fuel": "Miscellaneous",
    "Frydos Autosupply n' More": "Retail",
    "Gelatogalore": "Food and Beverage",
    "General Grocer": "Retail",
    "Guy's Gyros": "Food and Beverage",
    "Hallowed Grounds": "Food and Beverage",
    "Hippokampos": "Food and Beverage",
    "Jack's Magical Beans": "Food and Beverage",
    "Kalami Kafenion": "Food and Beverage",
    "Katerina’s Café": "Food and Beverage",
    "Kronos Mart": "Retail",
    "Kronos Pipe and Irrigation": "Industrial",
    "Maximum Iron and Steel": "Industrial",
    "Nationwide Refinery": "Industrial",
    "Octavio's Office Supplies": "Retail",
    "Ouzeri Elian": "Food and Beverage",
    "Roberts and Sons": "Miscellaneous",
    "Shoppers' Delight": "Retail",
    "Stewart and Sons Fabrication": "Miscellaneous",
    "U-Pump": "Miscellaneous"
};
document.addEventListener('DOMContentLoaded', function()
{
    Promise.all([d3.csv('data/cctime_data.csv', function(d) {
        return {
          date: d.date,  //d3.timeParse("%Y-%m-%d")(d.date), // Parse the date string into a Date object
          price: +d.price,
          last4ccnum : +d.last4ccnum,
          location : d.location,
          time: d.time
        };
      })]).then(function (values)
    {   
        ringdata = values[0]
        // console.log(ringdata)


        ringwidth = 900;
        ringheight = 900;
        ringsvg = d3.select("#ring_svg")
                    // .append("svg")
                    // .attr("width", ringwidth)
                    // .attr("height", ringheight)
        var margin = { top: 30, right: 30, bottom: 30, left: 100 };  
        inwidth = ringwidth - margin.left - margin.right;
        inringheight = ringheight - margin.top - margin.bottom;      
        // ringsvg.attr('transform', `translate(${margin.left},${margin.top})`);
        uniquedates = new Set(ringdata.map(function(d) { return d.date; }))
        calend()
        UpdateData()
        legends()
        DrawChart()
    })        
})
function UpdateData()
{
    var selected_option = document.getElementById("dropdownloc").value;
    var selectedcc = document.getElementById("dropdowncc").value;    
    var allcc = (selectedcc == '1')
    var alloc = (selected_option == '1')
    // console.log(selectedcc)
    // console.log(selected_option)
    selectLinkByCcNum(selectedcc);  
    filtereddata = ringdata.filter(d => (((d.last4ccnum ==selectedcc) || allcc ) && ((d.location == selected_option) || alloc)))
    // console.log(filtereddata)
}
function UpdateChart()
{   
    UpdateData()
    days.remove()
    timelabel.remove()
    time.remove()
    DrawChart()
}

function Updatering(d,i){
    // console.log("update",i)
    ringsvg.selectAll(".transactions")
    .style("visibility","hidden");
    // .attr("fill","red");

    if(i=='dALL'){
        ringsvg.selectAll(".transactions")
        .style('stroke','white')
        .style("visibility","visible");
    }
    else{
        d3.selectAll('[id*="' + i + '"]')
    .style('stroke','white')
    .style("visibility","visible");
    }
}
function timetoangle(time)
{
        return (timeScale(parseTime(time))*Math.PI)/180
}
function DrawChart()
{  
    parsedate = d3.timeParse("%Y-%m-%d");
    parseTime = d3.timeParse("%H:%M:%S");
    maxRadius = (Math.min(inwidth,inringheight))/2 -50
    // console.log(maxRadius)
    minRadius = 50
    // console.log(filtereddata)
    // console.log(d3.extent(filtereddata,d => d.date))

    dateToRadius = d3.scaleTime()
                        .domain(d3.extent(ringdata,d => parsedate(d.date)))
                        .range([minRadius, maxRadius]); 

    timeScale = d3.scaleLinear()
        .domain([parseTime("00:00:00"), parseTime("23:59:59")])
        .range([360, 0]);
    
    // var uniquedates = new Set(ringdata.map(function(d) { return d.date; }))
   
    // console.log(dateToRadius(parsedate("2014-01-06")))
    // console.log(uniquedates)
    
     // console.log(timetoangle("00:00:00")*(180/Math.PI))
    // console.log(timetoangle("06:00:00")*(180/Math.PI))
    // console.log(timetoangle("09:00:00")*(180/Math.PI))
    // console.log(timetoangle("03:00:00")*(180/Math.PI))
    // console.log(timetoangle("12:00:00")*(180/Math.PI))
    // console.log(timetoangle("15:00:00")*(180/Math.PI))
    // console.log(timetoangle("18:00:00")*(180/Math.PI))
    // console.log(timetoangle("21:00:00")*(180/Math.PI))
    // console.log(timetoangle("23:59:59")*(180/Math.PI))
    // console.log(Math.cos((Math.PI)/3))
    // console.log(uniquedates)
    days = ringsvg.selectAll(".days")
    .data(Array.from(uniquedates))
    // .enter()
    .join("circle")
    // .attr("id",d => d.location)
    .attr("cx", inwidth/2 )
    .attr("cy", inringheight / 2)
    .attr("r", d =>  dateToRadius(parsedate(d)))
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("stroke-ringwidth", 1)
    .style("opacity",0.3);
    
    
    daylabel = ringsvg.selectAll(".day-label")
    .data(Array.from(uniquedates))
    .join("text")
    .attr("class", "day-label")
    .attr("text-anchor", "middle")
    .attr("x",  inwidth/2 )
    .attr("y",d => inringheight/2 - dateToRadius(parsedate(d))+9)
    .text(d => d.slice(5).replace("-","/"))
    .attr("opacity",0.4)
    .style("font-size",'9px');
    
   
    ringsvg.selectAll('line')
      .data(d3.range(2))
      .join('line')
      .attr('x1', d => inwidth/2 + Math.cos(d * Math.PI / 2) * maxRadius)
      .attr('y1', d => inringheight/2 + Math.sin(d * Math.PI / 2) * maxRadius)
      .attr('x2', d => inwidth/2 + Math.cos(d * Math.PI / 2 + Math.PI) * maxRadius)
      .attr('y2', d => inringheight/2 + Math.sin(d * Math.PI / 2 + Math.PI) * maxRadius)
      .attr('stroke', 'black')
      .style('stroke-dasharray','10,10')
      .attr('opacity',0.2);

    timelabelangles = d3.range(360,0,-45)
    timelabelangles.forEach((x,i) => timelabelangles[i] = timelabelangles[i]*(Math.PI/180))
    // console.log(timelabelangles)

    timelabel = ringsvg.selectAll(".time-label")
      .data(timelabelangles)
      .join("text")
      .attr("class", "time-label")
      .attr("text-anchor", "middle")
      .attr("x", d => inwidth/2  + (maxRadius+15) * Math.cos(d) )
      .attr("y",d => inringheight/2  + (maxRadius+15) * Math.sin(d)+5)
      .text((d,i) => i*3);
    
      time = ringsvg.selectAll(".transactions")
            .data(filtereddata)
            .join("circle")
            .attr("class","transactions")
            .attr("cx", function(d) { return inwidth/2 + dateToRadius(parsedate(d.date)) * Math.cos(timetoangle(d.time)); })
            .attr("cy", function(d) { return inringheight/2 + dateToRadius(parsedate(d.date)) * Math.sin(timetoangle(d.time)); })
            .attr("r", 3)
            .attr("id",d=> "c"+d.last4ccnum + '_t'  + d.time + '_d' + d.date + '_l'+ d.location)
            .attr("fill",d => colorMap[loctype[d.location]])
            .style("visibility","visible")
            .style("opacity",1);
      time.append("svg:title")
            .text(function(d) {
            return  "Locationr: " + d.location +
                    "\nTime: " + d.time + " time\n" +
                    "Date: " + d.date + " date\n" +
                    "\nPrice :" + d.price +
                    "\n CCnum : " + d.last4ccnum;})
        
        // const arcGen = (innerRadius, outerRadius, startAngle, endAngle) => d3.arc()
        // .innerRadius(innerRadius)
        // .outerRadius(outerRadius)
        // .startAngle(startAngle)
        // .endAngle(endAngle);
                    
                    
                    
        // ringsvg.selectAll('.arc')
        // .data(d3.range(2))
        // .join('path')
        // .attr('class', 'arc')
        // .attr('d', d => arcGen(minRadius, maxRadius, d*Math.PI, d*Math.PI + Math.PI))
        // .attr('fill', 'red' );
                    
   
    
}

function legends()
{
    cc = new Set(ringdata.map(function(d) { return d.last4ccnum; }));
    // console.log(cc)
    loc = new Set(ringdata.map(function(d) { return d.location; }));
    // console.log(loc)
    var select = document.getElementById("dropdownloc");
    loc.forEach(d => { 
        var option = document.createElement("option");
        option.text = d;
        option.value = d;
        select.add(option);
    })

    select = document.getElementById("dropdowncc");
    cc.forEach(d => { 
        var option = document.createElement("option");
        option.text = d;
        option.value = d;
        select.add(option);
    })

    const legendWidth = 150;
    const legendHeight = 20 * 4; // height of each item in legend is 20
    const legendr = ringsvg
    .append("g")
    .attr("class", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("transform",'translate(583,0)');

    legendr.selectAll("rect")
    .data(Object.keys(colorMap))
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 20) // position each item vertically
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", d => colorMap[d])
    .on('click', (d,i) =>  Updatering(i,"l"+ Object.keys(loctype)[Object.values(loctype).indexOf(i)] ));  

    legendr.selectAll("text")
    .data(Object.keys(colorMap))
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", (d, i) => i * 20 + 12) // position the text vertically
    .text(d => d); // set the text to the key value

  
}

function calend()
{
    

var cal = ringsvg
  .append("g")
  .attr("width", 120)
  .attr("height", 120);

// Create a grid of squares for each date
var clickedcal = null
var gridSize = 25,
    padding = 5 ;
uniquedates.add('ALL')

cal.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 120)
  .attr("height", 138)
  .style("fill", "#f7f7f7");

cal.append("text")
.attr("x", 60)
.attr("y", 130)
.attr("text-anchor", "middle")
.attr('fill',"green")
.text("Calendar");

var squares = cal.selectAll(".square")
  .data(Array.from(uniquedates))
  .join("rect")
  .attr("class", "square")
  .attr("x", function(d, i) { return i % 4 * (gridSize + padding); })
  .attr("y", function(d, i) { return Math.floor(i / 4) * (gridSize + padding); })
  .attr("width", gridSize)
  .attr("height", gridSize)
  .style("fill", "lightgreen")
  .style("stroke","black")
  .on("click", function(d,i) {
    // Call your update chart function with the selected date
    if(clickedcal == i){
        squares.style("stroke","black");
        d3.selectAll(".transactions")
        .style("visibility","visible")
        .style("stroke","none")
        // .style("stroke-width",0);
        clickedcal = null;
    }
    else{
        squares.style("stroke","black")
        d3.select(this).style("stroke","red")
        clickedcal = i;
        i = "d"+i
        Updatering(d,i);
      
    }   

  });

// Add labels for each date
var labels = cal.selectAll(".label")
  .data(Array.from(uniquedates))
  .join("text")
  .attr("class", "label")
  .style("pointer-events","none")
  .attr("x", function(d, i) { return i % 4 * (gridSize + padding) + gridSize / 2; })
  .attr("y", function(d, i) { return Math.floor(i / 4) * (gridSize + padding) + gridSize / 2; })
  .text(function(d) { return d.slice(-3).replace('-',''); })
  .style("text-anchor", "middle")
  .style("dominant-baseline", "central")
  .style("fill", "#333");
}


