var BandModel    = require('../models/bands').BandModel;
var fs = require('fs');
exports.index = function(req, res) {
   BandModel.find({},function (err, bands) {
    if (!err) {
            res.render('bands/band_list', {title:'Bands',bandsList: bands});
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
// вывод информации о группе
exports.show = function(req, res) {
    var id = req.params.id;
    BandModel.find({bid:id},function (err, band) {
	    if(!fs.existsSync('public/images/main/'+band[0].mainImage)){
		    band[0].mainImage = 'main.jpg';
		}
	    if (!err) {
			var RecordModel    = require('../models/records').RecordModel;
			//////////////////////////////////////////////////
			RecordModel.find({group:band[0].name},function (err, records) {
				//console.log(records);
				var covers = [];
				records.forEach(function(item){
					var cover =    item.cover					
				    covers[item.rid] = cover;
				    console.log(item);
				});
				res.render('bands/band', {title:'Bands',band: band[0], covers:covers});
			});
			
			///////////////////////////////////////////
            
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
						res.redirect('/admin/bands/edit/');
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
			    if(group.members[i]){
			        persons.push(group.members[i].name);
				}
		    }
			var albums=[];
			console.log(group.albums);

		    res.render('bands/edit_form',
			          {band: group, 
					         members: persons});
        } else {
		    console.log(err);
	    }
	});  
}
// сохранение
exports.edit = function(req, res){
  var bid = req.body.bid;
  var bandMembers = [];
 
  
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
exports.addMember  = function(req, res){
	var MusicianModel    = require('../models/musicians').MusicianModel;
    var bid = req.body.bid;
	console.log(bid);
	BandModel.find({bid:bid},function(err,band){
		if(err){
			console.log(err);
		}
		var band1 = band[0];
	    MusicianModel.find().sort({aid: -1}).findOne(function (err, person) {
	        if (!err) {	
				var newMember = {
					aid: person.aid + 1,
					name: req.body.name
				};
				var newMusician = newMember;
				newMusician.groups = [{bid: bid, name: band1.name}];
				Musician = new MusicianModel(newMusician);
				Musician.save(function(err,data){
					if (!err) {		
					//	BandModel.find({bid:bid},function(err,band){ 
							band1.members.push(newMember);
							updateBand = {
								members : band1.members
							}
							BandModel.update({bid:bid}, updateBand, function(err,data){
								if (!err) {		
									console.log("Данные сохранены");
									res.redirect('/admin/bands/edit/'+bid);			
								} else {
									console.log(err);
								}
							});  
						//});						
					}
				});	
			
			}
		});	
	});
}

exports.deleteMember  = function(req, res){
    var bid = req.params.bid;
	var aid = req.params.aid;
	console.log(aid);
		BandModel.find({bid:bid},function(err,band){ 	
			var members = band[0].members;
			console.log(members);
			for(j=0;j < members.length; j++){
			    if(members[j].aid == aid){	
					members.splice(j,1);
				}			    
			}
			console.log(members);
			updateBand = {
				members : members
			} 
      BandModel.update({bid:bid}, updateBand, function(err,data){
  	    if (!err) {		
				console.log("Данные сохранены");
				res.redirect('/bands/edit/'+bid);			
			} else {
				console.log(err);
			} 
		});  
	});	
}
exports.addRecord  = function(req, res){
	var RecordModel    = require('../models/records').RecordModel;
    var bid = req.body.bid;
	BandModel.find({bid:bid},function(err,band){
	    RecordModel.find().sort({rid: -1}).findOne(function (err, record) {
	        if (!err) {	
				var newRecord = {
					rid: record.rid + 1,
					title: req.body.title,
					year: req.body.year,
					order: req.body.order			
				};
				
				var disk = newRecord;
				disk.group = {bid:bid, name:band[0].name};
				console.log(disk);
				Record = new RecordModel(disk);
				Record.save(function(err,data){
					if (!err) {		
							band[0].albums.push(newRecord);
							updateBand = {
								albums : band[0].albums
							}
							BandModel.update({bid:bid}, updateBand, function(err,data){
								if (!err) {		
									console.log("Данные сохранены");
									res.redirect('/admin/bands/edit/'+bid);			
								} else {
									console.log(err);
								}
							});  					
					}
				});	
			
			}
		});	
	});
}
exports.deleteRecord  = function(req, res){
    var bid = req.params.bid;
	var rid = req.params.rid;

		BandModel.find({bid:bid},function(err,band){ 	
			console.log(band);
			var records = band[0].albums;
			console.log(records);
			for(j=0;j < records.length; j++){
			    if(records[j].rid == rid){	
					records.splice(j,1);
				}			    
			}
			console.log(records);
			updateBand = {
				albums : records
			} 
		BandModel.update({bid:bid}, updateBand, function(err,data){
  	    if (!err) {		
				console.log("Данные сохранены");
				res.redirect('/admin/bands/edit/'+bid);			
			} else {
				console.log(err);
			} 
		});  
	});	
}