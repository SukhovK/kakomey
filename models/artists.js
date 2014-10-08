var mongoose = require('mongoose');
var db  = require('../mongoose').db;

var MisicianSchema = new mongoose.Schema( {
        aid: { type: Number, index: true, min: 1 },
        name: { type: String, match: /[a-z ]/},
        birth: {type: Date},
		death: {type: Date},
		bio: {type: String},
        groups:[{bid: Number, name: String}]   
    });

MisicianSchema.statics.getLastBid = function (){
    var coll =this.find({}).sort({'bid': -1}).limit(1);
	console.log(coll.bid);
}
var ArtistModel =  db.model('Misician', MisicianSchema);
module.exports.MisicianModel = MisicianModel;
