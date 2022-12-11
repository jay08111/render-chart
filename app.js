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
  const dataset = await d3.json("test_data_1.json");
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

const drawHeatMap = async (el, scale) => {
  const data = await d3.json("test_data_2.json");
  data.sort((a, b) => a - b);
  let dimensions = {
    width: 600,
    height: 150,
  };

  const box = 30;

  // Draw Image
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Scales
  let colorScale;

  if (scale == "linear") {
    colorScale = d3
      .scaleLinear()
      .domain(d3.extent(data))
      .range(["white", "red"]);
  } else if (scale == "quantize") {
    colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(data))
      .range(["white", "pink", "red"]);
  } else if (scale == "quantile") {
    colorScale = d3
      .scaleQuantile()
      .domain(data)
      .range(["white", "pink", "red"]);
  } else if (scale == "threshold") {
    colorScale = d3
      .scaleThreshold()
      .domain([45200, 135600])
      .range(["white", "pink", "red"]);
  }
  // Rectangles
  svg
    .append("g")
    .attr("transform", "translate(2,2)")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("stroke", "black")
    .attr("width", box - 3)
    .attr("height", box - 3)
    .attr("x", (d, i) => box * (i % 20))
    .attr("y", (d, i) => box * ((i / 20) | 0))
    .attr("fill", colorScale);
};

drawHeatMap("#heatmap1", "linear");
drawHeatMap("#heatmap2", "quantize");
drawHeatMap("#heatmap3", "quantile");
drawHeatMap("#heatmap4", "threshold");

const drawChart2 = async () => {
  const dataset = await d3.json("test_data_3.json");

  const sizeAccessor = (d) => d.size;
  const nameAccessor = (d) => d.name;

  let dimensions = {
    width: 400,
    height: 500,
    margin: 50,
  };

  const svg = d3
    .select("#chart_1")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const universeScale = d3
    .scaleLog()
    .domain(d3.extent(dataset, sizeAccessor))
    .range([dimensions.height - dimensions.margin, dimensions.margin]);
  const circlesGroup = svg
    .append("g")
    .style("font-size", "16px")
    .style("dominant-baseline", "middle");
  circlesGroup
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", dimensions.margin)
    .attr("cy", (d) => universeScale(sizeAccessor(d)))
    .attr("r", 6);

  circlesGroup
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("x", dimensions.margin + 15)
    .attr("y", (d) => universeScale(sizeAccessor(d)))
    .text(nameAccessor);

  const axis = d3.axisLeft(universeScale);
  svg
    .append("g")
    .attr("transform", `translate(${dimensions.margin} , 0)`)
    .call(axis);
};

drawChart2();

const drawChart3 = async () => {
  const dataset = await d3.json("test_data_1.json");
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50,
    ctrHeight: 0,
    ctrWidth: 0,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  const svg = d3
    .select("#chart_2")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins} ,${dimensions.margins})`
    );

  const labelsGroup = ctr.append("g").classed("bar-labels", true);
  const xAxisGroup = ctr
    .append("g")
    .style("transform", `translateY(${dimensions.ctrHeight}px)`);

  const histogram = (metric) => {
    const xAccesssor = (d) => d.currently[metric];
    const yAccesssor = (d) => d.length;

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, xAccesssor))
      .range([0, dimensions.ctrWidth])
      .nice();

    const bin = d3
      .bin()
      .domain(xScale.domain())
      .value(xAccesssor)
      .thresholds(10);
    const padding = 1;

    const newDataSet = bin(dataset);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(newDataSet, yAccesssor)])
      .range([dimensions.ctrHeight, 0])
      .nice();

    // Draw Bars
    ctr
      .selectAll("rect")
      .data(newDataSet)
      .join("rect")
      .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
      .attr("height", (d) => dimensions.ctrHeight - yScale(yAccesssor(d)))
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(yAccesssor(d)))
      .attr("fill", "#01c5c4");

    labelsGroup
      .selectAll("text")
      .data(newDataSet)
      .join("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccesssor(d)) - 10)
      .text(yAccesssor);

    const xAxis = d3.axisBottom(xScale);

    xAxisGroup.call(xAxis);
  };

  d3.select("#metric").on("change", function (e) {
    e.preventDefault();
    console.log(this);
    histogram(this.value);
  });

  histogram("humidity");
};

drawChart3();

const drawChart4 = () => {
  const mockData = [
    { name: "simon", score: 80 },
    { name: "Mary", score: 90 },
    { name: "John", score: 60 },
    { name: "jay", score: 89 },
  ];

  const width = 800;
  const height = 400;
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };
  const svg = d3
    .select("#chart_3")
    .append("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);

  const x = d3
    .scaleBand()
    .domain(d3.range(mockData.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("fill", "royalblue")
    .selectAll("rect")
    .data(mockData.sort((a, b) => d3.descending(a.score, b.score)))
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", (d) => y(d.score))
    .attr("height", (d) => y(0) - y(d.score))
    .attr("width", x.bandwidth());
  const xAxis = (g) => {
    g.attr("transform", `translate(0 , ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((i) => mockData[i].name))
      .attr("font-size", "20px");
  };
  const yAxis = (g) => {
    g.attr("transform", `translate(${margin.left} , 0)`)
      .call(d3.axisLeft(y).ticks(null, mockData.format))
      .attr("font-size", "20px");
  };
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
};

drawChart4();
