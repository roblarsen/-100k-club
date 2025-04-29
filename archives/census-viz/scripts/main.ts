import * as d3 from "d3"

// Sample data for the bubble chart
const data = [
  {
     "title":"Action Comics #1","date":"04/18/1938","average":"4.18", "population":"44", color:"#003366", "id":"action-comics-1"
 },
 {
     "title":"Detective Comics #27","date":"03/30/1939","average":"4.59", "population":"38", color:"#003366", "id":"detective-comics-27"
 },
 {
     "title":"Superman #1","date":"05/18/1939","average":"2.51", "population":"78"  , "id":"superman-1"
 },
 {
     "title":"Marvel Comics #1","date":"09/31/39","average":"4.27", "population":"37"  , "id":"marvel-comics-1"
 },
 {
     "title":"Batman #1","date":"04/25/1940","average":"3.20", "population":"153"  , "id":"batman-1"
 },
 {
     "title":"All American Comics #16","date":"05/17/1940","average":"4.10", "population":"33"  , "id":"all-american-comics-16"
 },
 {
     "title":"Captain America Comics #1","date":"12/20/1940","average":"5.10", "population":"97"  , "id":"captain-america-comics-1"
 },
 {
     "title":"Action Comics #7","date":"10/25/1938","average":"3.28", "population":"33"  , "id":"action-comics-7"
 },
 {
     "title":"Detective Comics #31","date":"07/30/1939","average":"2.97", "population":"66"  , "id":"detective-comics-31"
 },
 {
     "title":"Whiz Comics #2 (#1)","date":"11/08/1939","average":"3.31", "population":"33"  , "id":"whiz-2"
 }

 ];

// Set up SVG dimensions
const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1024 - margin.left - margin.right,
    height = 660 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          
          
          
          const tooltip = d3.select("#chart")
          .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position","absolute");

            const showTooltip = function(d) {

                const text = `
                    <p>Title: ${d3.select(d.srcElement).datum().title}</p>
                    <p>Date: ${d3.select(d.srcElement).datum().date}</p>
                    <p>Average Grade: ${d3.select(d.srcElement).datum().average}</p>
                    <p>Population: ${d3.select(d.srcElement).datum().population}</p>
                    
                    `
                tooltip
                  .transition()
                  .duration(200)


                tooltip
                  .style("opacity", 1)
                  .html(text)
                  .style("left", (d3.pointer(event)[0]+30) + "px")
                  .style("top", (d3.pointer(event)[1]+30) + "px")
              }
              const moveTooltip = function(d) {
                console.log(d3.pointer(event))
                tooltip
                  .style("left", (d3.pointer(event)[0]+30) + "px")
                  .style("top", (d3.pointer(event)[1]+30) + "px")
              }
              const hideTooltip = function(d) {
                tooltip
                  .style("opacity", 0)
              }
  // Add X axis
  const x = d3.scaleTime([new Date(1938, 0, 1), new Date(1941, 6, 12)], [0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    console.log(x
    .ticks())

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 6])
    .range([  height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([0, 250])
    .range([ 1, 250]);

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("image")
      .attr("x", function (d) { return x(new Date(d.date)) - z(d.population)/2 } )
      .attr("y", function (d) { return y(d.average) - z(d.population)/2 } )
      .attr("width", function (d) { return z(d.population) })
      .attr("height",function (d) { return z(d.population) })
      .attr("class", "circle")
      .attr("href",function (d) { console.log(d.id); return "/img/"+d.id+".jpg" } )
      .attr("clip-path",  function(d) {return `url(#${d.id})`})
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )


  svg.append("defs")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("clipPath")
      .attr("id", function (d) { return d.id })
      .append("circle")
      .attr("cx", function (d) { return x(new Date(d.date)) } )
      .attr("cy",  function (d) { return y(d.average)})
      .attr("r", function (d) { return z(d.population)/2 })
      .attr("fill","black")
    


