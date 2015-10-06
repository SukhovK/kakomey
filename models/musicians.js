var mongoose = require('mongoose');
var db  = require('../mongoose').db;

var MusicianSchema = new mongoose.Schema( {
        aid: { type: Number, index: true, min: 1 },
        name: { type: String, match: /[a-z ]/},
		sortName: { type: String, match: /[a-z ]/},
        birth: {type: Date},
		death: {type: Date},
		bio: {type: String},
        groups:[{bid: Number, name: String}]   
    });

MusicianSchema.methods.getLastAid1 = function (){
    this.model('Musician').find({}).sort({aid: -1}).findOne(function (err, person) {
        console.log(person.aid+"ffff");
        return person.aid;
    });
}
MusicianSchema.methods.getLastAid = function (cb){
    return this.model('Musician').find({}).sort({aid: -1}).findOne(cb);
 //   return this.model('Musician').find({}, cb);
}
var MusicianModel =  db.model('Musician', MusicianSchema);
module.exports.MusicianModel = MusicianModel;
