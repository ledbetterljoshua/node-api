var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    url: String, 
    highlighted: String, 
    comment: String
});

module.exports = mongoose.model('Post', PostSchema);