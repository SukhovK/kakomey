var http = require('http');
var path = require('path');
var fs = require('fs');
var BandModel    = require('../models/bands').BandModel;
BandModel.find({bid: 22},function (err, bands) {
    var records = [];
	var RecordModel    = require('../models/records').RecordModel;
	RecordModel.find({rid:3},function (err, rec) {
	    albums = []
		console.log(rec[0]+"rec");
		bands[0].albums.forEach(function(record){
		console.log(record+"rek");
			if(record.rid == rec[0].rid){
				var tumb = "images/covers/tumbs/"+rec[0].rid+"R"+rec[0].cover;
				record.cover = tumb;
			}
			albums.push(record);
		});
		console.log(albums);
		var updateBand = {
			albums: albums
	    };
		BandModel.update({bid:bands[0].bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");		
        } }); 
    }); 
	//console.log(records);

   /* BandModel.update({bid:bands[0].bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");		
        } }); */

});