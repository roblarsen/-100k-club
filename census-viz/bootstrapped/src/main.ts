import * as d3 from "d3";

// Sample data for the bubble chart
const data = [
  {
     "title":"Action Comics #1","date":"06/01/1938","average":"4.18", "population":"44"
 },
 {
     "title":"Detective Comics #27","date":"05/01/1939","average":"4.59", "population":"38"
 },
 {
     "title":"Superman #1","date":"07/01/1939","average":"2.51", "population":"78"
 },
 {
     "title":"Marvel Comics #1","date":"11/01/39","average":"4.27", "population":"37"
 },
 {
     "title":"Batman #1","date":"03/01/1940","average":"3.20", "population":"153"
 },
 {
     "title":"All American Comics #16","date":"7/01/1940","average":"4.10", "population":"33"
 },
 {
     "title":"Captain America Comics #1","date":"03/01/1941","average":"5.10", "population":"97"
 },
 {
     "title":"Action Comics #7","date":"12/01/1938","average":"3.28", "population":"33"
 },
 {
     "title":"Detective Comics #31","date":"09/01/1939","average":"2.97", "population":"66"
 },
 {
     "title":"Whiz Comics #2 (#1)","date":"02/01/1940","average":"3.31", "population":"33"
 }

 ];

// Set up SVG dimensions
const width = 800;
const height = 600;

// Create an SVG container
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Add circles for the bubble chart
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x * 10)
  .attr("cy", (d) => d.y * 10)
  .attr("r", (d) => d.radius)
  .attr("fill", (d) => d.color)
  .attr("opacity", 0.7);