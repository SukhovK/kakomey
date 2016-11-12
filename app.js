var express = require('express');
var stylus = require('stylus');
var lessMiddleware = require('less-middleware');
var map = require('./approutes');
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var port = process.env.PORT || 3000;
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
// var favicon = require('favicon');
var favicon = require('serve-favicon');
var parseurl = require('parseurl');
/* require('nodetime').profile({
    accountKey: 'fa879692449f53968b1b61dba36262362ce38394', 
    appName: 'Node.js Application'
}); */

var app = express();
app.use(methodOverride());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded())
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use('/', express.static(__dirname + '/public'));
app.use(function(err, req, res, next) {
    if(err){
        console.log(err.message+" pise");
    }
});

app.route('/').get( function(req, res) {
    var BandModel    = require('./models/bands').BandModel;
    console.log(BandModel);
    BandModel.find({visible:1},function (err, bands) {
        if (!err) {
            bands=snifle(bands);
            console.log(bands.length);
            res.render('index', {title:'Bands',bandsList: bands});
        } else {
            console.log("st7");
        }
    });
});
app.get('/login', function(req, res){
    console.log("testa");
    var username = req.username ? req.user.username : '';
    res.render('login', { title: 'authenticate', username: username, message: 'clear' });
});

app.get('/login/*', function(req, res){
    console.log("testu");
    var username = req.username ? req.user.username : '';
    res.render('login', { title: 'authenticate', username: username, message: 'login' });
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login'}),
    function(req, res) {
        res.redirect(req.session.url);
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(function (req, res, next) {
    if(!req.session.pathname)
        req.session.pathname = parseurl(req).pathname;
    next()
})


app.get('/bar', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
var prefixes = ['bands','musicians','records'];
// map route to controller
prefixes.forEach(function(prefix) {
    map.route(app, prefix);
});

app.use(bodyParser.json);


app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));



app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(passport.initialize());
app.use(passport.session());
app.use(lessMiddleware(__dirname + '/views', {
       dest: __dirname + '/public'
      })
);

app.listen(8080, function () {
    console.log('Example app listening on port 3000!');
});

// http.createServer(app).listen(8080);
// console.log("Express server listening on port 8080");

function snifle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = arr[num];
        arr[num] = arr[i];
        arr[i] = d;
    }
    return arr;
}
