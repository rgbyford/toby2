let express = require("express");
let router = express.Router();
csvJson = require("../public/csvjson.js");
dbFunctions = require("../public/database.js");
let aoCats = [{}];
let asPrev = [];
let iAnds = -1;
let bAndBtnDisabled = false;

function renderContacts(res) {
    let asCatStrings = [];
    console.log("renderContacts");
    // set up the "level 0" categories
    aoCats = dbFunctions.readCatsFile();
    let j = 0;
    aoCats.forEach(function (element) {
        if (element.sIsSubCatOf === "") {
            asCatStrings[j++] = element.sCat;
        }
    });
    asCatStrings.sort();
    asCatStrings.unshift("any");
    console.log("rC asPrev: ", asPrev);
    res.render("index", {
        cats11: asCatStrings,
        cats12: [],
        cats13: [],
        cats14: [],
        asPrev: asPrev,
        search: false
    });
}

router.get("/contacts", function (req, res) {
    asPrev.forEach((element, i) => {
        asPrev[i] = "";
    });
    //    asPrev = "";
    console.log("get contacts");
    renderContacts(res);
});

router.get("/contacts/and", function (req, res) {
    //    iAnds++;
    console.log("get contacts/and");
    renderContacts(res);
});

var multer = require("multer");
var upload = multer({
    dest: "./uploads/"
});

router.get("/", function (req, res) {
    console.log("get /");
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

let asValues = [];

router.post("/contacts/select", function (req, res) {
    let asCats = [];
    //    let asTemp = [];
    let asCats11 = [];
    let asCats12 = [];
    let asCats13 = [];
    let asCats14 = [];
    let bCats12Done = false;
    let bCats11Done = false;
    console.log("cs ", req.body.sId, req.body.sValue);
    //    bAndBtnDisabled = req.body.sValue.length > 1;
    let bDone = (typeof (req.body.sValue) !== "string") && (req.body.sValue.length > 1);
    //    let bDone = req.body.sValue.length > 1;
    console.log("bDone: ", bDone);
    //bDone = false;
    // disable the AND button until Next is hit
    //    bAndBtnDisabled = true;

    aoCats.forEach(function (element, i) {
        //        console.log("ISO: ", element.sIsSubCatOf, req.body.sValue[0]);
        if (element.sIsSubCatOf === req.body.sValue[0]) {
            asCats[i + 1] = element.sCat;
        }
    });
    asCats = asCats.filter(v => v !== "");
    asCats = asCats.sort();
    asCats.unshift("any");
    //    console.log("asC: ", asCats, " ", asCats.length);
    bAndBtnDisabled = asCats.length > 2;
    //    console.log("ABD: ", bAndBtnDisabled);
    if (asCats.length >= 1) { // 1 for "any" and 1 more
//    if (asCats.length >= 1) { // 1 for "any" and 1 more
        /*eslint-disable indent*/
        switch (req.body.sId) {
            case "cats11":
                // We've just had the case, so move on to the next one
                asValues[1] = req.body.sValue;
                asCats11 = [asValues[1]];
                asCats12 = asCats;
                asValues[2] = asCats12[0];
                bCats11Done = true;
                break;
            case "cats12":
                //                bAndBtnDisabled = false;
                asValues[2] = req.body.sValue;
                console.log("sV12: ", asValues[2]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = asCats.length > 2 ? asCats: [];
                console.log ("asC13: ", asCats13);
                asValues[3] = asCats13[0];
                bCats11Done = true;
                bCats12Done = true;
                break;
            case "cats13":
                asValues[3] = req.body.sValue;
                console.log("sV13: ", asValues[3]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = [asValues[3]];
                asCats14 = asCats.length > 2 ? asCats : [];
                bCats11Done = true;
                bCats12Done = true;
                asValues[4] = asCats14[0];
                break;
            case "cats14":
                asValues[4] = req.body.sValue;
                console.log("sV14: ", asValues[4]);
                asCats11 = [asValues[1]];
                asCats12 = [asValues[2]];
                asCats13 = [asValues[3]];
                asCats14 = [asValues[4]];
                bCats11Done = true;
                bCats12Done = true;
                // asValues[5] = asCats15[0];
                break;
            default:
                console.log("sId error: ", req.body.sId);
                break;
        }
        /* eslint-enable indent*/
        console.log("cs: ", asPrev);
        res.render("index", {
            cats11: asCats11,
            cats12: asCats12,
            cats13: asCats13,
            cats14: asCats14,
            asPrev: asPrev,
            andBtnDisabled: bAndBtnDisabled,
            cats11Done: bCats11Done,
            cats12Done: bCats12Done,
            search: false
        });
    } else {
        // set last of asValues - use the last char of "catsxx" as []
        asValues[parseInt(req.body.sId.substr(-1))] = req.body.sValue;
    }
});

function setPrevious () {
//    console.log("iAnds: ", iAnds);
    iAnds++;
    if (iAnds === 0) {
        asPrev.length = 0;
    }
    asPrev[iAnds] = "";
    for (let i = 0; i < asValues.length; i++) {
        if (asValues[i] !== undefined) {
            console.log("asV: ", asValues[i]);
            asPrev[iAnds] += asValues[i] + " ";
        }
        asValues[i] = "";
    }
    console.log("ca AND: ", asPrev);
}

router.post("/contacts/and", function (req, res) {
    setPrevious();
    res.redirect("/contacts/and");
});

let sLocIntl = "any";
let sLocUSA = "any";

router.post("/contacts/search", function (req, res) {
//    let oButtonInput = JSON.parse(req.body);
//    console.log("oBI: ", oButtonInput);
    setPrevious ();
    iAnds = -1;
    console.log("asP: ", asPrev);
    //dbFunctions.queryDB (asPrev);
    res.render("index", {
        asPrev: asPrev,
        search: true
    });

    // if (sLocIntl !== "any" && sLocIntl !== "none") {
    //     sLocIntl = $("#tag-loc").val();
    // } else if (sLocIntl === "any") {
    //     sLocIntl = "intl";
    // }
    // if (sLocUSA !== "any" && sLocUSA !== "none") {
    //     sLocUSA = $("#tag-loc").val();
    // } else if (sLocUSA === "any") {
    //     sLocUSA = "USA"; // just search for the "USA" prefix
    // }
    // if (sLocIntl === "intl") {
    //     sLocUSA = "any";
    // }
    // sLocUSA = "any"; // too many without location
    // sLocIntl = "any"; // ditto
    // for (var i = 0; i < oButtonInput.boxes.length; i++) {
    //     //            asSubDepts[i] = boxes[i].value;
    //     aoResults = queryDB(boxes[i].value, sLocUSA, sLocIntl); // shows the results
    // }
    //        console.log(aoResults);

    // res.render("index", {
    //     foods: burgerForList,
    //     eaten: eatenList
    // });
//    return;
});
module.exports = router;