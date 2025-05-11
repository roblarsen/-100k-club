import { RecordSale } from "./RecordSale";
import * as _ from "lodash";
import * as d3 from "d3";

export function drawChart(data: Array<RecordSale>) {

  data = data.filter((d: RecordSale) => {
    const mdy = d.salesDate.split("-");
    return (
      Number(mdy[0]) !== 0 
    )
  });


  const colors = {
    "comicconnect":"#3EF77F",
    "heritage":"#F7AF3E",
    "comiclink":"#3EF7E8",
    "pedigreecomics":"#F77A3E",
    "metropolis":"#5FA29D",
    "default":"#5A7864"
  };

   const years = [];
    data.forEach((d: RecordSale) => {
      const mdy = d.salesDate.split("-");
      console.log(Number(mdy[0]), mdy[0]);
      if (Number(mdy[0]) !== 0) {
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
  const y = d3.scaleLinear()
    .domain([25000, maxPrice+(maxPrice*.1)])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

const tooltip = d3
    .select("#viz")
    .append("div")
    .style("display", "none")
    .attr("class", "tooltip");

  const showTooltip = (e: MouseEvent) => {
    const text = `
    <h3>${d3.select(e.target).datum().title} ${d3.select(e.target).datum().issue} ${d3.select(e.target).datum().gradeSrc} ${d3.select(e.target).datum().grade}  ${d3.select(e.target).datum().pedigree}</h3>
    <p>${d3.select(e.target).datum().venue} ${d3.select(e.target).datum().salesDate}</p>
    <p class="price">$${d3.select(e.target).datum().price.toLocaleString()}</p>

  `;
  tooltip
      .style("display", "block")
      .html(text)
      .style("left", `${d3.pointer(e)[0] +30}px}`)
      .style("top", `${d3.pointer(e)[1] + 30}px}`);
  };
  const moveTooltip = (e: MouseEvent) => {
    tooltip
      .style("left", `${d3.pointer(e)[0] + 60}px`)
      .style("top", `${d3.pointer(e)[1] + 30}px`);
  };
  const hideTooltip = () => {
    tooltip.style("display", "none");
  };



    svg.append('g')
    .selectAll("sales")
    .data(data) 
    .enter()
    .append("circle")
      .attr("cx", function (d:RecordSale) { return x(new Date(d.salesDate)); } )
      .attr("cy", function (d:RecordSale) { return y(d.price); } )
      .attr("r", 5)
      .attr("class", function (d:RecordSale) { return d.venue.toLocaleLowerCase(); })
      .style("fill", function (d:RecordSale) { 
        if (d.venue.toLocaleLowerCase() in colors) {
          return colors[d.venue.toLocaleLowerCase()];
        } else {
          return colors["default"];
        }
       })
      .style("opacity", 0.7)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);
let legend = d3.select("#viz")
       .append("ul")
       .selectAll("legend")
       .data(Object.keys(colors))
        .enter()
        .append("li")
        .attr("class", function (d) { return d; })
        .style("background-color", function (d) { return colors[d]; })
        .text(function (d) {
          if (d === "default") {
            return "Other";
          } else {
            return d.charAt(0).toUpperCase() + d.slice(1);
          }
        }
      )
      .on("mouseover", function (e: MouseEvent) {
       console.log(e);
       svg.selectAll("#viz circle")
          .style("opacity", 0.1);
      svg.selectAll(`#viz circle.${e.target.className}`)
          .style("opacity", 1);
      })  

    
}