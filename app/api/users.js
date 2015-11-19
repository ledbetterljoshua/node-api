var express = require('express');
var app = express();
var router = express.Router(); 
var User  = require('../models/user'); 

// more routes for our API will happen here
/* ==================================
        POST TO THE database
==================================*/
module.exports = exports = function() {
	router.route('/users')
	    .post(function(req, res) {
	        var user = new User();

	        user.local.name 	= req.body.name;
	        user.local.email 	= req.body.email;
	        user.local.password = req.body.password
	        user.save(function(err) {
	            if (err) 
	               res.send(err);

	            res.json({ message: 'user created!' });
	        });
	    }) 
	    .get(function(req, res) {
	        User.find(function(err, users) {
	            if (err)
	                res.send(err);

	            res.json(users);
	        });
	    });
	router.route('/users/:user_id')

	    // get the post with that id (accessed at GET http://localhost:8080/api/users/:user_id)
	    .get(function(req, res) {
	        User.findById(req.params.user_id, function(err, user) {
	            if (err)
	                res.send(err);
	            res.json(user);
	        });
	    })

	    // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
	    .put(function(req, res) {

	        // use our user model to find the user we want
	        User.findById(req.params.user_id, function(err, user) {

	            if (err)
	                res.send(err);

	            user.name 			= req.body.name;
	            user.local.email 	= req.body.email;
	        	user.local.password = req.body.password

	            // save the user
	            user.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'user updated!' });
	            });

	        });
	    })

	    // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
	    .delete(function(req, res) {
	        User.remove({
	            _id: req.params.user_id
	        }, function(err, user) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });
	    app.use('/api', router);
}