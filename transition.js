var mysql = require('mysql')
var express = require('express');
var app = express();
var router =  express.Router();
var bodyParser = require('body-parser');
var con = mysql.createConnection({
    host: '10.11.90.15',
    port:'3306',
    password:'Study1111%', // Replace with your host name
    user: 'study',      // Replace with your database username
    Schema: 'my_node',      // Replace with your database password
    table: 'files' // // Replace with your database Name
});

con.connect();





var PORT = 4001;
app.listen(PORT, function() {
    console.log('http://localhost:' + PORT + '/email_page');
    console.log('http://localhost:' + PORT + '/main_page');
});
app.get("/email_page", function(req, res) {

    res.render(__dirname + '/transition.ejs');

});

app.get("/main_page", function(req, res) {

    res.sendFile(__dirname + '/transition2.html');

});

//
//
//


// window.onload = () => {
//     const anchors = document.querySelectorAll('a');
//     const transition_el = document.querySelector('.transition');
//
//     setTimeout(() => {
//         transition_el.classList.remove('is-active');
//     }, 500);
//
//     for (let i = 0; i < anchors.length; i++) {
//         const anchor = anchors[i];
//
//         anchor.addEventListener('click', e => {
//             e.preventDefault();
//             let target = e.target.href;
//
//             console.log(transition_el);
//
//             transition_el.classList.add('is-active');
//
//             console.log(transition_el);
//
//             setInterval(() => {
//                 window.location.href = target;
//             }, 500);
//         })
//     }
// }
