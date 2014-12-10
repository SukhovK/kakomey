passport.use('login', new LocalStrategy({ passReqToCallback : true }, 
	function(req, username, password, done) { 
		// �������� � mongo, ���������� �� ������������ � ����� ������� 
		User.findOne({ 'username' : username }, function(err, user) {
		// � ������ ������������� ����� ������, ������� � ������� ������ done
			if (err) return done(err); // ������������ �� ����������, ������ ����� � ��������������� �������
				if (!user){ console.log('User Not Found with username '+username);
					return done(null, false, req.flash('message', 'User Not found.'));
			} 
			// ������������ ����������, �� ������ ������ �������, ������ �����
			if (!isValidPassword(user, password)){ console.log('Invalid Password');
				return done(null, false, req.flash('message', 'Invalid Password'));
			} // ������������ ���������� � ������ �����, ������� ������������ ��
			   // ������ done, ��� ����� �������� �������� ��������������
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
		// ����� ������������ � Mongo � ������� ���������������� ����� ������������ 
		User.findOne({'username':username},
			function(err, user) { 
			// � ������ ����� ������ - ������� 
				if (err){ console.log('Error in SignUp: '+err); return done(err); } 
				// ��� ���������� 
				if (user) { 
					console.log('User already exists'); return done(null, false, req.flash('message','User Already Exists')); } else { // ���� ������������ � ���� ������� ����������� ����� // � ���� �� ����������, ������� ������������ var newUser = new User(); // ��������� ��������� ���� ������� ������������ newUser.username = username; newUser.password = createHash(password); newUser.email = req.param('email'); newUser.firstName = req.param('firstName'); newUser.lastName = req.param('lastName'); // ���������� ������������ newUser.save(function(err) { if (err){ console.log('Error in Saving user: '+err); throw err; } console.log('User Registration succesful'); return done(null, newUser); }); } }); }; // �������� ���������� findOrCreateUser � ��������� // ����� �� ��������� ����� ����� ������� process.nextTick(findOrCreateUser); }); )


