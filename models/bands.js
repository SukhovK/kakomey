var mongoose = require('mongoose');
var db  = require('../mongoose').db;

var BandSchema = new mongoose.Schema( {
        bid: { type: Number, index: true, min: 1 },
        name: { type: String, match: /[a-z0-9 ]/},
		mainImage: {type: String},
        state: {type: String, default: "uk"},
		short: {type: String},
		history: {type: String},
        members:[{aid: Number, name: String}],
		albums:[{rid: Number, name: String, year: Number}]
    });

BandSchema.statics.getLastBid = function (){
    var coll =this.find({}).sort({'bid': -1}).limit(1);
	console.log(coll.bid);
}
var BandModel =  db.model('Band', BandSchema);
module.exports.BandModel = BandModel;
