const firestore = require("../config/orm.js");
var contactRef;
var aoDocs;
var aoDocsFinal;
var query;

class AoCats {
    constructor(sCat, asSubCat) {
        this.sIsSubCatOf = sCat;
        this.sThisCat = asSubCat;
    }
}

// let aoCats = [
//     new AoCats("c", ["1st-AC", "2nd-AC", "camera-pa"]),
//     new AoCats("o", ["costume-assistant", "costume-designer"])
// ];

let aoCatsRead = [];

const fs = require("fs");
let fdCats;

function openCatsFile(mode) {
    fdCats = fs.openSync("categories.txt", mode);
}

function writeCatsFile(aoCats) {
    //console.log("wCF");
    openCatsFile("w");
    fs.writeFileSync(fdCats, JSON.stringify(aoCats));
    fs.closeSync(fdCats);
}

module.exports.writeFile = function () {
    writeCatsFile(aoCatsRead);
};

module.exports.readCatsFile = function () {
    openCatsFile("r");
    const sCats = fs.readFileSync(fdCats, "utf8");
    //    console.log ("during read: ", sCats);
    aoCatsRead = JSON.parse(sCats);
    //    console.log ("after read: ", aoCatsRead);
    //    console.log ("1 read C: ", aoCatsRead[1].sCat, "SC: ", aoCatsRead[0].asSubCats[1]);
    fs.closeSync(fdCats);
    return (aoCatsRead);
};

module.exports.queryDB = function (asSearch) {
    console.log ("asSearch: ", asSearch);
    let bNoTags = false;
    aoDocs = [];
    aoDocsFinal = [];

    if (tag1 === "any") {
        if (tag2 === "any") {
            if (tag3 === "any") {
                bNoTags = true;
            } else {
                tag1 = tag3;
            }
        } else {
            tag1 = tag2;
            tag2 = tag3;
        }
    }
    if (tag2 === "any") {
        tag2 = tag3;
        tag3 = "any";
    }

    if (bNoTags) {
        tag1 = ""; // will result in a "get all"
    }
    query = firestore.dbSearchTags(tag1);

    query.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let sArr;
            if (tag2 !== "any") {
                //                    console.log ("T1: " + doc.data());
                sArr = doc.data().oContact.GroupMembership;
                if (sArr.indexOf(tag2) >= 0) {
                    aoDocs.push(doc.data());
                }
            } else {
                aoDocs.push(doc.data());
            }
        });
        for (let i = 0; i < aoDocs.length; i++) {
            //                console.log ("T2: " + aoDocs);
            if (tag3 !== "any") {
                sArr = aoDocs[i].data().oContact.GroupMembership;
                if (sArr.indexOf(tag3) >= 0) {
                    aoDocsFinal.push(aoDocs[i]);
                }
            } else {
                aoDocsFinal.push(aoDocs[i]);
            }
        }
        $("#name-list").empty();
        $("#stats").empty();
        if (aoDocsFinal.length > 0) {
            $("#name-list").append($("<p>")
                .html(aoDocsFinal.length + " contacts found")
            );
            aoDocsFinal.forEach(function (value, index) {
                if (aoDocsFinal[index].oContact !== undefined && aoDocsFinal[index].oContact.GivenName !== undefined) {
                    //                    console.log(aoDocsFinal[index].oContact.GivenName + " " + aoDocsFinal[index].oContact.FamilyName);
                    //                        $("#name-list").empty();
                    $("#name-list").append($(`<p id="${index}">`)
                        .html(aoDocsFinal[index].oContact.GivenName + " " + aoDocsFinal[index].oContact.FamilyName)
                    );
                }
            });
        } else {
            $("#name-list").append($("<p>")
                .html("No matches")
            );
        }
    });
    //        .catch(err => {
    //            console.log("Get error " + err);
    //        });
    return (aoDocsFinal);
};

module.exports.findSubCats = function (sCat) {
    let asSubCats = [];
    for (let i = 0; i < aoCatsRead.length; i++) {
        if (aoCatsRead[i].isSubCatOf === sCat) {
            asSubCats.push (acCatsRead.sThisCat);
        }
    }
};

var arrayUnique = function (arr) {
    return arr.filter(function (item, index) {
        return arr.indexOf(item) >= index;
    });
};

function buildCategories(asTag) {
    //    console.log("BC: ", asTag);
    for (let i = 0; i < asTag.length; i++) {
        // first, clean up the string
        // ignore anything that doesn't begin with .
        if (asTag[i][0] !== ".") {
            continue;
        }
        // replace .. with _
        asTag[i] = asTag[i].replace("..", "_");
        // replace vendors with vendor
        asTag[i] = asTag[i].replace("vendors", "vendor");
        // replace . with _
        asTag[i] = asTag[i].replace(/\./g, "_");

        // console.log ("Cleaned tag: ", asTag[i]);
        // tag is now "_cat_subcat_subcat_subcat...
        let asCatSub = asTag[i].split("_"); // Cat in the first element of the array, Subs in the others

        sIsSubCatOf = "";
        for (let j = 0; j < asCatSub.length; j++) { // go through the cats & subCats
            let iCatFound;
            iCatFound = aoCatsRead.findIndex(function (element) {
                return (element.sThisCat === asCatSub[j]);
            });
            if (iCatFound < 0) { // category doesn't exist - add it
                console.log("Found a new one", asCatSub[j]);
                aoCatsRead.push(new AoCats(sIsSubCatOf, asCatSub[j]));
            }
            sIsSubCatOf = asCatSub[j];
        }
    }
}

module.exports.importNames = function (data) {
    var oContact = {};
    let bFirst = true;
    //    console.log("importNames", data.length);

    data && Object.keys(data).forEach(key => {
        const nestedContent = data[key];
        //console.log ("Nested content: ", nestedContent);

        if (typeof nestedContent === "object") {
            contactRef = "";
            Object.keys(nestedContent).forEach(docTitle => {
                //                docTitle = docTitle.replace(/ /g, ");        // remove spaces
                //          console.log("dT: ", docTitle);
                let sPropName = docTitle.replace(/ /g, "");
                if (docTitle === "Given Name") {
                    givenName = nestedContent[docTitle];
                    oContact.GivenName = givenName;
                    //                    console.log("GN: ", nestedContent[docTitle]);
                } else if (docTitle === "Family Name") {
                    // create the contact document
                    //                    console.log("FN: ", nestedContent[docTitle]);
                    contactRef = givenName + "_" + nestedContent[docTitle];
                    collRef.doc(contactRef).set({
                        name: contactRef
                    });
                    oContact.FamilyName = nestedContent[docTitle];
                } else if (docTitle === "Group Membership") {
                    let asFirstSplit = [];
                    let asSecondSplit = [];
                    let sValue = nestedContent[docTitle];
                    asFirstSplit = sValue.split(" ::: ");
                    for (let i = 0; i < asFirstSplit.length; i++) {
                        let sTemp;
                        //                        let asTemp = asFirstSplit[i].split ("_");
                        // look for .locn and add "intl" if it"s not _USA
                        if (asFirstSplit[i].indexOf(".loc_U") < 0) {
                            sTemp = asFirstSplit[i].replace(".loc", "intl");
                        } else {
                            sTemp = asFirstSplit[i];
                        }
                        //                        asSecondSplit = asSecondSplit.concat(asFirstSplit[i].split("_"));
                        asSecondSplit = asSecondSplit.concat(sTemp.split("_"));
                        //                        asSecondSplit.push (asFirstSplit[i].split ("_"));
                    }
                    buildCategories(asFirstSplit);
                    //                    let asTemp = arrayUnique(asSecondSplit);
                    oContact[sPropName] = arrayUnique(asSecondSplit);
                } else {
                    let value = nestedContent[docTitle];
                    //get rid of %, and the comma after thousands
                    value = value.toString().replace(/[%,]/g, "");
                    //                    value = value.replace(/[%,]/g, ");
                    //all the values are numbers, so the following is OK
                    if ((contactRef !== ") && (nestedContent[docTitle] != ")) {
                        oContact[sPropName] = value; // remove spaces
                        //                        collRef.doc(contactRef).update({
                        //                            [docTitle]: value
                        //                            [docTitle]: nestedContent[docTitle]
                        //                        }).then(function () {
                        // wait
                        //                        });
                    }
                }
            });
            // now put it into the database
            if (contactRef !== "") { // don't know how it is "", but at the end of the file ...
                firestore.dbInsert(contactRef, oContact);
                if (bFirst) {
                    console.log(contactRef);
                    bFirst = false;
                }
            }
        }
    });
    return;
};




//module.exports = queryDB;
// module.exports = {
//     queryDB,
//     importNames
// };