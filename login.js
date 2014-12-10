passport.use('login', new LocalStrategy({ passReqToCallback : true }, 
	function(req, username, password, done) { 
		// проверка в mongo, существует ли пользователь с таким логином 
		User.findOne({ 'username' : username }, function(err, user) {
		// ¬ случае возникновени€ любой ошибки, возврат с помощью метода done
			if (err) return done(err); // ѕользователь не существует, ошибка входа и перенаправление обратно
				if (!user){ console.log('User Not Found with username '+username);
					return done(null, false, req.flash('message', 'User Not found.'));
			} 
			// ѕользователь существует, но пароль введен неверно, ошибка входа
			if (!isValidPassword(user, password)){ console.log('Invalid Password');
				return done(null, false, req.flash('message', 'Invalid Password'));
			} // ѕользователь существует и пароль верен, возврат пользовател€ из
			   // метода done, что будет означать успешную аутентификацию
			return done(null, user);
		});
	});
);
var isValidPassword = function(user, password){ 
	return bCrypt.compareSync(password, user.password); 
}
passport.use('signup', new LocalStrategy(
	{ passReqToCallback : true }, 
	function(req, username, password, done) { 
		findOrCreateUser = function(){ 
		// поиск пользовател€ в Mongo с помощью предоставленного имени пользовател€ 
		User.findOne({'username':username},
			function(err, user) { 
			// ¬ случае любых ошибок - возврат 
				if (err){ console.log('Error in SignUp: '+err); return done(err); } 
				// уже существует 
				if (user) { 
					console.log('User already exists'); return done(null, false, req.flash('message','User Already Exists')); } else { // если пользовател€ с таки адресом электронной почты // в базе не существует, создать пользовател€ var newUser = new User(); // установка локальных прав доступа пользовател€ newUser.username = username; newUser.password = createHash(password); newUser.email = req.param('email'); newUser.firstName = req.param('firstName'); newUser.lastName = req.param('lastName'); // сохранени€ пользовател€ newUser.save(function(err) { if (err){ console.log('Error in Saving user: '+err); throw err; } console.log('User Registration succesful'); return done(null, newUser); }); } }); }; // ќтложить исполнение findOrCreateUser и выполнить // метод на следующем этапе цикла событи€ process.nextTick(findOrCreateUser); }); )


