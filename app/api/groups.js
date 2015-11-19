var express = require('express');
var app = express();
var router = express.Router(); 
var Group = require('../models/groups');

// more routes for our API will happen here
/* ==================================
		POST TO THE database
==================================*/

module.exports = exports = function() { 
	router.route('/groups')
		.post(function(req, res) {
			var group = new Group();
	    	group.name = req.body.name;
	    	group.save(function(err) {
	            if (err) 
	               res.send(err);

	            res.json({ message: 'group created!' });
	        });
		}) 
		.get(function(req, res) {
	        Group.find(function(err, groups) {
	            if (err)
	                res.send(err);

	            res.json(groups);
	        });
	    });
	router.route('/groups/:group_id')

	    // get the post with that id (accessed at GET http://localhost:8080/api/groups/:group_id)
	    .get(function(req, res) {
	        Group.findById(req.params.group_id, function(err, group) {
	            if (err)
	                res.send(err);
	            res.json(group);
	        });
	    })

	    // update the group with this id (accessed at PUT http://localhost:8080/api/groups/:group_id)
	    .put(function(req, res) {

	        // use our group model to find the group we want
	        Group.findById(req.params.group_id, function(err, group) {

	            if (err)
	                res.send(err);

	            group.name = req.body.name;

	            // save the group
	            group.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'group updated!' });
	            });

	        });
	    })

	    // delete the group with this id (accessed at DELETE http://localhost:8080/api/groups/:group_id)
	    .delete(function(req, res) {
	        Group.remove({
	            _id: req.params.group_id
	        }, function(err, group) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });
	    app.use('/api', router);
};
