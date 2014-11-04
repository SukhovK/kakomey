var http = require('http');
var path = require('path');
var fs = require('fs');
var RecordModel    = require('../models/records').RecordModel;
RecordModel.find({},function (err, records) {
   console.log(records)
	    if (!err) {
           console.log(records);
        } else {
		   console.log(err);
		}
	});
