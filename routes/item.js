exports.index = function(req, res){
    res.render('index', {title:'Bands',textBody: 'Hello, MyExpress!!!'});
};

//exports.index = function(req, res) {
   //  res.render('index', {title:'Bands',textBody: 'Hello, MyExpress!!!'});
   // var name = req.params.name;
	//res.render('band', {title:'Bands',name: name});
	//var bands = ['Cure','Clash','Damned'];
	//for (key in bands) {
   //     if (bands[key] === name) {
	//		res.render('band', {title:'Bands',name: name});
	//    }
	//}
	// next();
//}