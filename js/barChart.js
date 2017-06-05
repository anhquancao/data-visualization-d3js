function convertArrayForDataAttr(arrayData) {
    var stringData = "";
    for (var i = 0; i < arrayData.length; i++) {
        stringData = stringData + arrayData[i];
        if (i < arrayData.length - 1) {
            stringData = stringData + ",";
        }
    }
    return stringData;
}

function convertDataAttrToArray(stringData) {
    var arrayData = stringData.split(",");
    return arrayData;
}

function barChartOnClick(data, titles) {
    var numberOfFeature = data.length;

    var barHeight = 20;
    var chartHeight = barHeight * numberOfFeature;
    var chartWidth = 300;
    var chartLeftMargin = 100;

    var maxValue = d3.max(data, function (d) {
        return +d;
    });

    var chartModal = d3.select("#modal-info")
        .attr("width", chartWidth + 150)
        .attr("height", chartHeight + 20);

    var scale = d3.scale.linear().domain([0, maxValue]).range([0, chartWidth]);

    $("#modal-info").html("");
    $("#modal-extra-data").html("");

    $('#modal-zoom').modal('show');

    chartModal.selectAll("g")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", barHeight - 2)
        .attr("width", function (d) {
            return scale(d);
        })
        .attr("x", chartLeftMargin)
        .attr("y", function (d, i) {
            return barHeight * i;
        })
        .style("fill", function (d, i) {
            return getColorForBarChart(i, numberOfFeature);
        });

    chartModal.selectAll("g")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d) {
            return chartLeftMargin + scale(d) + 32;
        })
        .attr("y", function (d, i) {
            return (barHeight * i) + 12;
        })
        .attr("fill", "black")
        .text(function (d) {
            return d;
        });

    chartModal.selectAll("g")
        .data(titles)
        .enter()
        .append("text")
        .attr('x', 30)
        .attr('y', function (d, i) {
            return (barHeight * i) + 12;
        })
        .attr('fill', 'black')
        .text(function (d) {
            return d + ":";
        });
}

function drawBarChart(protos, cards, titles) {
    var cards = cards;

    var numberOfFeature = protos[0].length;
    var totalBox = protos.length;
    var numberOfBoxAtSide = Math.round(Math.sqrt(totalBox));

    var boxSize = 60;
    var gridMargin = 30;

    var gridHeight = boxSize * numberOfBoxAtSide;
    var gridWidth = boxSize * numberOfBoxAtSide;
    var chartHeight = boxSize - 10;

    //Scaling for bar chart
    var maxValue = 0;
    for (index = 0; index < totalBox; index++) {
        tempMax = d3.max(protos[index], function (d) {
            return +d;
        });
        if (tempMax > maxValue) {
            maxValue = tempMax;
        }
    }

    var scale = d3.scale.linear().domain([0, maxValue]).range([0, chartHeight]);

    //Draw Grid    
    var grid = d3.selectAll("#chart").append("svg").attr("height", gridHeight + 50).attr("width", gridWidth);

    grid.append("text").attr("x", "10").attr("y", "20").text("Bar Chart").style("color", "black");

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

    //Draw Bar Chart in each grid
    for (index = 0; index < totalBox; index++) {
        grid.append("g")
            .attr('data-array', convertArrayForDataAttr(protos[index]))
            .attr('data-titles', convertArrayForDataAttr(titles))
            .on({
                "click": function () {
                    var data = convertDataAttrToArray(this.dataset.array);
                    var titles = convertDataAttrToArray(this.dataset.titles);
                    barChartOnClick(data, titles);
                }
            })
            .selectAll("empty")
            .data(protos[index])
            .enter()
            .append("rect")
            .attr("height", function (d) {
                return scale(d);
            })
            .attr("width", (boxSize - 6) / numberOfFeature)
            .attr("x", function (d, i) {
                return ((i * 15)) + ((index % numberOfBoxAtSide) * boxSize) + 1;
            })
            .attr("y", function (d) {
                return (chartHeight - scale(d)) + ((Math.floor(index / numberOfBoxAtSide)) * boxSize) + 5 + gridMargin;
            })
            .style("fill", function (d, i) {
                return getColorForBarChart(i, numberOfFeature);
            });
    };

    //Draw Legend

    var legendLeftMargin = 50;
    var legend = d3.selectAll("#chart").append("svg").attr("height", numberOfFeature * (15 + numberOfFeature) + 20).attr("width", gridWidth);

    legend.append("text")
        .attr('x', 0)
        .attr('y', 15)
        .attr('fill', 'black')
        .text('LEGEND');

    legend.selectAll("empty")
        .data(protos[0])
        .enter()
        .append("rect")
        .attr("height", "13")
        .attr("width", "50")
        .attr("x", legendLeftMargin + 30)
        .attr("y", function (d, i) {
            return (i * 15) + 20;
        })
        .style("fill", function (d, i) {
            return getColorForBarChart(i, numberOfFeature);
        });


    legend.selectAll("empty").data(titles).enter().append('text')
        .attr('x', 10)
        .attr('y', function (d, i) {
            return (15 * i) + 12 + 20;
        })
        .attr('fill', 'black')
        .text(function (d) {
            return d + ":";
        });

    //    var cardsChart = d3.selectAll("#chart").append("svg").attr("height", "300px").attr("width", "100%");
    //    cardsChart.selectAll("rect").data(cards).enter().append("rect")
    //        .attr("height", function (d) {
    //            return scale(d);
    //        })
    //        .attr("width", "30px")
    //        .attr("x", function (d, i) {
    //            return (i * 20) + 25;
    //        })
    //        .attr("y", function (d) {
    //            return chartHeight - scale(d);
    //        });

    //    var feature = [];
    //    for (var i = 0; i < protos.length; i++) {
    //        for ()
    //        for (var j = 0; j < protos[i].length; j++) {
    //            feature = push(protos[i][j]);
    //        }
    //}

}
