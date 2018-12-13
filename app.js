var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("smokerdata.csv").then(function (smokerData) {

    smokerData.forEach(function (d) {
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.abbr = d.abbr;
    });

    var xScale = d3.scaleLinear()
        .domain(d3.extent(smokerData, d => d.age))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(smokerData, d => d.smokes)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.selectAll("circle")
        .data(smokerData)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.smokes))
        .attr("fill", "green")
        .attr("opacity", ".5")

    chartGroup.selectAll(".stateAbbr")
        .data(smokerData)
        .enter()
        .append("text")
        .classed("stateAbbr", true)
        .text(d => (d.abbr))
        .attr("dx", d => xScale(d.age))
        .attr("dy", d => yScale(d.smokes) + 3)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 10})`);

    labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .classed("active", true)
        .text("Age");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Smokes (%)");
});