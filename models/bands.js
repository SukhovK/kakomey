var mongoose = require('mongoose');
var db  = require('../mongoose').db;


var BandSchema = new mongoose.Schema( {
        bid: { type: Number, index: true, min: 1 },
        name: { type: String, match: /[a-z ]/},
        state: {type: String, default: "uk"},
        members:[{aid: Number, name: String}]   
    });

BandSchema.statics.getLastBid = function (){
    var coll =this.find({}).sort({'bid': -1}).limit(1);
	console.log(coll.bid);
}
var BandModel =  db.model('Band', BandSchema);
module.exports.BandModel = BandModel;
