var MusicianModel    = require('../models/musicians').MusicianModel;
// список музыкантов
exports.index = function(req, res) {
	/* MusicianModel.remove({}, function(err){
		if (!err) {
			console.log('Группа удалена');
			res.redirect('/mmusicians/');
        } else {
		    console.log(err);
		}
	}); */
   MusicianModel.find().sort({sortName: 1}).find({},function (err, musicians) {
	    if (!err) {
			console.log(musicians);
            res.render('musicians/musician_list', {title:'Musicians',musicianList: musicians});
        } else {
		    console.log(err);
		}
	});
};
exports.adminIndex  = function(req, res) {
   BandModel.find({},function (err, bands) {
    if (!err) {
           res.render('bands/band_admin', {title:'Bands',bandsList: bands});
        } else {
	  console.log(err);
		}
	});
};
// вывод информации о музыканте
exports.show = function(req, res) {
    var id = req.params.mid;
    MusicianModel.find({mid:id},function (err, musician) {
	    if (!err) {
            res.render('musicians/musician', {title:'Bands',musician: musician[0]});
        } else {
		    console.log(err);
		}
	});
}
// вывод формы для добавления музыканта 
exports.addForm = function(req, res) {
    res.render('musicians/add_form');
};
// добавление нового музыканта 
exports.create = function(req, res) {   
	MusicianModel.find().sort({aid: -1}).findOne(function (err, person) {
	if(person){
		var aid = person.aid + 1;}
	else{
		var aid = 1;
	}
    var newPerson = {
      aid: aid,
      name: req.body.person_name
    };
	console.log(newPerson);
	
	
	
    Musician = new MusicianModel(newPerson);
    Musician.save(function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/musicians/');
        } else {
		    console.log(err);
		}
	});
  }); 
};
// подтвеждение удаления
exports.deleteForm = function(req, res){
    var aid = req.params.id
    MusicianModel.find({aid:aid},function (err, person) {
	    if (!err) {
		console.log(person);
			res.render('musicians/delete_form',{person: person[0]});
        } else {
		    console.log(err);
		}
	}); 
}
// удаление
exports.delete = function(req, res){
    var aid = req.body.aid;	
	MusicianModel.remove({aid:aid}, function(err){
		if (!err) {
			console.log('удален');
			res.redirect('/musicians/');
        } else {
		    console.log(err);
		}
	}); 
	
}
// форма для редактирования
exports.editForm = function(req, res){
    var aid = req.params.id
	console.log(aid);
    MusicianModel.find({aid:aid},function (err, person) {
	    if (!err) {
		    console.log(person);
		    res.render('musicians/edit_form',{musician: person[0]});
        } else {
		    console.log(err);
	    }
	});  
}
// сохранение
exports.edit = function(req, res){
  var aid = req.body.aid; 
  var updateMusician = {
      aid: aid,
      name: req.body.name,
	  sortName: req.body.sortName
  };
  MusicianModel.update({aid:aid}, updateMusician, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/musicians/');			
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
	        res.redirect('/musicians/');			
        } else {
		    console.log(err);
        }
    });
	
}