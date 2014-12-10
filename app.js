var express = require('express');
var stylus = require('stylus');
var lessMiddleware = require('less-middleware');
var map = require('./approutes');
var session = require('express-session')
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var port = process.env.PORT || 8080;
var http = require('http');
var path = require('path');
var crypto = require('crypto');

/* require('nodetime').profile({
    accountKey: 'fa879692449f53968b1b61dba36262362ce38394', 
    appName: 'Node.js Application'
}); */
var users= [];
users[1] ={userid:1, username: 'admin', password: 'pmyPass'};
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}
passport.serializeUser(function(user, done) {
	done(null, user.userid);
});
passport.deserializeUser(function(id, done) {
	var user = users[id];
	done(err, user);
});

passport.use(new localStrategy(
  function(username, password, done) { 
    users.forEach(function(item){
      if(item.username == username){
	 if(item.password= password){
	    var user = {userid : item.userid,
			username : username,
			password : password };
	    return done(null, user);
	 } else {
	  return done(null, false, {message: 'Invalid password'});
	}
      }
    });
    
    return done(null, false, {message: 'Unknown user ' + username});
 
  })
);

var app = express();
app.configure(function(){
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.set('views', __dirname + '/views');	
    app.use(express.favicon());
	//app.use(express.logger());
    app.use(app.router);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    
    //app.use(express.cookieDecoder());
   app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true
	}));
   
   app.use(flash());
   app.use(passport.initialize());
   app.use(passport.session());
	/////////////////////////////
  /*    app.use(passport.initialize()); 
    app.use(passport.session()); */


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
			bands=snifle(bands);
			res.render('index', {title:'Bands',bandsList: bands});
		}
      });
});

app.get('/admin', ensureAuthenticated, function(req, res){
  res.render('index', { title: 'authenticate', user: req.user });
});

app.get('/login', function(req, res){
  var username = req.user ? req.user.username : '';
  res.render('login', { title: 'authenticate', username: username, message: 'error' });
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/admin');
});

var prefixes = ['bands','musicians','records'];
// map route to controller
prefixes.forEach(function(prefix) {
    map.route(app, prefix);
});
http.createServer(app).listen(8070);
console.log("Express server listening on port 8080");

function snifle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = arr[num];
        arr[num] = arr[i];
        arr[i] = d;
    }
    return arr;
}
