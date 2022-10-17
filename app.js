var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use("fine-uploader",express.static('fine-uploader'));


app.use("/", (req, res) => {
    res.sendFile(__dirname + "concept.html");

});

var port = 8001;
app.listen(port)
console.log("app.js is using port "+ port);
