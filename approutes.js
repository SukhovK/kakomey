exports.route = function(app, controller) {
  //  prefix = '/' + prefix;
  
    var controllerObject = require('./controllers/' + controller);
	//console.log('/'+controller);
	//console.log(controllerObject.addForm);
	app.get('/'+controller + '/add', controllerObject.addForm);
    app.post('/'+controller + '/add', controllerObject.create);
    app.get('/'+controller+'/', controllerObject.index);

	app.get('/'+controller + '/:bid', controllerObject.show);

	
	
	app.get('/'+controller + '/del/:bid', controllerObject.deleteForm);
    app.del('/'+controller + '/del', controllerObject.delete);
		
	app.get('/'+controller + '/edit/:bid', controllerObject.editForm);
    app.put('/'+controller + '/edit', controllerObject.edit);
};