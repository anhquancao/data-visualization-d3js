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


}