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

    const space = 20;
    const chartWidth = 600;
    const chartHeight = (features + 1) * (chartWidth + space);

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
    cardGray
        .selectAll('rect')
        .data(nodes)
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

    for (feature = 0; feature < features; feature++) {
        featureGray = svg.append('g')
            .attr('class', 'feature-' + feature)
            .attr('transform', 'translate(0, ' + ((chartWidth + space) * (feature + 1)) + ')')
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


function draw() {
    let protoStr = '';
    let cardStr = '';
    readAsync('proto').then((content) => {
        protoStr = content;
        readAsync('card').then((content) => {
            cardStr = content;

            let protos = protoStr.split('\n').filter(e => e !== '').map(p => p.split(','));
            let cards = cardStr.split('\n').filter(e => e !== '').map(p => p.split(','));

            drawColorsMap(protos, cards);
        });
    });
}