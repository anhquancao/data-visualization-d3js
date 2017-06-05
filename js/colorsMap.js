function toAlphaValues(values) {
    const size = Math.round(Math.sqrt(values.length));
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);

    values = values.map(v => (v - minValue) / (maxValue - minValue));
    return values;
}

function drawColorsMap(protos, cards, color, titles, gridHeight, gridWidth) {
    const features = protos[0].length;

    const nodeSize = 60;
    const space = 50;
    const chartWidth = nodeSize * gridWidth;
    const singleChartHeight = nodeSize * gridHeight;
    const chartHeight = (features + 1) * (singleChartHeight + space) + space;

    const cardGrayValues = toAlphaValues(cards.map(c => Number(c)));
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    const nodes = cardGrayValues.map((value, index) => {
        return {
            index,
            x: index % gridWidth,
            y: Math.floor(index / gridWidth),
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
        .attr('class', 'node')
        .attr('data-index', (node) => {
            return node.index;
        })
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
            return rgba([color.r, color.g, color.b, node.value]);
        });


    for (feature = 0; feature < features; feature++) {
        svg.append('text')
            .attr('x', 0)
            .attr('y', 40 + (singleChartHeight + space) * (feature + 1))
            .attr('fill', 'black')
            .text('Feature: ' + titles[feature]);
        featureGray = svg.append('g')
            .attr('class', 'feature-' + feature)
            .attr('transform', 'translate(0, ' + (space + (singleChartHeight + space) * (feature + 1)) + ')')
        const featureNodes = toAlphaValues(protos.map(p => p[feature])).map((value, index) => {
            return {
                index,
                x: index % gridWidth,
                y: Math.floor(index / gridWidth),
                value
            }
        });
        featureGray
            .selectAll('rect')
            .data(featureNodes)
            .enter()
            .append('rect')
            .attr('stroke', '#d9d9d9')
            .attr('class', 'node')
            .attr('data-index', (node) => {
                return node.index;
            })
            .attr('x', function (node) {
                return node.x * nodeSize;
            })
            .attr('y', function (node) {
                return node.y * nodeSize;
            })
            .attr('width', nodeSize)
            .attr('height', nodeSize)
            .style('fill', function (node) {
                return rgba([color.r, color.g, color.b, node.value]);
            });
    }
    $(".node").click(function () {
        const index = $(this).data('index');
        
        const proto = protos[index].map((value, index) => {
            return {
                value: Number(value),
                title: titles[index]
            }
        });
        const card = cards[index][0];

        const width = 300,
            barHeight = 20;

        let x = d3.scale.linear()
            .domain([0, d3.max(protos[index])])
            .range([0, 300]);

        $("#modal-info").html("");

        // $('#modal-info').html(JSON.stringify(proto));
        $('#modal-zoom').modal('show');
        $('#modal-extra-data').html("Cardinality: " + card);

        var chart = d3.select("#modal-info")
            .attr("width", width + 200)
            .attr("height", barHeight * proto.length);

        var bar = chart.selectAll("g")
            .data(proto)
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * barHeight + ")";
            });

        bar.append("rect")
            .attr("width", (d) => {
                return x(d.value);
            })
            .attr('class', 'bar')
            .attr("height", barHeight - 1);

        bar.append("text")
            .attr("x", 500)
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.title + ': ' + d.value;
            });

    });
}