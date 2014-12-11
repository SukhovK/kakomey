exports.route = function(app, controller) {
  //  prefix = '/' + prefix;
  
    var controllerObject = require('./controllers/' + controller);
	//console.log('/'+controller);
	//console.log(controllerObject.addForm);
	app.get('/'+controller + '/admin/add', controllerObject.addForm);
	app.post('/'+controller + '/admin/add', controllerObject.create);
	app.get('/'+controller+'/', controllerObject.index);
	//app.get('/'+controller+'/admin/', controllerObject.adminIndex);
	//console.log(controller);
	app.get('/'+controller + '/:id', controllerObject.show);
	
	app.get('/'+controller + '/admin/del/:id', controllerObject.deleteForm);
	app.del('/'+controller + '/admin/del', controllerObject.delete);
		
	app.get('/'+controller + '/admin/edit/:id', ensureAuthenticated, controllerObject.editForm);
	app.put('/'+controller + '/edit', controllerObject.edit);
	app.put('/'+controller + '/admin/setPic', controllerObject.setPic);
	// records
	if(controller == 'records'){
	    app.put('/records/addSong', controllerObject.addSong);
	}
    // bands
	if(controller == 'bands'){
	    app.put('/admin/bands/addMember', controllerObject.addMember);
		app.get('/admin/bands/deleteMember/:aid/:bid', controllerObject.deleteMember);
	    app.put('/admin/bands/addRecord', controllerObject.addRecord);
		app.get('/admin/bands/deleteRecord/:rid/:bid', controllerObject.deleteRecord);
		//app.get('/bands/deleteRecord/:aid/:bid', controllerObject.deleteRecord);
	}
};
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}