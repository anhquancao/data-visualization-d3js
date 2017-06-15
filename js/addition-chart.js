function drawLine(maxValue, titles, data, chart, chartWidth, chartHeight, color) {
    var scaleX = d3.scale.linear().domain([0, data.length - 1]).range([0, chartWidth]);
    var scaleY = d3.scale.linear().domain([0, maxValue]).range([0, chartHeight]);

    var line = d3.svg.line()
        .x(function (d, i) {
            return scaleX(i) + 50;
        })
        .y(function (d) {
            return (chartHeight - scaleY(d)) + 20;
        });

    chart.append("path").attr("d", line(data)).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', color);
    console.log(data);
}

function drawLegend(legend, title, color, index) {
    var legendLeftMargin = 50;

    legend.append("rect")
        .attr("height", "13")
        .attr("width", "50")
        .attr("x", legendLeftMargin + 30)
        .attr("y", (index * 15) + 20)
        .style("fill", color);


    legend.append('text')
        .attr('x', 10)
        .attr('y', (15 * index) + 12 + 20)
        .attr('fill', 'black')
        .text(title);

}

function drawAdditionChart(titles, meanArray, medianArray, sdArray, minMaxArray) {
    var chartHeight = 500;
    var chartWidth = 300;

    var meanColor = "blue";
    var medianColor = "green";
    var sdColor = "steelblue";
    var minColor = "black";
    var maxColor = "red";

    var maxValue = d3.max(minMaxArray.map(d => d[1]));

    var chart = d3.select("#addition").append("svg").attr("height", chartHeight + 100).attr("width", chartWidth + 100);

    var scaleXAxis = d3.scale.ordinal().domain(titles).rangePoints([0, chartWidth]);
    var scaleYAxis = d3.scale.linear().domain([0, maxValue]).range([chartHeight, 0]);
    var scaleYAxisOnX = d3.scale.linear().domain([0, titles.length - 1]).range([0, chartWidth]);

    var xAxis = d3.svg.axis().scale(scaleXAxis).orient("bottom");
    chart.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(50," + (chartHeight + 40) + ")")
        .style("shape-rendering", "none")
        .call(xAxis)

    var yAxisLeft = d3.svg.axis().scale(scaleYAxis).orient("left");
    for (i = 0; i < titles.length; i++) {
        chart.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (scaleYAxisOnX(i) + 50) + ", 20)")
            .call(yAxisLeft)
    }

    if (meanArray) {
        drawLine(maxValue, titles, meanArray, chart, chartWidth, chartHeight, meanColor);
    }

    if (medianArray) {
        drawLine(maxValue, titles, medianArray, chart, chartWidth, chartHeight, medianColor);
    }

    if (sdArray) {
        drawLine(maxValue, titles, sdArray, chart, chartWidth, chartHeight, sdColor);
    }

    if (minMaxArray) {
        drawLine(maxValue, titles, minMaxArray.map(d => d[0]), chart, chartWidth, chartHeight, minColor);
        drawLine(maxValue, titles, minMaxArray.map(d => d[1]), chart, chartWidth, chartHeight, maxColor);
    }

    var legend = d3.select("#addition").append("svg").attr("width", 300).attr("height", 50 * titles.length);

    legend.append("text")
        .attr('x', 0)
        .attr('y', 15)
        .attr('fill', 'black')
        .text('LEGEND');

    var colorArray = [meanColor, medianColor, sdColor, minColor, maxColor];
    var colorArrayTitles = ["Mean", "Median", "STD", "Min", "Max"];
    for (i = 0; i < colorArray.length; i++) {
        drawLegend(legend, colorArrayTitles[i], colorArray[i], i);
    }



}
