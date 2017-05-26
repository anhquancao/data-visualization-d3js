function draw() {
    let protoStr = '';
    let cardStr = '';
    readAsync('proto').then((content) => {
        protoStr = content;
        readAsync('card').then((content) => {
            cardStr = content;
            
            console.log(protoStr);
            console.log(cardStr);
        });
    });
}