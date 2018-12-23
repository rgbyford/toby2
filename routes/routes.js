let express = require("express");
let router = express.Router();
csvJson = require("../public/csvjson.js");
dbFunctions = require("../public/database.js");
let aoCats = [{}];

router.get("/contacts", function (req, res) {
    let asCatStrings = [];
    console.log("get contacts");
    aoCats = dbFunctions.readCatsFile();
    let j = 0;
    aoCats.forEach(function (element) {
        if (element.sIsSubCatOf === "") {
            asCatStrings[j++] = element.sCat;
        }
    });
    res.render("index", {
        cats: asCatStrings
    });
});

var multer = require("multer");
var upload = multer({
    dest: "./uploads/"
});

router.get("/", function (req, res) {
    res.redirect("/contacts");
});


// router.use(function (req, res, next) {
//     //    console.log("use: ", req.files); // JSON Object
//     next();
// });

// I don"t know if the "avatar" here has to match what is in the put
router.put("/contacts/import", upload.single("avatar"), function (req, res, next) {
    //req.file.filename gives the file name on the server
    // req.file.originalname gives the client file name
    // console.log("body: ", req.body);
    csvJson(req.file.filename);
    res.render("index", {});
});

router.post("/contacts/select1", function (req, res) {
    console.log(req.body);
    //    let sSelect1 = JSON.parse(req.body.string);
    //    console.log("/contacts/select1/: ", sSelect1);
    res.render("index", {});
});

let sLocIntl = "any";
let sLocUSA = "any";

router.post("/contacts/submit", function (req, res) {
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
module.exports = router;
