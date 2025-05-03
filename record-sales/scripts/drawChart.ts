import { Comic } from "./Comic";

export function drawChart(data: Comic[]) {
 


 /* import * as d3 from "d3";
 import { drawTable } from "./drawTable";
 import { drawChart } from "./drawChart";
 import { Comic } from "./Comic";
 
 let data: Comic[] = [];
 
 d3.json("data/books.json")
   .then((d) => {
     data = d.comics;
     drawChart(data);
     drawTable(data);
   })
   .catch((err) => {
   console.error("Error loading data:", err)});
 
 const margin = {top: 10, right: 30, bottom: 30, left: 60},
     width = 460 - margin.left - margin.right,
     height = 450 - margin.top - margin.bottom;
 
 
 // append the svg object to the body of the page
 const svg = d3.select("#viz")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");
 
 
   // Add X axis
   const x = d3.scaleLinear()
     .domain([0, 3000])
     .range([ 0, width ]);
   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));
 
   // Add Y axis
   const y = d3.scaleLinear()
     .domain([0, 400000])
     .range([ height, 0]);
   svg.append("g")
     .call(d3.axisLeft(y));
 
   // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
   // Its opacity is set to 0: we don't see it by default.
   const tooltip = d3.select("#my_dataviz")
     .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "1px")
     .style("border-radius", "5px")
     .style("padding", "10px")
 
 
 
   // A function that change this tooltip when the user hover a point.
   // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
   const mouseover = function(d) {
     tooltip
       .style("opacity", 1)
   }
 
   const mousemove = function(d) {
     tooltip
       .html("The exact value of<br>the Ground Living area is: " + d.GrLiconstea)
       .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
       .style("top", (d3.mouse(this)[1]) + "px")
   }
 
   // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
   const mouseleave = function(d) {
     tooltip
       .transition()
       .duration(200)
       .style("opacity", 0)
   }
 
   // Add dots
   svg.append('g')
     .selectAll("dot")
     .data(data.filter(function(d,i){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
     .enter()
     .append("circle")
       .attr("cx", function (d) { return x(d.GrLiconstea); } )
       .attr("cy", function (d) { return y(d.SalePrice); } )
       .attr("r", 7)
       .style("fill", "#69b3a2")
       .style("opacity", 0.3)
       .style("stroke", "white")
     .on("mouseover", mouseover )
     .on("mousemove", mousemove )
     .on("mouseleave", mouseleave )
 
 })
 
  */
    
}