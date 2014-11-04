exports.route = function(app, controller) {
  //  prefix = '/' + prefix;
  
    var controllerObject = require('./controllers/' + controller);
	//console.log('/'+controller);
	//console.log(controllerObject.addForm);
	app.get('/'+controller + '/add', controllerObject.addForm);
    app.post('/'+controller + '/add', controllerObject.create);
    app.get('/'+controller+'/', controllerObject.index);

	app.get('/'+controller + '/:id', controllerObject.show);

	
	
	app.get('/'+controller + '/del/:id', controllerObject.deleteForm);
    app.del('/'+controller + '/del', controllerObject.delete);
		
	app.get('/'+controller + '/edit/:id', controllerObject.editForm);
    app.put('/'+controller + '/edit', controllerObject.edit);
	app.put('/'+controller + '/setPic', controllerObject.setPic);
};