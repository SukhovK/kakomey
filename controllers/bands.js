﻿var BandModel    = require('../models/bands').BandModel;
var fs = require('fs');
var async = require('async');
// var fs = require('fs');
exports.index = function(req, res) {
   BandModel.find({visible:1},function (err, bands) {
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
        console.log("test");
	    if (!err) {
			var RecordModel    = require('../models/records').RecordModel;
			//////////////////////////////////////////////////
			RecordModel.find({"group.name":band[0].name},function (err, records) {
				var covers = [];
				records.forEach(function(item){
					var cover =    item.cover					
				    covers[item.rid] = cover;
				  //  console.log(item);
                    console.log(item.cover);
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
	  short: req.body.short,
	  history: req.body.history
  };
  
  BandModel.update({bid:bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/admin/bands/edit/'+bid);
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
	        res.redirect('/admin/bands/edit/'+bid);
        } else {
		    console.log(err);
        }
    });	
}
exports.addMember  = function(req, res){

	var MusicianModel    = require('../models/musicians').MusicianModel;
    var bid = req.body.bid;
    var name = req.body.name;

	async.waterfall([
		function (callback){
			BandModel.find({bid:bid},function(err,band) {
				callback(null, band[0]);
			});
		},
		function (band, callback){
			var MusicianModel    = require('../models/musicians').MusicianModel;
			MusicianModel.find({'name': name}, function(err, person) {
				callback(null,band, person, MusicianModel);
			});
		},
        function (band, person, MusicianModel, callback){

            if(person.length > 0 ){
                person[0].groups.push({bid: bid, name: band.name});
                updateMusician = {
                    groups :  person[0].groups
                }
                MusicianModel.update({aid:person[0].aid}, updateMusician, function(){
                    callback(null, band,  person[0]);

                });

            } else {
                var newMusicion = {
                    name: name
                }
                var newPerson = new MusicianModel(newMusicion);
                newPerson.getLastAid(function(err, p){
                    if(err){
                        console.log(err);
                    }
                    newPerson.aid = p.aid + 1;
                    newPerson.groups = [{bid: bid, name: band.name}];
                    newPerson.save();
                    callback(null, band, newPerson);
                });
            }
        },
        function (band, person, callback){
            var newMember = {
                name : person.name,
                aid : person.aid
            }
            band.members.push(newMember);
            updateBand = {
                members : band.members
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
    ]);
}
exports.deleteMember  = function(req, res){
    var bid = req.params.bid;
	var aid = req.params.aid;
		BandModel.find({bid:bid},function(err,band){ 	
			var members = band[0].members;
			console.log(members);
			for(j=0;j < members.length; j++){
			    if(members[j].aid == aid){
                    members.splice(j, 1);
				}			    
			}
			console.log(members);
			updateBand = {
				members : members
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
exports.check = function(req, res){
	var bid = req.params.bid;
	BandModel.find({bid:bid},function(err,band){
		updateBand = {
			visible : 1
		}
		BandModel.update({bid:bid}, updateBand, function(err,data){
			if (!err) {
				console.log("Данные сохранены");
				res.redirect('/admin/bands/');
			} else {
				console.log(err);
			}
		});
	});
}
exports.uncheck = function(req, res){
	var bid = req.params.bid;
	BandModel.find({bid:bid},function(err,band){
		updateBand = {
			visible : 0
		}
		BandModel.update({bid:bid}, updateBand, function(err,data){
			if (!err) {
				console.log("Данные сохранены");
				res.redirect('/admin/bands/');
			} else {
				console.log(err);
			}
		});
	});
}