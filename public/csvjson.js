//var file = File.createFromFileName("path/to/some/file");

//var csvFiles = document.querySelectorAll(".csv");

let dbFunctions = require("./database.js");
let papa = require("papaparse");
var fs = require("fs");

function CJDone(results, file) {
    console.log("CJD");
    dbFunctions.writeFile ();
//    dbFunctions.importNames(results.data);
    console.log("import done");
}

function CJRow (results, file) {
    console.log ("CJR");
    dbFunctions.importNames(results.data);
}

var myConfig = {
    newline: "", // auto-detect
    quoteChar: "",
    delimiter: "", // auto-detect
    escapeChar: "",
    header: true,
    trimHeaders: false,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: CJRow,
    complete: CJDone,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined
};

function csvJson(file) {
    // When the file is a local file when need to convert to a file Obj.
    var content = fs.readFileSync("./uploads/" + file, "utf8");
    papa.parse(content, myConfig);
    console.log("csvJson");
}

module.exports = csvJson;