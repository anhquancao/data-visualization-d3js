function drawPieChart(protos, cards, titles, gridHeight, gridWidth) {
    const nodeSize = 60;
    const r = 27;
    const chartHeight = nodeSize * gridHeight;
    const chartWidth = nodeSize * gridWidth;
    color = d3.scale.category20c();

    let vis = d3.select("#chart")
        .append('svg')
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .selectAll('g')
        .data(protos)
        .enter()
        .append("g")
        .attr("class", "nodePie")
        .attr('data-index', (d, index) => {
            return index;
        })
        .attr("width", nodeSize)
        .attr("height", nodeSize)
        .attr("transform", (d, index) => {
            const x = (index % gridWidth) * nodeSize + r;
            const y = (Math.floor(index / gridWidth) * nodeSize) + r;
            return "translate(" + x + "," + y + ")";
        });

    let arc = d3.svg.arc()
        .outerRadius(r);

    let pie = d3.layout.pie()
        .value(function (d) {
            return d;
        });


    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice");

    arcs.append("svg:path")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", arc);


    $(".nodePie").click(function () {
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