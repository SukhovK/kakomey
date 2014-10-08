exports.route = function(app, prefix) {
    console.log('rout');
    prefix = '/' + prefix;
    var prefixObj = require('./controllers/' + prefix);
// index
    app.get(prefix, prefixObj.index);
// add
    app.get(prefix + '/new', prefixObj.new);

// create
    app.post(prefix + '/create', prefixObj.create);
// edit
    app.get(prefix + '/:id/edit', prefixObj.edit);
};