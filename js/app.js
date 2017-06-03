function rgba(array) {
    return 'rgba(' + array.join(',') + ')';
}

function getColorForBarChart(index, numberOfFeature) {
    var baseColorCode = Math.round(255 / numberOfFeature);
    var rgbValue = index * baseColorCode;
    return "rgba(" + rgbValue + "," + 200 + "," + 150 + ",1)";
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function draw() {
    $("#chart").html("");
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
                let titles = titleString.split('\n').filter(e => e !== '').map(p => p.split(','));
                let color = hexToRgb($('#color').val());
                titles = titles[0];
            
                switch (chartType) {
                    case "color":
                        if (gridHeight * gridWidth < protos.length) {
                            alert('gridHeight * gridWidth must be bigger than the number of prototypes');
                        } else {
                            drawColorsMap(protos, cards, color, titles, gridHeight, gridWidth);
                        }
                        break;
                    case "bar":
                        console.log("Draw Grid Bar");
                        drawBarChart(protos, cards)
                        break;
                }
            });
        });
    });

}