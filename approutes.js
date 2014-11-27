exports.route = function(app, controller) {
  //  prefix = '/' + prefix;
  
    var controllerObject = require('./controllers/' + controller);
	//console.log('/'+controller);
	//console.log(controllerObject.addForm);
	app.get('/'+controller + '/add', controllerObject.addForm);
    app.post('/'+controller + '/add', controllerObject.create);
    app.get('/'+controller+'/', controllerObject.index);
    console.log(controller);
	app.get('/'+controller + '/:id', controllerObject.show);

	
	
	app.get('/'+controller + '/del/:id', controllerObject.deleteForm);
    app.del('/'+controller + '/del', controllerObject.delete);
		
	app.get('/'+controller + '/edit/:id', controllerObject.editForm);
    app.put('/'+controller + '/edit', controllerObject.edit);
	app.put('/'+controller + '/setPic', controllerObject.setPic);
	// records
	if(controller == 'records'){
	    app.put('/records/addSong', controllerObject.addSong);
	}
    // bands
	if(controller == 'bands'){
	    console.log(controller+"NEST");
	    app.put('/bands/addMember', controllerObject.addMember);
		console.log(controller+"NEST1");
		app.get('/bands/deleteMember/:id', controllerObject.deleteMember);
	}
};