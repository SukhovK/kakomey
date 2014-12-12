var login    = require('./login');
exports.route = function(app, controller) {
  //  prefix = '/' + prefix;
  
    var controllerObject = require('./controllers/' + controller);
	//console.log('/'+controller);
	//console.log(controllerObject.addForm);
	app.get('/admin/'+controller + '/add', controllerObject.addForm);
	app.post('/admin/'+controller + '/add', controllerObject.create);
	app.get('/'+controller+'/', controllerObject.index);
	app.get('/admin/'+controller+'/',login.ensureAuthenticated , controllerObject.adminIndex);
	//console.log(controller);
	app.get('/'+controller + '/:id', controllerObject.show);
	
	app.get('/admin/'+controller + '/del/:id', controllerObject.deleteForm);
	app.del('/admin/'+controller + '/del', controllerObject.delete);
		
	app.get('/admin/'+controller + '/edit/:id', login.ensureAuthenticated, controllerObject.editForm);
	app.put('/admin/'+controller + '/edit', controllerObject.edit);
	app.put('/admin/'+controller + '/setPic', controllerObject.setPic);
	// records
	if(controller == 'records'){
	    app.put('/admin/records/addSong', controllerObject.addSong);
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
