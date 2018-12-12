var express = require('express');
//var bodyParser = require('body-parser');
//var path = require('path');
var exphbs = require('express-handlebars');
//var orm = require('./config/orm.js');

var queryDB = require('./public/database.js');
//var csvJson = require('./public/csvjson.js');

// Set up the Express app to handle data parsing
var app = express();
app.use(express.json());
var PORT = process.env.PORT || 3000;

//var mysql = require('mysql');

app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Set Handlebars as the default templating engine.
app.engine('handlebars', exphbs({
    assemble: {
        options: {
            helpers: ['./public/csvjson.js']
        }
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/contacts', function (req, res) {
    console.log('get contacts');
    res.render('index', {});
});

// var http = require('http');

// var fs = require('fs');
//const multer = require('multer');
// const csv = require('fast-csv');
// app.use(multer({
//     dest: './tmp/'
// }));

var multer = require('multer');
//var upload = multer ({dest: './uploads/'});
var upload = multer({
    dest: './uploads/'
});

app.use(function (req, res, next) {
    console.log('use: ', req.files); // JSON Object
    next();
});

app.post('/contacts/import', upload.single('avatar'), function (req, res, next) {
    // app.post('/contacts/import', function (req, res) {
    console.log('import contacts');
    //    console.log(req);
    console.log('file: ', req.files);
    console.log('body: ', req.body);
    //    csvJson(req.body.string);
    res.render('index', {});
});

// app.post ('/contacts/import', upload.single('avatar'), function (req, res, next) {
//     console.log ('file: ', req.file);
//     console.log ('body: ', req.body);
// });
// router.post('/contacts/import', upload.single('file'), function (req, res, next) {
//     console.log ('router post');
//     var fileRows = [];
//     // open uploaded file
//     csv.fromPath(req.file.path)
//         .on('data', function (data) {
//             fileRows.push(data); // push each row
//         })
//         .on('end', function () {
//             console.log(fileRows[0]);
//             fs.unlinkSync(req.file.path); // remove temp file
//             //process "fileRows"
//         });
// });

// const Router = express.Router;
// const upload = multer({
//     dest: 'tmp/csv/'
// });
// const router = new Router();
// const server = http.createServer(app);
// const port = 3030;

// app.post('/contacts/import', upload.single('file'), function (req, res) {
//     const fileRows = [];
//     console.log ('app post');
//     // open uploaded file
//     csv.fromPath(req.file.path)
//         .on('data', function (data) {
//             fileRows.push(data); // push each row
//         })
//         .on('end', function () {
//             console.log(fileRows)
//             //            fs.unlinkSync(req.file.path); // remove temp file
//             //process "fileRows" and respond
//         });
// });

// app.use('/contact/import', router);

// //Start server
// function startServer() {
//     server.listen(port, function () {
//         console.log('Express server listening on ', port);
//     });
// }

// setImmediate(startServer);


// var fileUpload = require('express-fileupload');
// app.use(fileUpload());

// var http = require('http'),
//     inspect = require('util').inspect;

// var Busboy = require('busboy');

// app.post('/contacts/import', function (req, res) {
//     //    http.createServer(function(req, res) {
//     var busboy = new Busboy({
//         headers: req.headers
//     });
//     busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
//         console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
//         file.on('data', function (data) {
//             console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
//         });
//         file.on('end', function () {
//             console.log('File [' + fieldname + '] Finished');
//         });
//     });
//     busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
//         console.log('Field [' + fieldname + ']: value: ' + inspect(val));
//     });
//     busboy.on('finish', function () {
//         console.log('Done parsing form!');
//         res.writeHead(303, {
//             Connection: 'close',
//             Location: '/'
//         });
//         res.end();
//     });
//     req.pipe(busboy);
// });

// app.post('/contacts/import', function (req, res) {
//     console.log('import');
//     console.log(req.files);
//     //    var file;

//     if (!req.files) {
//         console.log('File not found');
//         res.send('File was not found');
//         return;
//     }
// });

//     file = req.files.FormFieldName; // here is the field name of the form
//     console.log (file);

//     // file.mv("file.txt", function (err) //Obvious Move function
//     //     {
//     //         // log your error
//     //     });

//     res.send('File Uploaded');
// });



let sLocIntl = 'any';
let sLocUSA = 'any';

app.post('/contacts/submit', function (req, res) {
    let oButtonInput = JSON.parse(req.body);
    console.log(oButtonInput);
    if (sLocIntl !== 'any' && sLocIntl !== 'none') {
        sLocIntl = $('#tag-loc').val();
    } else if (sLocIntl === 'any') {
        sLocIntl = 'intl';
    }
    if (sLocUSA !== 'any' && sLocUSA !== 'none') {
        sLocUSA = $('#tag-loc').val();
    } else if (sLocUSA === 'any') {
        sLocUSA = 'USA'; // just search for the 'USA' prefix
    }
    if (sLocIntl === 'intl') {
        sLocUSA = 'any';
    }
    sLocUSA = 'any'; // too many without location
    sLocIntl = 'any'; // ditto
    for (var i = 0; i < oButtonInput.boxes.length; i++) {
        //            asSubDepts[i] = boxes[i].value;
        aoResults = queryDB(boxes[i].value, sLocUSA, sLocIntl); // shows the results
    }
    //        console.log(aoResults);

    res.render('index', {
        foods: burgerForList,
        eaten: eatenList
    });
    return;
});