function lineChartOnClick(data, titles) {
    var chartWidth = 300;
    var chartHeight = 200;

    $("#modal-info").html("");
    $("#modal-extra-data").html("");

    $('#modal-zoom').modal('show');

    var scaleX = d3.scale.linear().domain([0, data.length - 1]).range([0, chartWidth]);
    var scaleY = d3.scale.linear().domain([0, d3.max(data)]).range([0, chartHeight]);

    var chart = d3.select('#modal-info').attr("width", chartWidth + 100).attr("height", chartHeight + 100);

    var line = d3.svg.line()
        .x(function (d, i) {
            return scaleX(i) + 50;
        })
        .y(function (d) {
            return (chartHeight - scaleY(d)) + 20;
        });

    var scaleXAxis = d3.scale.ordinal().domain(titles).rangePoints([0, chartWidth]);
    var scaleYAxis = d3.scale.linear().domain([0, d3.max(data)]).range([chartHeight, 0]);

    var xAxis = d3.svg.axis().scale(scaleXAxis).orient("bottom");
    chart.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(50," + (chartHeight + 20) + ")")
        .call(xAxis)

    var yAxisLeft = d3.svg.axis().scale(scaleYAxis).orient("left");
    chart.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(50,20)")
        .call(yAxisLeft)

    chart.append("path").attr("d", line(data)).attr('fill', 'none').attr('stroke-width', 1).attr('stroke', 'steelblue');

    //    var xAxisPole = d3.svg.axis().scale(scaleX).ticks(4).tickSize(function (d) {
    //        return -scaleY(d);
    //    });
    //
    //    chart.append("g")
    //        .attr("transform", "translate(50," + (chartHeight + 20) + ")")
    //        .call(xAxisPole)
}

function calculateLine(protos, arrayData, index, numberOfBoxAtSide) {
    var lineString = "";

    var numberOfFeature = protos[0].length;
    var totalBox = protos.length;

    var boxSize = 60;
    var gridMargin = 30;

    var chartHeight = boxSize - 10;

    //Scaling for line chart
    var maxValue = 0;
    for (loop = 0; loop < totalBox; loop++) {
        tempMax = d3.max(protos[index], function (d) {
            return +d;
        });
        if (tempMax > maxValue) {
            maxValue = tempMax;
        }
    }

    //Scale X Position
    var scaleX = d3.scale.linear().domain([0, numberOfFeature]).range([0, boxSize]);
    //Scale Y Position
    var scaleY = d3.scale.linear().domain([0, maxValue]).range([0, chartHeight]);

    var line = d3.svg.line()
        .x(function (d, i) {
            return scaleX(i) + ((index % numberOfBoxAtSide) * boxSize) + 5;
        })
        .y(function (d, i) {
            return (chartHeight - scaleY(d)) + ((Math.floor(index / numberOfBoxAtSide)) * boxSize) + 5 + gridMargin;
        });

    lineString = line(arrayData);

    return lineString;
}

function drawLineChart(protos, cards, titles, gridHeightBox, gridWidthBox) {
    var cards = cards;

    var numberOfFeature = protos[0].length;
    var totalBox = protos.length;
    //    var numberOfBoxAtSide = Math.round(Math.sqrt(totalBox));

    if (gridHeightBox > gridWidthBox) {
        var numberOfBoxAtSide = gridHeightBox;
    } else {
        var numberOfBoxAtSide = gridWidthBox;
    }

    var boxSize = 60;
    var gridMargin = 30;

    var gridHeight = boxSize * numberOfBoxAtSide;
    var gridWidth = boxSize * numberOfBoxAtSide;
    var chartHeight = boxSize - 10;

    //Draw Grid
    var grid = d3.selectAll("#chart").append("svg").attr("height", gridHeight + 50).attr("width", gridWidth);

    grid.append("text").attr("x", "10").attr("y", "20").text("Line Chart").style("color", "black");

    grid.selectAll("rect")
        .data(protos)
        .enter()
        .append("rect")
        .attr("height", boxSize)
        .attr("width", boxSize)
        .attr("x", function (d, i) {
            return (i % numberOfBoxAtSide) * boxSize;
        })
        .attr("y", function (d, i) {
            return (Math.floor(i / numberOfBoxAtSide)) * boxSize + gridMargin;
        })
        .style("stroke", "#000")
        .style("fill", "rgba(255,255,255,0.25)");

    //Draw Chart in each grid
    grid.selectAll("g").data(protos).enter().append("g")
        .attr('data-array', function (d, i) {
            return d;
        })
        .attr('data-titles', titles)
        .on({
            "mouseover": function () {
                d3.select(this).transition()
                    .ease("elastic")
                    .duration("500")
                    .style("cursor", "pointer");
            },
            "mouseout": function () {
                d3.select(this).transition()
                    .ease("elastic")
                    .duration("500")
                    .style("cursor", "default");
            },
            "click": function () {
                var data = convertDataAttrToArray(this.dataset.array);
                var titles = convertDataAttrToArray(this.dataset.titles);
                lineChartOnClick(data, titles);
            }
        })
        .append("path")
        .attr('d', function (d, i) {
            return calculateLine(protos, d, i, numberOfBoxAtSide);
        })
        .attr('fill', 'none').attr('stroke-width', 3).attr('stroke', 'steelblue');
}
