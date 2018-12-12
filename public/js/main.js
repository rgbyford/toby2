//var sDept = ";
//    var sMain = ";
// USA is the default
/*
let aTagsMain = [
    [".pp", "Prodigium"],
    [".coc", "Cinema of Change"],
    [".dis", "Don\"t know"],
    [".ethn", "Ethnicity"],
    [".gender", "gender"],
    [".intellectual", "intellectual"],
    [".id", "ideology"],
    [".lang", "Language spoken"],
    [".loc", "Location"],
    [".net", "Shared network"],
    ["..team", "Prodigium worker"],
    [".research", "Researcher"],
    [".sport", "Sports pro"]
];
*/
let aTagsDept = [
    ["any", "any"],
    ["c", "cinematography"],
    ["o", "costume"],
    ["d", "directorial"],
    ["e", "editorial"],
    ["fx", "physical effects"],
    ["m", "makeup"],
    ["o", "outfitting"],
    ["p", "producing"],
    ["pd", "production design"],
    ["w", "writing"]
];
let aasCinematograpy = [
    ["1st-AC", "],
    ["2nd-AC", "],
    ["2nd-unit-cinematographer", "],
    ["best-kid_electric", "],
    ["best-kid_grip", "],
    ["broadcasting", "],
    ["BTS", "],
    ["camera-op", "],
    ["camera-op_underwater", "],
    ["camera-pa", "],
    ["cinematographer", "],
    ["cinematographer_macro", "],
    ["DIT", "],
    ["DIY", "],
    ["drone-op", "],
    ["electric", "],
    ["electrician", "],
    ["g&e", "],
    ["gaffer", "],
    ["grip", "],
    ["key-grip", "],
    ["livestream", "],
    ["photographer", "],
    ["shooter", "],
    ["steadicam", "],
    ["switcher", "]
];

let aTagsLocIntl = [
    ["any", "any"],
    ["Asia", "],
    ["Australia", "],
    ["Austria", "],
    ["Brazil", "],
    ["CANADA", "Canada"],
    ["Canada_Ontario", "],
    ["China", "],
    ["europe", "Europe"],
    ["France", "],
    ["Georgia", "],
    ["Germany", "],
    ["hawaii", "Hawaii"],
    ["India", "],
    ["Israel", "],
    ["Italy", "],
    ["Japan", "],
    ["Mexico", "],
    ["Morocco", "],
    ["Netherlands", "],
    ["New-Zealand", "New Zealand"],
    ["Nicaragua", "],
    ["prague", "Prague"],
    ["Quatar", "],
    ["Quatar", "],
    ["Russia", "],
    ["Senegal", "],
    ["Singapore", "],
    ["South-Africa", "South Africa"],
    ["Spain", "],
    ["Sweden", "],
    ["Turkey", "],
    ["UK", "],
    ["UK_London", "UK - London"],
    ["Zimbabwe", "]
];

//function fillUSA() {
let aTagsLocUSA = [
    ["any", "any"],
    ["ATL", "Atlanta"],
    ["Atlanta", "],
    ["austin", "Austin"],
    ["chicago", "Chicago"],
    ["Colorado", "Colorado"],
    ["Dc", "Washington DC"],
    ["Denver", "],
    ["east-coast", "East Coast"],
    ["eastcoast", "East Coast"],
    ["FL", "Florida"],
    ["houston", "Houston"],
    ["las_vegas", "Las Vegas"],
    ["LA", "Los Angeles"],
    ["miami", "Miami"],
    ["Midwest", "MidWest"],
    ["midwest", "MidWest"],
    ["minnesota", "Minnesota"],
    ["Missouri", "],
    ["Nashville", "Nashville"],
    ["Nebraska", "Nebraska"],
    ["new_england", "New England"],
    ["New_Mexico", "New Mexico"],
    ["NYC", "New York City"],
    ["Philadelphia", "],
    ["portland", "Portland"],
    ["Seattle", "],
    ["seattle", "Seattle"],
    ["SF", "an Francisco"],
    ["Utah", "],
];

function showSubDept() {
    for (let i = 0; i < aasCinematograpy.length; i++) {
        //        $(`type=checkbox name=${i}`)
        $(".sub-dept").append(`<input type="checkbox" name="cbox" value="${aasCinematograpy[i][0]}">${aasCinematograpy[i][0]}<br>`);
    }
}

$(document).ready(function () {

    fillUSA(); // the default

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        // files is a FileList of File objects.
        for (var i = 0; files[i] !== undefined; i++) {
            csvJson(files[i]);
        }
        //        queryDB();
    }

    $("#files").change(function () {
        handleFileSelect(event);
    });

    $("#tag-dept").change(function () {
        sSelectedDept = $("#tag-dept").val();
        if (sSelectedDept === "c") {
            showSubDept();
        }
        //        alert($("#tag-dept").val());
    });

    $("#tag-main").change(function () {
        sSelectedMain = $("#tag-main").val();
        //        alert($("#tag-dept").val());
    });

    //var FCData = require ("./database.js");
    //var fcData = new FCData();

    var aoResults = [{}];
    //var asSubDepts = [];

    $("#search").click(function () {
        const buttonInput = {};
        buttonInput.sDept = $("#tag-dept").val();
        buttonInput.boxes = $("input[name=cbox]:checked");
        buttonInput.string = document.getElementById("input-button").value;
        var opts = {
            method: "POST",
            body: JSON.stringify(buttonInput),
            headers: {
                "Content-Type": "application/json"
            }
        };
        fetch("/contacts/submit", opts).then(function (response) {
            location.reload(); // essential to refresh the page
        });

        //        sMain = $("#tag-main").val();
        //            console.log (boxes[0].value);
        //            console.log (boxes[1].value);

    });

    $(".names").on("click", (function () {
        const id = event.target.id;
        const sPhone = aoResults[id].oContact["Phone1-Value"];
        getContact(sPhone).then(function (resolve, reject) {
            if (reject) {
                throw err;
            }
            if (resolve.status === 404) {
                var sorry = document.createElement("p");
                sorry.textContent = "Sorry.  No image.";
                document.getElementById(id).appendChild(sorry);
            } else {
                var img = document.createElement("img");
                img.src = resolve.avatar;
                img.id = "picture";
                img.width = "150";
                document.getElementById(id).appendChild(img);
                $("#picture").attr("style", "display:block");
            }
            var phone = document.createElement("p");
            phone.textContent = sPhone;
            document.getElementById(id).appendChild(phone);

        });
    }));

    $("#locUSA").click(function () {
        fillUSA();
        sLocUSA = "any";
        sLocIntl = "none";
    });

    $("#locIntl").click(function () {
        $("#tag-loc").empty();
        for (let i = 0; i < aTagsLocIntl.length; i++) {
            $("#tag-loc").append($("<option>")
                .val(aTagsLocIntl[i][0])
                .html(aTagsLocIntl[i][1] === " ? aTagsLocIntl[i][0] : aTagsLocIntl[i][1])
            );
        }
        sLocIntl = "any";
        sLocUSA = "none";
    });

    //    document.getElementById("files").addEventListener("change", handleFileSelect, false);

    $("#tag-loc").empty();
    for (let i = 0; i < aTagsLocUSA.length; i++) {
        $("#tag-loc").append($("<option>")
            .val(aTagsLocUSA[i][0])
            .html(aTagsLocUSA[i][1] === " ? aTagsLocUSA[i][0] : aTagsLocUSA[i][1])
        );
    }

    for (let i = 0; i < aTagsDept.length; i++) {
        $("#tag-dept").append($("<option>")
            .val(aTagsDept[i][0])
            .html(aTagsDept[i][1] === " ? aTagsDept[i][0] : aTagsDept[i][1])
        );
    }

});

function submitButton() {}


//let aCats = [{sCat: ", asSubcat: []}];