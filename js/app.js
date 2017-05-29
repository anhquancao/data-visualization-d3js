function toColorValues(values) {
    const size = Math.round(Math.sqrt(values.length));
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);

    values = values.map(v => (v - minValue) * 255 / (maxValue - minValue));
    return values;
}

function rgb(array) {
    return 'rgb(' + array.map(function (r) {
        return Math.round(r);
    }).join(',') + ')';
}

function drawColorsMap(protos, cards) {
    const features = protos[0].length;

    const space = 50;
    const chartWidth = 600;
    const chartHeight = (features + 1) * (chartWidth + space) + space;

    const cardGrayValues = toColorValues(cards.map(c => Number(c)));
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    const cardSize = Math.round(Math.sqrt(cards.length));
    const nodeSize = chartWidth / cardSize;
    const nodes = cardGrayValues.map((value, index) => {
        return {
            x: index % cardSize,
            y: Math.floor(index / cardSize),
            value
        }
    });

    cardGray = svg.append('g').attr('class', 'card-gray');
    svg.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('fill', 'black')
        .text('Cardinality');

    cardGray
        .selectAll('rect')
        .data(nodes)
        .enter()
        .append('rect')
        .attr('transform', 'translate(0, ' + space + ')')
        .attr('stroke', '#d9d9d9')
        .attr('x', function (node) {
            return node.x * nodeSize;
        })
        .attr('y', function (node) {
            return node.y * nodeSize;
        })
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .style('fill', function (node) {
            return rgb([node.value, node.value, node.value]);
        });


    for (feature = 0; feature < features; feature++) {
        svg.append('text')
            .attr('x', 0)
            .attr('y', 40 + (chartWidth + space) * (feature + 1))
            .attr('fill', 'black')
            .text('Feature: ' + (feature + 1));
        featureGray = svg.append('g')
            .attr('class', 'feature-' + feature)
            .attr('transform', 'translate(0, ' + (space + (chartWidth + space) * (feature + 1)) + ')')
        const featureNodes = toColorValues(protos.map(p => p[feature])).map((value, index) => {
            return {
                x: index % cardSize,
                y: Math.floor(index / cardSize),
                value
            }
        });
        featureGray
            .selectAll('rect')
            .data(featureNodes)
            .enter()
            .append('rect')
            .attr('stroke', '#d9d9d9')
            .attr('x', function (node) {
                return node.x * nodeSize;
            })
            .attr('y', function (node) {
                return node.y * nodeSize;
            })
            .attr('width', nodeSize)
            .attr('height', nodeSize)
            .style('fill', function (node) {
                return rgb([node.value, node.value, node.value]);
            });
    }
}


function drawBarChart(protos, cards) {
    var cards = cards;
    
    var numberOfFeature = protos[0].length;
    var totalBox = protos.length;
    var numberOfBox = 10;

    var boxSize = 60;

    var gridHeight = boxSize * numberOfBox;
    var gridWidth = boxSize * numberOfBox;
    var chartHeight = boxSize - 10;
    
    //Scaling for bar chart
    var maxValue = 0;
    for(index = 0; index < totalBox; index++){
        tempMax = d3.max(protos[index], function(d){
            return +d;
        });
        if(tempMax > maxValue){
            maxValue = tempMax;
        }
    }
    
    var scale = d3.scale.linear().domain([0, maxValue]).range([0,chartHeight]);    
    
    //Draw Grid    
    var grid = d3.selectAll("#chart").append("svg").attr("height", gridHeight + 50).attr("width", gridWidth);
    
    grid.append("text").text("Bar Chart");

    grid.selectAll("rect")
        .data(protos)
        .enter()
        .append("rect")
        .attr("height", boxSize)
        .attr("width", boxSize)
        .attr("x", function(d,i){
            return (i%numberOfBox) * boxSize;
        })
        .attr("y", function(d,i){
            return (Math.floor(i/numberOfBox)) * boxSize;
        })
        .style("stroke", "#ffffff")
        .style("fill", "rgba(0,0,0,.25)");
    
    //Draw Bar Chart in each grid
    for(index = 0; index < totalBox; index++){
        grid.selectAll("empty")
            .data(protos[index])
            .enter()
            .append("rect")
            .attr("height", function (d) {
                return scale(d);
            })
            .attr("width", (boxSize-6)/numberOfFeature)
            .attr("x", function (d, i) {
                return ((i * 15))+((index%numberOfBox) * boxSize)+1;
            })
            .attr("y", function (d) {
                return (chartHeight - scale(d))+((Math.floor(index/numberOfBox)) * boxSize)+5;
            })
            .style("fill", function(d,i){
                return "rgba("+i*55+","+i*75+","+i*25+",1)";
            });
    };
    
    
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



function draw() {
    $("#chart").html("");
    var chartType = $("#chartType").val();
    console.log(chartType);
    let protoStr = '';
    let cardStr = '';
    readAsync('proto').then((content) => {
        protoStr = content;
        readAsync('card').then((content) => {
            cardStr = content;

            let protos = protoStr.split('\n').filter(e => e !== '').map(p => p.split(','));
            let cards = cardStr.split('\n').filter(e => e !== '').map(p => p.split(','));

            switch(chartType){
                case "color":
                    console.log("Draw Grid Color");
                    drawColorsMap(protos, cards);
                    break;
                case "bar":
                    console.log("Draw Grid Bar");
                    drawBarChart(protos, cards)        
                    break;     
            }
        });
    });
}
