const data = [10, 20, 30, 40, 50];

const el = d3
  .select("ul")
  .selectAll("li")
  .data(data)
  .join(
    (enter) => enter.append("li").style("color", "purple"),
    (update) => update.style("color", "green"),
    (exit) => exit.remove()
  )
  .text((d) => d);

// el.enter()
//   .append("li")
//   .text((d) => d);

// el.exit().remove();

const drawChart = async () => {
  // data
  const dataset = await d3.json("data.json");
  const xAccesssor = (d) => d.currently.humidity;
  const yAccesssor = (d) => d.currently.apparentTemperature;
  // dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      right: 50,
      left: 50,
      bottom: 50,
    },
    ctrWidth: 0,
    ctrHeight: 0,
  };

  dimensions.ctrWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left},${dimensions.margin.top})`
    );

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccesssor))
    .rangeRound([0, dimensions.ctrWidth])
    .clamp(true);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccesssor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice()
    .clamp(true);

  // Draw Circles
  ctr
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", (d) => xScale(xAccesssor(d)))
    .attr("cy", (d) => yScale(yAccesssor(d)))
    .attr("r", 5)
    .attr("fill", "red")
    .attr("data-temp", yAccesssor);

  //Axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat((d) => d * 100 + "%");
  // .tickValues([0.4, 0.5, 0.8]);
  const xAxisGroup = ctr
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .classed("axis", true);

  xAxisGroup
    .append("text")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity");

  const yAxis = d3.axisLeft(yScale);
  const yAxisGroup = ctr.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.ctrHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Temperature &deg; F")
    .style("transform", "rotate(270deg)")
    .style("text-anchor", "middle");
};

drawChart();
