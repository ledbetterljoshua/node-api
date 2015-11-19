var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require("mongoose-relationship");


var Post     = require('./post');
var User     = require('./user');

var GroupSchema = Schema({
	name	: String, 
	posts	: [{type: Schema.Types.ObjectId, ref: "Post"}], 
	user 	: {type:String, ref:"User" },
	created : {type:Date, default: Date.now}
});

module.exports = mongoose.model('Group', GroupSchema);