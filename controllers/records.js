var RecordModel    = require('../models/records').RecordModel;
var fs = require('fs');
exports.index = function(req, res) {
   RecordModel.find({},function (err, records) {
  // console.log(records)
	    if (!err) {
           res.render('records/record_list', {title:'Records',recordsList: records});
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
    var rid = req.params.id
    RecordModel.find({rid:rid},function (err, record) {
	    if (!err) {
            var record = record[0];
			//console.log(record);
	        if(!fs.existsSync('public/images/covers/'+rid+'R'+record.cover)){
		        record.cover = 'disc.jpg';
		    }
            var countSongs = record.songs.lenght;
			console.log(record.songs.lenght);
		    var persons=[];
		    for(i=0; i < record.members.length; i++){
			    persons.push(record.members[i].name);
		    }
		    res.render('records/edit_form',
			    {   record: record, 
					members: persons.join(','),
					countSongs: countSongs
				});
        } else {
		    console.log(err);
	    }
	});  
}
// сохранение
exports.edit = function(req, res){
  var rid = req.body.rid;
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
    var updateRecord = {
      rid: rid,
      title: req.body.title,
	  year: req.body.year,
	  group: req.body.group,
	  review: req.body.review,
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
    var rid = req.body.rid;
    var src = req.files.cover.path;
	var path = "public/images/covers/"+rid+"R"+req.files.cover.name;
	var tumb = "public/images/covers/tumbs/"+rid+"R"+req.files.cover.name;
    fs.renameSync(src, path);
	var imagic = require('imagemagick');
	//Ресайзим
    imagic.resize({ srcPath: path, dstPath: tumb, width: 100, filter: 'Point' }, function(err, stdout, stderr){
        if (err) throw err;
    });
	var updateRecord = {
      rid: rid,
	  cover: req.files.cover.name
    };
	
	RecordModel.update({rid:rid}, updateRecord, function(err,data){
  	    if (!err) {
            console.log(updateRecord);
			console.log("Данные сохранены");
	        res.redirect('/records/');			
        } else {
		    console.log(err);
        }
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
			res.redirect('/records/'+rid);			
        } else {
		    console.log(err);
		}
      });  
  });	
}