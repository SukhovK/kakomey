var express = require('express');
var stylus = require('stylus');
var lessMiddleware = require('less-middleware');
var map = require('./approutes');

var app = express();
var port = process.env.PORT || 8080;
var http = require('http');
var path = require('path');
/* require('nodetime').profile({
    accountKey: 'fa879692449f53968b1b61dba36262362ce38394', 
    appName: 'Node.js Application'
}); */
app.configure(function(){
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.set('views', __dirname + '/views');	
    app.use(express.favicon());
	//app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
    app.use(lessMiddleware(__dirname + '/views', {
       dest: __dirname + '/public'
      })
	);
   
	app.use(express.static(path.join(__dirname, 'public')));
});

app.use(function(req, res, next){
  throw new Error(req.url + ' not found');
});
app.use(function(err, req, res, next) {
    console.log(err);
    res.send(err.message);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});
app.get('/', function(req, res) {
   var BandModel    = require('./models/bands').BandModel;
      BandModel.find({},function (err, bands) {
	if (!err) {
	  res.render('index', {title:'Bands',bandsList: bands});
	}
      });
});
var prefixes = ['bands','musicians','records'];
// map route to controller
prefixes.forEach(function(prefix) {
    map.route(app, prefix);
});
http.createServer(app).listen(8080);
console.log("Express server listening on port 8080");
