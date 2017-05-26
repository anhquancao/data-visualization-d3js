function readAsync(inputId) {
    return new Promise((resolve, reject) => {
        startRead(inputId, resolve);
    })
}

function startRead(inputId, callback) {
    // obtain input element through DOM
    var file = document.getElementById(inputId).files[0];
    if (file) {
        getAsText(file, callback);
    }
}

function getAsText(readFile, callback) {

    var reader = new FileReader();

    // Read file into memory as UTF-16      
    reader.readAsText(readFile, "UTF-8");

    // Handle progress, success, and errors
    reader.onprogress = updateProgress;
    reader.onload = onLoaded(callback);
    reader.onerror = errorHandler;
}

function updateProgress(evt) {
    if (evt.lengthComputable) {
        // evt.loaded and evt.total are ProgressEvent properties
        var loaded = (evt.loaded / evt.total);
        if (loaded < 1) {
            // Increase the prog bar length
            // style.width = (loaded * 200) + "px";
        }
    }
}

function onLoaded(callback) {
    return function loaded(evt) {
        // Obtain the read file data    
        var fileString = evt.target.result;
        callback(fileString);
    }
}


function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        // The file could not be read
    }
}