function rgba(array) {
    return 'rgba(' + array.join(',') + ')';
}

function getColorForBarChart(index, numberOfFeature) {
    var baseColorCode = Math.round(255 / numberOfFeature);
    var rgbValue = index * baseColorCode;
    return "rgba(" + rgbValue + "," + 200 + "," + 150 + ",1)";
}

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


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function showInput(value) {
    switch (value) {
        case "color":
            console.log(value);
            $('#i-proto').show();
            $('#i-card').show();
            $('#i-title').show();
            $('#i-color').show();
            $('#i-width').show();
            $('#i-height').show();
            $("#i-more").show();
            break;
        case "bar":
            $('#i-proto').show();
            $('#i-card').show();
            $('#i-title').show();
            $('#i-color').hide();
            $('#i-width').hide();
            $('#i-height').hide();
            $("#i-more").show();
            break;
        case "pie":
            $('#i-proto').show();
            $('#i-card').show();
            $('#i-title').show();
            $('#i-color').hide();
            $('#i-width').show();
            $('#i-height').show();
            $("#i-more").show();
            break;
        case "line":
            $('#i-proto').show();
            $('#i-card').show();
            $('#i-title').show();
            $('#i-color').hide();
            $('#i-width').hide();
            $('#i-height').hide();
            $("#i-more").show();
            break;
        default:
            $('#i-card').hide();
            $('#i-title').hide();
            $('#i-color').hide();
            $('#i-width').hide();
            $('#i-height').hide();
            $('#i-proto').hide();
            $("#i-more").hide();
    }
}

showInput("none");
$('#chartType').on('change', function () {
    console.log(this.value);
    showInput(this.value);
});

//Other Calculation 
function mean(data) {
    return d3.mean(data);
}

function standardDeviation(data) {
    return d3.deviation(data);
};

function minMax(data) {
    return d3.extent(data);
}

function draw() {
    $("#chart").html("");
    $("#addition").html("");
    let chartType = $("#chartType").val();
    let gridWidth = $('#gridWidth').val();
    let gridHeight = $('#gridHeight').val();

    let protoStr = '';
    let cardStr = '';
    readAsync('title').then((content) => {
        let titleString = content;
        readAsync('proto').then((content) => {
            protoStr = content;
            readAsync('card').then((content) => {
                cardStr = content;

                let protos = protoStr.split('\n').filter(e => e !== '').map(p => p.split(','));
                let cards = cardStr.split('\n').filter(e => e !== '').map(p => p.split(','));
                let titles = [];
                if (titleString) {
                    titles = titleString.split('\n').filter(e => e !== '').map(p => p.split(','));
                    titles = titles[0];
                } else {
                    titles = [...Array(protos[0].length).keys()].map((d) => {
                        return "Feature " + d;
                    });
                }

                let color = hexToRgb($('#color').val());

                //Handle Draw Chart
                switch (chartType) {
                    case "color":
                        if (gridHeight * gridWidth < protos.length) {
                            alert('gridHeight * gridWidth must be bigger than the number of prototypes');
                        } else {
                            drawColorsMap(protos, cards, color, titles, gridHeight, gridWidth);
                        }
                        break;
                    case "bar":
                        drawBarChart(protos, cards, titles);
                        break;
                    case "pie":
                        drawPieChart(protos, cards, titles, gridHeight, gridWidth);
                        break;
                    case "line":
                        drawLineChart(protos, cards, titles);
                        break;
                }


                //Handle Additional Information
                if (document.getElementById("i-mean").checked) {
                    var meanArray = [];

                    for (i = 0; i < protos[0].length; i++) {
                        console.log(mean(protos.map(d => d[i])));
                        meanArray.push(mean(protos.map(d => d[i])));
                    }

                    $("#addition").append("<h3>Mean</h3>");

                    for (i = 0; i < meanArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: " + meanArray[i] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: " + meanArray[i] + "<br>");
                        }

                    }

                }

                if (document.getElementById("i-sd").checked) {
                    var sdArray = [];

                    for (i = 0; i < protos[0].length; i++) {
                        console.log(standardDeviation(protos.map(d => d[i])));
                        sdArray.push(standardDeviation(protos.map(d => d[i])));
                    }

                    $("#addition").append("<h3>Standard Deviation</h3>");

                    for (i = 0; i < sdArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: " + sdArray[i] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: " + sdArray[i] + "<br>");
                        }
                    }
                }

                if (document.getElementById("i-minmax").checked) {
                    var minMaxArray = [];

                    for (i = 0; i < protos[0].length; i++) {
                        console.log(minMax(protos.map(d => d[i])));
                        minMaxArray.push(minMax(protos.map(d => d[i])));
                    }

                    $("#addition").append("<h3>Min and Max</h3>");

                    for (i = 0; i < minMaxArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: Min:" + minMaxArray[i][0] + " - Max:" + minMaxArray[i][1] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: Min:" + minMaxArray[i][0] + " - Max:" + minMaxArray[i][1] + "<br>");
                        }
                    }
                }

            });
        });
    });

}
