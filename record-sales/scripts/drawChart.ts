import { RecordSale } from "./RecordSale";
import * as _ from "lodash";
import * as d3 from "d3";

export function drawChart(data: Array<RecordSale>) {

   const years = [];
    data.forEach((d: RecordSale) => {
      const mdy = d.salesDate.split("-");
      if (Number(mdy[0])> 1901) {
        years.push(mdy[0]);
      }
      
  });
  const maxPrice = _.maxBy(data, "price").price;
  const minYear = Math.min(...years) - 1;
  const maxYear = Math.max(...years) + 1;

 const margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 1440 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#viz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          console.log(maxYear,minYear);

  // Add X axis
 const x = d3.scaleTime(
    [new Date(minYear, 0, 1), new Date(maxYear, 5, 30)],
    [0, width]
  );
 
  const xGrid = d3
    .axisBottom()
    .scale(x)
    .tickFormat("")
    .ticks(5)
    .tickSizeInner(-height);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xGrid);

  
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


 
 
  // Add Y axis
  const y = d3.scaleLog()
    .domain([100000, maxPrice])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#my_dataviz")
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
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("The exact value of<br>the Ground Living area is: " + d.GrLivArea)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data) 
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(new Date(d.salesDate)); } )
      .attr("cy", function (d) { return y(d.price); } )
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .style("opacity", 0.3)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


    
}