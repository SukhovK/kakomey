var mongoose = require('mongoose');
var db  = require('../mongoose').db;

var RecordSchema = new mongoose.Schema( {
        rid: { type: Number, index: true, min: 1 },
        title: { type: String},
		cover: {type: String},
        year: {type: String},
		group: {bid:Number, name: String},
		lable: {type: String},
		review: {type: String},
        members:[{aid: Number, name: String, role:Array}],
		songs:[{order: Number, title: String, time:String}],
    });

RecordSchema.statics.getLastUid = function (){
    var coll =this.find({}).sort({'uid': -1}).limit(1);
	console.log(coll.bid);
}
var RecordModel =  db.model('Record', RecordSchema);
module.exports.RecordModel = RecordModel;
