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
        grid.selectAll("empty")
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
