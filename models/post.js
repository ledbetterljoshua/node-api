var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    url: String, 
    highlighted: String, 
    comment: String, 
    image: String, 
    group: String, 
    timeStamp: String, 
    description: String, 
    title: String
});



module.exports = mongoose.model('Post', PostSchema);