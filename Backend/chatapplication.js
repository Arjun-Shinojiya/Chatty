var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let connectionjs = require('./connection/connection');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var  socket = require('./routes/sockets')(io);

/* app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));
 */
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('views',__dirname);
 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST","GET")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 
 res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
});  
 
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"../Frontend")));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/public/chatfolders'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({secret:"sessionsecret"}));
app.use(passport.initialize());
app.use(require('./routes/route'));

app.use(function(req,res,next){
  res.status(404).sendFile(path.resolve("../Frontend/404error.html"));
})
http.listen(3000, function () {
  console.log('listening on *:3000');
});

