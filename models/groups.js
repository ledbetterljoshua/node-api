var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var GroupSchema = Schema({
	name: String
});

module.exports = mongoose.model('Group', GroupSchema);