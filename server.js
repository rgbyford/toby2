var express = require("express");
var exphbs = require("express-handlebars");

var queryDB = require("./public/database.js");
//var csvJson = require("./public/csvjson.js");

// Set up the Express app to handle data parsing
var app = express();
app.use(express.json());
var PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    assemble: {
        options: {
            helpers: ["./public/csvjson.js"]
        }
    },
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

csvJson = require ("./public/csvjson.js");

app.get("/contacts", function (req, res) {
    console.log("get contacts");
    res.render("index", {});
});

var multer = require("multer");
var upload = multer({
    dest: "./uploads/"
});

app.use(function (req, res, next) {
    console.log("use: ", req.files); // JSON Object
    next();
});

// I don"t know if the "avatar" here has to match what is in the put
app.put("/contacts/import", upload.single("avatar"), function (req, res, next) {
    console.log("put import contacts");
    console.log("file: ", req.file);
    //req.file.filename gives the file name on the server
    // req.file.originalname gives the client file name
    console.log("body: ", req.body);
    csvJson(req.file.filename);
    res.render("index", {});
});


let sLocIntl = "any";
let sLocUSA = "any";

app.post("/contacts/submit", function (req, res) {
    let oButtonInput = JSON.parse(req.body);
    console.log(oButtonInput);
    if (sLocIntl !== "any" && sLocIntl !== "none") {
        sLocIntl = $("#tag-loc").val();
    } else if (sLocIntl === "any") {
        sLocIntl = "intl";
    }
    if (sLocUSA !== "any" && sLocUSA !== "none") {
        sLocUSA = $("#tag-loc").val();
    } else if (sLocUSA === "any") {
        sLocUSA = "USA"; // just search for the "USA" prefix
    }
    if (sLocIntl === "intl") {
        sLocUSA = "any";
    }
    sLocUSA = "any"; // too many without location
    sLocIntl = "any"; // ditto
    for (var i = 0; i < oButtonInput.boxes.length; i++) {
        //            asSubDepts[i] = boxes[i].value;
        aoResults = queryDB(boxes[i].value, sLocUSA, sLocIntl); // shows the results
    }
    //        console.log(aoResults);

    res.render("index", {
        foods: burgerForList,
        eaten: eatenList
    });
    return;
});