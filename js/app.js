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
            $('#i-width').show();
            $('#i-height').show();
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
            $('#i-width').show();
            $('#i-height').show();
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
};

function median(data) {
    return d3.median(data);
};

var protos = [];
var cards = [];
var titles = [];
var datasets = [];
var color = "";
var featureFilter = [];
var chartType = "";
var gridWidth = 0;
var gridHeight = 0;

function filter() {
    for (let i = 0; i < featureFilter.length; i++) {
        let filterId = "filter" + i;
        featureFilter[i] = document.getElementById("filter" + i).checked;
    }

    //Handle Filter Feature
    var updateProtos = protos.map(function (data) {
        var returnArray = [];
        for (i = 0; i < featureFilter.length; i++) {
            if (featureFilter[i]) {
                returnArray.push(data[i]);
            }
        }
        return returnArray;
    });

    var updateTitles = titles.filter(function (data, index) {
        return featureFilter[index];
    });

    $("#chart").html("");
    switch (chartType) {
        case "color":
            drawColorsMap(updateProtos, cards, color, updateTitles, gridHeight, gridWidth);
            break;
        case "bar":
            drawBarChart(updateProtos, cards, updateTitles, gridHeight, gridWidth);
            break;
        case "pie":
            drawPieChart(updateProtos, cards, updateTitles, gridHeight, gridWidth);
            break;
        case "line":
            drawLineChart(updateProtos, cards, updateTitles, gridHeight, gridWidth);
            break;
    }
}

function draw() {
    $("#chart").html("");
    $("#addition").html("");
    $("#filter").html("");
    chartType = $("#chartType").val();
    gridWidth = $('#gridWidth').val();
    gridHeight = $('#gridHeight').val();

    let protoStr = '';
    let cardStr = '';
    readAsync('title').then((content) => {
        let titleString = content;
        readAsync('proto').then((content) => {
            protoStr = content;
            readAsync('card').then((content) => {
                cardStr = content;

                protos = protoStr.split('\n').filter(e => e !== '').map(p => p.split(','));
                protos.splice(0, 1);

                cards = cardStr.split('\n').filter(e => e !== '').map(p => p.split(','));
                cards.splice(0, 1)

                color = hexToRgb($('#color').val());

                if (titleString) {
                    titles = titleString.split('\n').filter(e => e !== '').map(p => p.split(','));
                    if (titles.length > 1) {
                        for (i = 1; i < titles.length; i++) {
                            datasets.push(titles[i]);
                        }
                    }
                    titles = titles[0];
                } else {
                    titles = [...Array(protos[0].length).keys()].map((d) => {
                        return "Feature " + d;
                    });
                }

                //Append Feature Filter
                featureFilter = Array(protos[0].length).fill(true);
                $("#filter").append("<h2>Feature Filter</h2>");
                for (i = 0; i < featureFilter.length; i++) {
                    if (featureFilter[i]) {
                        $("#filter").append("<div class = 'checkbox'><label><input type = 'checkbox' id='filter" + i + "' value='" + titles[i] + "' checked>" + titles[i] + "</label></div>");
                    } else {
                        $("#filter").append("<div class = 'checkbox'><label><input type = 'checkbox' id='filter" + i + "' value='" + titles[i] + "'>" + titles[i] + "</label></div>");
                    }
                }
                $("#filter").append("<div class='form-group'><button onclick='filter()' type='button' class='btn btn-primary'>Filter</button></div>");


                //Handle Draw Chart
                if (gridHeight * gridWidth < protos.length) {
                    alert('gridHeight * gridWidth must be bigger than the number of prototypes');
                } else {
                    switch (chartType) {
                        case "color":
                            drawColorsMap(protos, cards, color, titles, gridHeight, gridWidth);
                            break;
                        case "bar":
                            drawBarChart(protos, cards, titles, gridHeight, gridWidth);
                            break;
                        case "pie":
                            drawPieChart(protos, cards, titles, gridHeight, gridWidth);
                            break;
                        case "line":
                            drawLineChart(protos, cards, titles, gridHeight, gridWidth);
                            break;
                    }
                }

                //Handle Additional Information
                if (document.getElementById("i-mean").checked) {
                    var meanArray = [];

                    for (i = 0; i < datasets[0].length; i++) {
                        meanArray.push(mean(datasets.map(d => d[i])));
                    }

                    meanArray = meanArray.filter(function (data, index) {
                        return featureFilter[index] == 1;
                    });

                    $("#addition").append("<h3>Mean</h3>");

                    for (i = 0; i < meanArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: " + meanArray[i] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: " + meanArray[i] + "<br>");
                        }

                    }

                }

                if (document.getElementById("i-median").checked) {
                    var medianArray = [];

                    for (i = 0; i < datasets[0].length; i++) {
                        medianArray.push(median(datasets.map(d => d[i])));
                    }

                    $("#addition").append("<h3>Median</h3>");

                    medianArray = medianArray.filter(function (data, index) {
                        return featureFilter[index] == 1;
                    });

                    for (i = 0; i < medianArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: " + medianArray[i] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: " + medianArray[i] + "<br>");
                        }
                    }
                }

                if (document.getElementById("i-sd").checked) {
                    var sdArray = [];

                    for (i = 0; i < datasets[0].length; i++) {
                        sdArray.push(standardDeviation(datasets.map(d => d[i])));
                    }

                    sdArray = sdArray.filter(function (data, index) {
                        return featureFilter[index] == 1;
                    });

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

                    for (i = 0; i < datasets[0].length; i++) {
                        minMaxArray.push(minMax(datasets.map(d => d[i])));
                    }

                    $("#addition").append("<h3>Min and Max</h3>");

                    minMaxArray = minMaxArray.filter(function (data, index) {
                        return featureFilter[index] == 1;
                    });

                    for (i = 0; i < minMaxArray.length; i++) {
                        if (titles) {
                            $("#addition").append("<b>" + titles[i] + "</b>: Min:" + minMaxArray[i][0] + " - Max:" + minMaxArray[i][1] + "<br>");
                        } else {
                            $("#addition").append("<b>Feature " + i + "</b>: Min:" + minMaxArray[i][0] + " - Max:" + minMaxArray[i][1] + "<br>");
                        }
                    }
                }

                var maxValue = 0;
                for (i = 0; i < datasets[0].length; i++) {
                    var tempMax = minMax(datasets.map(d => d[i]))[1];
                    if (tempMax > maxValue) {
                        maxValue = tempMax;
                    }
                }

                if (meanArray || medianArray || sdArray || minMaxArray) {
                    drawAdditionChart(titles, meanArray, medianArray, sdArray, minMaxArray, maxValue);
                }


            });
        });
    });

}
