var mysql = require('mysql')
var express = require('express');
var app = express();
var routes = require
var con = mysql.createConnection({
    host: '10.11.90.15',
    port:'3306',
    password:'Study1111%', // Replace with your host name
    user: 'study',      // Replace with your database username
    Schema: 'my_node',      // Replace with your database password
    table: 'files' // // Replace with your database Name
});

con.connect();

global.db = con;

//
 var Data;
// // con.connect(function(err) {
// //     if (err) throw err;
// //     con.query(`SELECT * from my_node.files`, function(err,result,fields){
// //         if(err)throw err;
// //         console.log(result)
// //     })
// // });
//
//
//
var PORT = 3008;
app.listen(PORT, function() {
    console.log('http://localhost:' + PORT + '/mainpage');
    // console.log('http://localhost:' + PORT + '/sent_file');
});
app.get('/mainpage', function(req, res) {
    con.query('SELECT * FROM my_node.files ORDER BY id ', function (err, rows) {
        // console.log(rows);
        // console.log("AAA: ");
        // console.log (__dirname + '/views/datatable.ejs')
        Data = rows
        console.log("BBB: "),
        console.log(Data)


    })
    res.render(__dirname + '/datatable.ejs', {
        data: Data,
    });
    });

app.get('/abc', function(req, res) {
    con.query('SELECT * FROM my_node.files ORDER BY id ', function (err, rows) {
        // console.log(rows);
        // console.log("AAA: ");
        // console.log (__dirname + '/views/datatable.ejs')
        Data = rows
        res.send(rows)
    })
    console.log('http://localhost:' + PORT + '/abc')

})


//
//
//



// app.get('/sent_file', function(req, res) {
//     con.query('SELECT * FROM my_node.files ORDER BY id ', function (err, rows) {
//         console.log(rows);
//         console.log("AAA: ");
//         console.log (__dirname + '/views/datatable.ejs')
//         data = rows
//         console.log("BBB: ")
//         console.log(rows);
//
//             res.send(rows);
//
//     });
// })
//






