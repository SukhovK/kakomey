var RecordModel    = require('../models/records').RecordModel;
var async = require('async');
var fs = require('fs');
var formidable = require('formidable' );
exports.index = function(req, res) {
   RecordModel.find({},function (err, records) {
	    if (!err) {
           res.render('records/record_list', {title:'Records',recordsList: records});
        } else {
		   console.log(err);
		}
	});
};

exports.adminIndex  = function(req, res) {
console.log("yes");
    RecordModel.find({},function (err, records) {
        console.log(records);
	    if (!err) {
           res.render('records/record_admin', {title:'Records',recordsList: records});
        } else {
		   console.log(err);
		}
	});
};
// вывод информации об альбоме
exports.show = function(req, res) {
    var rid = req.params.id;
    RecordModel.find({rid:rid},function (err, record) {
	    if(!fs.existsSync('public/images/cover/'+rid+'/'+record[0].cover)){
		    record[0].mainImage = 'main.jpg';
		}
		 console.log(record);
	    if (!err) {
            res.render('records/record', {title:'Record',record: record[0]});
        } else {
		    console.log(err);
		}
	});
}
// вывод формы для добавления альбома 
exports.addForm = function(req, res) {
    res.render('records/add_form');
};
// добавление нового альбома 
exports.create = function(req, res) {
RecordModel.find().sort({rid: -1}).findOne(function (err, record) {
	if(record){
		var rid = record.rid + 1;
	} else {
		var rid = 1;
	}
	var newRecord = {
      rid: rid,
      title: req.body.record_name,
	  group: req.body.record_group,
	  year: req.body.record_year  
	};
	
    var Record = new RecordModel(newRecord);
    Record.save(function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/records/');
        } else {
		    console.log(err);
		}
  });

});

};
// подтвеждение удаления группы
exports.deleteForm = function(req, res){
    var rid = req.params.id
	console.log(req.params);
    RecordModel.find({rid:rid},function (err, record) {
	console.log(record);
	    if (!err) {
			res.render('records/delete_form',{record: record[0]});
        } else {
		    console.log(err);
		}
	}); 
}
// удаление группы
exports.delete = function(req, res){
    var id = req.body.rid;	
	RecordModel.remove({rid:id}, function(err){
		if (!err) {
			console.log('Запись удалена');
			res.redirect('/admin/records/');
        } else {
		    console.log(err);
		}
	}); 
}
// форма для редактирования
exports.editForm = function(req, res){
    var rid = req.params.id
    RecordModel.find({rid:rid},function (err, record) {
	    if (!err) {
            var record = record[0];
	    
            var countSongs = record.songs.lenght;
		    var persons=[];
		    for(i=0; i < record.members.length; i++){
			    persons.push(record.members[i].name);
		    }
		    console.log("render");
		    res.render('records/edit_form',
			    {   record: record, 
					members: persons.join(','),
					countSongs: countSongs
				});
		    res.status(200);
		    console.log("render3");
        } else {
		    console.log(err);
	    }
	  // console.log("render2");
	});  
	// console.log("render4");
}
// сохранение
exports.edit = function(req, res){
	console.log(req.body)
  var rid = req.body.rid;

  var updateRecord = {
      rid: rid,
      title: req.body.title,
	  year: req.body.year,
	 // group: req.body.group, TODO: group
	  review: req.body.review
  };
  
  console.log('control1');
  RecordModel.update({rid:rid}, updateRecord, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");
			res.redirect('/records/');			
        } else {
		    console.log(err);
		}
  }); 
}

exports.setPic = function(req, res){

var form = new formidable.IncomingForm();
form.parse(req, function(err, fields, files){
if(err) return res.redirect(303, '/error' );
    var src = files.cover.path;
	var bid = fields.bid;
	var rid = fields.rid;

    var mainDir = "public/images/covers/"+bid+"/";
    if(!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir);
        fs.mkdirSync(mainDir+"tumbs/");
    }
    var path = mainDir+files.cover.name;;
	var tumb = mainDir+"tumbs/"+files.cover.name;
    fs.renameSync(src, path);
    var imagic = require('imagemagick');
    console.log("tumb "+tumb);
    console.log("path "+path);
	//Ресайзим TODO - to RecordModel.update
    imagic.resize({ srcPath: path, dstPath:tumb, width: 100, filter: 'Point' },
		function(err, stdout, stderr){
			if (err){
                console.log("oi");
                console.log(err);
            } else {
				var BandModel    = require('../models/bands').BandModel;
				BandModel.find({bid:bid},function(err,band){
				var albums = [];
				band[0].albums.forEach(function(record){
					if(record.rid == rid){
						record.cover = tumb;
					}
							albums.push(record);
						});
						updateBand = {
							albums: albums
						}
						BandModel.update({bid:bid}, updateBand, function(err,data){
							if (!err) {		
								console.log("Данные сохранены");		
							} else {
								console.log(err);
							}
						});

						});
					}
				});
	var updateRecord = {
		rid: rid,
		cover: files.cover.name
	};

	RecordModel.update({rid:rid}, updateRecord, function(err,data){
  	    if (!err) {
            console.log(updateRecord);
			console.log("Данные сохранены");
	        res.redirect('/admin/records/edit/'+rid);			
        } else {
		    console.log(err);
        }
    });
});
	
}

exports.addSong  = function(req, res){
    var rid = req.body.rid;
	var newSong = {
	  rid: rid,
      order: req.body.order,
	  title: req.body.title,
	  time: req.body.time
    };
	RecordModel.find({rid:rid},function(err,record){ 
      record[0].songs.push(newSong);
	  updateRecord = {
	      songs : record[0].songs
	  }
      RecordModel.update({rid:rid}, updateRecord, function(err,data){
  	    if (!err) {		
            console.log("Данные сохранены");
			res.redirect('/admin/records/edit/'+rid);			
        } else {
		    console.log(err);
		}
      });  
  });	
}
exports.deleteSong  = function(req, res){
	//console.log("delete");
	var sid = req.params.sid;
	var rid = req.params.rid;
	RecordModel.find({rid:rid},function(err,record) {
		console.log(record);
		var songs = record[0].songs;
		for (j = 0; j < songs.length; j++) {
			if (songs[j].order == sid) {
				songs.splice(j, 1);
			}
			if (songs[j].order == null) {
				songs.splice(j, 1);
			}
			// console.log(songs[j].order+" "+sid);
		}

		updateRecord = {
			songs : songs
		}
		RecordModel.update({rid:rid}, updateRecord, function(err,data){
			if (!err) {
				res.redirect('/admin/records/edit/'+rid);
			} else {
				console.log(err);
			}
		});
	});
	// res.redirect('/admin/records/edit/'+rid);
}
exports.addMember  = function(req, res){
	var rid = req.body.rid;
	var name = req.body.name;
	async.waterfall([
		function (callback){
			callback(null, name);
		},
        function (name, callback){
            var MusicianModel    = require('../models/musicians').MusicianModel;
            MusicianModel.find({'name': name}, function(err, person) {

                callback(null, person, MusicianModel);
            });
        },
		function (person, MusicianModel, callback){
            if(person.length > 0 ){
                    console.log("&&");
					var aid = person[0].aid;
                    callback(null, person[0]);

                } else {
                    var newMusicion = {
                        name: name
                    };
                    var newPerson = new MusicianModel(newMusicion);
                    newPerson.getLastAid(function(err, p){
                        if(err){
                            console.log(err);
                        }
                     //   newMusicion.aid = p.aid + 1;
                        newPerson.aid = p.aid + 1;
                        newPerson.save();
                        callback(null, newPerson);
                    });
                }
		},
		function (person, callback){
            var main = (req.body.main == 'on');
			var newMember = {
				aid: person.aid,
				name: person.name,
                main: main,
				role: [req.body.role]
			};
			RecordModel.find({rid:rid},function(err,record){
				record[0].members.push(newMember);
				updateRecord = {
					members : record[0].members
				}
				RecordModel.update({rid:rid}, updateRecord, function(err,data){
                    res.redirect('/admin/records/edit/'+rid);
                    // callback(null, 'done');
				});
			});
		}
	], function (err, result) {
		if (!err) {
			res.redirect('/admin/records/edit/'+rid);
		} else {
			console.log(err);
		}
	});
}
exports.deleteMember  = function(req, res){
	var rid = req.params.rid;
	var aid = req.params.aid;
	RecordModel.find({rid:rid},function(err,record) {
		var members = record[0].members;
		for (j = 0; j < members.length; j++) {
			if (members[j].aid == aid) {
				members.splice(j, 1);
				// console.log(members[j].aid+" "+aid);
			}
		}
		updateRecord = {
			members : members
		}

		RecordModel.update({rid:rid}, updateRecord, function(err,data){
			if (!err) {
				res.redirect('/admin/records/edit/'+rid);
			} else {
				console.log(err);
			}
		});
	});
}

function getMusiciansId(name){
	var MusicianModel    = require('../models/musicians').MusicianModel;
	MusicianModel.find({'name': name}, function(err, person){
		if(person.length > 0 ){
            return person[0].aid;
		} else {
            var newMusicion = {
                name: name
            };
			var record = new MusicianModel(newMusicion);
            record.getLastAid(function(err, p){
				if(err){
					console.log(err);
				}
				var id = p.aid + 1;
				return id ;
			});
		}
	});
}
