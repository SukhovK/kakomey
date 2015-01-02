var http = require('http');
var path = require('path');
var fs = require('fs');
var BandModel    = require('../models/bands').BandModel;
BandModel.find({bid: 21},function (err, bands) {
    var albums = [];
	var n = 1;
    bands[0].albums.forEach(function(item){
	   item.title = item.name;
	   // n++;
	   item.name=null;
        console.log(item);
		albums.push(item);			
    }); 
	var updateBand = {
	    albums: albums
	};
   BandModel.update({bid:bands[0].bid}, updateBand, function(err,data){
  	    if (!err) {
            console.log("Данные сохранены");		
        } else {
		    console.log(err);
		}
		
  }); 

});