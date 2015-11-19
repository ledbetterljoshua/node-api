// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var relationship = require("mongoose-relationship");


var Post     = require('./post');
var Group    = require('./groups');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        username     : String,  
        created: {type:Date, default: Date.now} 

    }, 
    groups            : [{type: Schema.Types.ObjectId, ref: "Group"}], 
    posts             : [{type: Schema.Types.ObjectId, ref: "Post"}]

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);