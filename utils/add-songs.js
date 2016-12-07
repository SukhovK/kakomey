var path = require('path');
var fs = require('fs');
var async = require('async');
var cache = {'/etc':'/private/etc'};
console.log(process.argv);
var file = process.argv[2];
var rid = process.argv[3];

var text = fs.readFileSync(file, "utf8");
var RecordModel    = require('../models/records').RecordModel;

//   console.log(records)
     
            var songs = [];
            var data = text.split('\n');
            data.forEach(function(item){
                var song = item.split('|');
                songs.push({
                    title:trim(song[1]),
                    order:trim(song[0]),
                    time:trim(song[2]).replace(/[\(\)]/g, ''),
                    authors : trim(song[3])
            })
               // console.log(records);
            })
            RecordModel.find({rid:rid},function(err,record){ 
                record[0].songs = songs;
                var updateRecord = {
                    songs : record[0].songs
                }
            RecordModel.update({rid:rid}, updateRecord, function(err,data){
                if (!err) {     
                    console.log("Данные сохранены");         
                } else {
                    console.log(err);       
                }
            });  
              });  

function trim (str) {
    var re = new RegExp('^[' + ' \s\xA0'  + ']+|[' +  ' \s\xA0' + ']+$', 'g');
    return str.replace(re, '');
}
////////////////////////////
/*
var BandModel    = require('../models/bands').BandModel;
var MusicianModel    = require('../models/musicians').MusicianModel;
var data = text.split('\n');
console.log(data);

var AsyncInsert = {
    number: 0,
    addMembers: function(item, callback){
        var result =0;
        BandModel.find({bid:bid},function(err,band) {
            MusicianModel.find({'name': item}, function(err, person) {
                if(person.length > 0 ){
                    person[0].groups.push({bid: bid, name: band[0].name});
                    updateMusician = {
                        groups :  person[0].groups
                    }
                    MusicianModel.update({aid:person[0].aid}, updateMusician, function(){
                        result =  person[0];
                    });
                } else {
                    var newMusicion = {
                        name: item
                    }
                    var newPerson = new MusicianModel(newMusicion);
                    newPerson.getLastAid(function(err, p){
                        if(err){
                            console.log(err);
                        }
                        if(AsyncInsert.number == 0) {
                            newPerson.aid = p.aid + 1;
                        } else {
                            newPerson.aid = AsyncInsert.number + 1;
                        }
                        AsyncInsert.number = newPerson.aid;
                        newPerson.groups = [{bid: bid, name: band.name}];
                        newPerson.save();
                        result =  newPerson;
                    });
                }
            });
        });
        setTimeout(function(){
            callback(null, result);
        }, 2000);
    }
};

async.map(['r1','r2', 'r3'], AsyncInsert.addMembers.bind(AsyncInsert), function(err, result){
    updateBand = {
        members : result
    }
    BandModel.update({bid:bid}, updateBand, function(err,data){
        if (!err) {
            console.log("Äàííûå ñîõðàíåíû");
        } else {
            console.log(err);
        }
    });
  console.log(result);
});
*/