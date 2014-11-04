var BandModel    = require('../models/bands').BandModel;
var fs = require('fs');
exports.index = function(req, res) {
   BandModel.find({},function (err, bands) {
   console.log('start')
	    if (!err) {
           res.render('bands/band_list', {title:'Bands',bandsList: bands});
        } else {
		   console.log(err);
		}
	});
};
// вывод информации о группе
exports.show = function(req, res) {
    var id = req.params.id;
    BandModel.find({bid:id},function (err, band) {
	    if(!fs.existsSync('public/images/main/'+band[0].mainImage)){
		    band[0].mainImage = 'main.jpg';
		}
		// console.log(band.mainImage);
	    if (!err) {
            res.render('bands/band', {title:'Bands',band: band[0]});
        } else {
		    console.log(err);
		}
	});
}
// вывод формы для добавления группы 
exports.addForm = function(req, res) {
   // console.log('/test!');
    res.render('bands/add_form');
};
// добавление новой группы 
exports.create = function(req, res) {
BandModel.find().sort({bid: -1}).findOne(function (err, band) {
	var bid = band.bid + 1;
	var newBand = {
      bid: bid,
      name: req.body.band_name,
	  state: req.body.band_state,
	};
    var Band = new BandModel(newBand);
    Band.save(function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/bands/');
        } else {
		    console.log(err);
		}
  });

});

};
// подтвеждение удаления группы
exports.deleteForm = function(req, res){
    var id = req.params.id
    BandModel.find({bid:id},function (err, band) {
	    if (!err) {
			res.render('bands/delete_form',{band: band[0]});
        } else {
		    console.log(err);
		}
	}); 
}
// удаление группы
exports.delete = function(req, res){
    var bid = req.body.bid;
    console.log(bid);	
	BandModel.remove({bid:bid}, function(err){
		if (!err) {
			console.log('Группа удалена');
			res.redirect('/bands/');
        } else {
		    console.log(err);
		}
	}); 
}
// форма для редактирования
exports.editForm = function(req, res){
    var bid = req.params.id
    BandModel.find({bid:bid},function (err, band) {
	    if (!err) {
            var group = band[0];
	        if(!fs.existsSync('public/images/main/'+group.mainImage)){
		        group.mainImage = 'main.jpg';
		    }

		    var persons=[];
		    for(i=0; i < group.members.length; i++){
			    persons.push(group.members[i].name);
		    }
			var albums=[];
			// console.log(group.albums);
		    for(i=0; i < group.albums.length; i++){
			    albums.push(group.albums[i].name+'|'+group.albums[i].year);
		    }
            console.log(albums);
		    res.render('bands/edit_form',
			          {band: group, 
					         members: persons.join(','), 
							 albums: albums.join('\n')});
        } else {
		    console.log(err);
	    }
	});  
}
// сохранение
exports.edit = function(req, res){
  var bid = req.body.bid;
  var bandMembers = [];
  var members = req.body.members.split(',');
  members.forEach(function(item){
      person = {
	          name: item, 
		      aid: ""
		  }
      bandMembers.push(person);
  }); 

 /* var bandAlbums = [];
 var albums = req.body.albums.split('\n');
  albums.forEach(function(item){
      var realise = item.split('|');
      var album = {
	          name: realise[0], 
		      uid: "",
			  year: realise[1]
		  }
  bandAlbums.push(album); 

  }); */
  
   console.log('control1');
  var updateBand = {
      bid: bid,
      name: req.body.name,
	  state: req.body.state,
      members: bandMembers,
	  short: req.body.short,
	  history: req.body.history,
	 // albums: bandAlbums
  };
  
  console.log('control1');
  BandModel.update({bid:bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/bands/');			
        } else {
		    console.log(err);
		}
  }); 
}
exports.setPic = function(req, res){
    var bid = req.body.bid;
    var src = req.files.main_pic.path;
    fs.renameSync(src, "public/images/main/"+bid+req.files.main_pic.name);
	var updateBand = {
      bid: bid,
	  mainImage: bid+req.files.main_pic.name,
    };
	BandModel.update({bid:bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
	        res.redirect('/bands/');			
        } else {
		    console.log(err);
        }
    });
	
}