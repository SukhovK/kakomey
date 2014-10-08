exports.index = function(req, res){
    res.render('index', {title:'Bands',textBody: 'Hello, MyExpress!!!'});
};