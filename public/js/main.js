let dbFunctions = require ("../database");

function showSubDept() {
    for (let i = 0; i < aasCinematograpy.length; i++) {
        //        $(`type=checkbox name=${i}`)
        $(".sub-dept").append(`<input type="checkbox" name="cbox" value="${aasCinematograpy[i][0]}">${aasCinematograpy[i][0]}<br>`);
    }
}

$(document).ready(function () {
    // let asCats = [];
    // console.log ("finding subcats");
    // asCats = dbFunctions.findSubCats ("");
    // for (let i = 0; i < asCats.length; i++) {
    //     $("#tag-dept").append($("<option>")
    //         .val(asCats.sThisCat)
    //         .html(asCats.sThisCat)
    //     );
    // }


    fillUSA(); // the default

    function handleFileSelect(evt) {
        // event occurs after file(s) are chosen for import
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

    // $("#tag-loc").empty();
    // for (let i = 0; i < aTagsLocUSA.length; i++) {
    //     $("#tag-loc").append($("<option>")
    //         .val(aTagsLocUSA[i][0])
    //         .html(aTagsLocUSA[i][1] === " ? aTagsLocUSA[i][0] : aTagsLocUSA[i][1])
    //     );
    // }

});

function submitButton() {}
