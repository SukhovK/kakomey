var passport = require('passport');
var url = require('url')
var LocalStrategy = require('passport-local').Strategy;

var users= [
{userid:0, username: 'admin', password: 'myPass'},
{userid:1, username: 'user', password: 'usPass'}];

passport.use(new LocalStrategy(
  function(username, password, done) {
  console.log("tttt"+users.length);
	for(var i=0; i <= users.length; i++){
	  console.log(users[i]);
	  if(users[i].username == username){
		if(users[i].password= password){
			var user = {userid : users[i].userid,
				username : username,
				password : password 
			};
			return done(null, user);
		} else {
			return done(null, false, {message: 'Invalid password'});
		}
      }
    }
    
		return done(null, false, {message: 'Unknown user ' + username});
 
  })
);

passport.serializeUser(function(user, done) {
	done(null, user.userid);
});
passport.deserializeUser(function(id, done) {
	var user = users[id];
	done(null, user);
});

module.exports.ensureAuthenticated =  function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	  var pathname = url.parse(req.url).pathname;
      req.session.url = pathname;

      console.log("Получен запрос " + pathname);
	  res.redirect('/login'+pathname);
}
