import * as d3 from "d3";

//normally svg won't be an unused variablesince you'll continue to use it throughout your code


//eslint-disable-next-line @typescript-eslint/no-unused-vars
const svg = d3.select("#viz")
    .append("svg")
    .attr("width", 200)
    .attr("height", 100)
    .append("g")
    .append("text")
    .attr("x", 50)
    .attr("y", 50)
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .text("Hello, D3.js!")