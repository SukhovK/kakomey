var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/bands');
var BandSchema = new mongoose.Schema( {
        bid: { type: Number, index: true, min: 1 },
        name: { type: String, match: /[a-z ]/},
        state: {type: String, default: "uk"},
        members:[{aid: Number, name: String}]   
    });
db.on('error', function (err) {
    console.log("connection error:", err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});
BandSchema.methods.showBand = function () {
        console.log("Группа: "+this.name);
		console.log("Состав: ");
		var persons = this.members
		
		for(i=0;i < persons.length;i++){
		    console.log("     "+persons[i].name);
		}
} 
BandSchema.statics.showBands = function () {
 var bands =  this.find({},function(error, bands){
    bands.forEach(function(band){
        console.log(band);
    });
 });
}



var BandModel =  db.model('Band', BandSchema);
BandModel.showBands();
//module.exports.BandModel = BandModel;
