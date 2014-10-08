var MusicianModel    = require('../models/musician').MusicianModel;
// список музыкантов
exports.index = function(req, res) {
   MusicianModel.find({},function (err, musician) {
	    if (!err) {
           res.render('musician/musician_list', {title:'Musicians',bandsList: musicians});
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
// вывод формы для добавления группы 
exports.addForm = function(req, res) {
    res.render('bands/add_form');
};
// добавление новой группы 
exports.create = function(req, res) {
var bandMembers = [];
  var members = req.body.band_members.split(',');
  members.forEach(function(item){
      person = {
	          name: item, 
		      aid: ""
		  }
      bandMembers.push(person);
  });
  var newBand = {
      bid: 33,
      name: req.body.band_name,
	  state: req.body.band_state,
      members: bandMembers
  };
  Band = new BandModel(newBand);
  Band.save(function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/bands/');
        } else {
		    console.log(err);
		}
  }); 
};
// подтвеждение удаления группы
exports.deleteForm = function(req, res){
    var id = req.params.bid
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
    var id = req.body.bid;	
	BandModel.remove({bid:id}, function(err){
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
    var bid = req.params.bid
    BandModel.find({bid:bid},function (err, band) {
	    if (!err) {
            var group = band[0];
		    var persons=[];
		    for(i=0; i < group.members.length; i++){
			    persons.push(group.members[i].name);
		    }
		    res.render('bands/edit_form',{band: group, members: persons.join(',')});
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
  var updateBand = {
      bid: bid,
      name: req.body.name,
	  state: req.body.state,
      members: bandMembers
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