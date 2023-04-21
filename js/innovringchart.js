var ringdata,ringsvg,filtereddata,ringheight,ringwidth,inwidth,inringheight,maxRadius,minRadius,parseTime,parsedate
var dateToRadius,timeScale
var loc,cc
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

    filtereddata = ringdata.filter(d => (((d.last4ccnum ==selectedcc) || allcc ) && ((d.location == selected_option) || alloc)))
    console.log(filtereddata)
}
function UpdateChart()
{   

    UpdateData()
    days.remove()
    timelabel.remove()
    time.remove()
    DrawChart()

   

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
    
    var uniquedates = new Set(ringdata.map(function(d) { return d.date; }))
   
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
    console.log(uniquedates)
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
            .attr("cx", function(d) { return inwidth/2 + dateToRadius(parsedate(d.date)) * Math.cos(timetoangle(d.time)); })
            .attr("cy", function(d) { return inringheight/2 + dateToRadius(parsedate(d.date)) * Math.sin(timetoangle(d.time)); })
            .attr("r", 3);

      time.append("svg:title")
            .text(function(d) {
            return  "Locationr: " + d.location +
                    "\nTime: " + d.time + " time\n" +
                    "Date: " + d.date + " date\n" +
                    "\nPrice :" + d.price +
                    "\n CCnum : " + d.last4ccnum;})
        
        const arcGen = (innerRadius, outerRadius, startAngle, endAngle) => d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);
                    
                    
                    
        ringsvg.selectAll('.arc')
        .data(d3.range(2))
        .join('path')
        .attr('class', 'arc')
        .attr('d', d => arcGen(minRadius, maxRadius, d*Math.PI, d*Math.PI + Math.PI))
        .attr('fill', 'red' );
                    
   
    
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
    // var option = document.createElement("option");
    // option.text = "Kiwi";
    
    // select = d3.select("#dropdownloc")
    // .selectAll("option")
    // .data(Array.from(loc))
    // .append("option")
    // .text(function(d) { return d; })
    // .attr("value", function(d) { return d; });
    
    // select = d3.select("#dropdowncc")
    // .selectAll("option")
    // .data(Array.from(cc))
    // .append("option")
    // .text(function(d) { return d; })
    // .attr("value", function(d) { return d; });
}