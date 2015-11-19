var express = require('express');
var app = express();
var router = express.Router(); 
var Post  = require('../models/post');

module.exports = exports = function() {
	router.route('/posts')

	    // create a post (accessed at POST http://localhost:8080/api/posts)
	    .post(function(req, res) {
	        
	        var post = new Post();      // create a new instance of the post model
	        post.url = req.body.url;
	        post.highlighted = req.body.highlighted;
	        post.comment = req.body.comment;  // set the posts name (comes from the request)
	        post.image = req.body.image;
	        post.title = req.body.title;
	        post.description = req.body.description;
	        post.timeStamp = req.body.timeStamp;
	        post.group = req.body.group;
	        // save the post and check for errors
	        post.save(function(err) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'post created!' });
	        });
	        
	    })
	    /* ================================== 
			GET FROM THE database
	==================================*/
	    .get(function(req, res) {
	        Post.find(function(err, posts) {
	            if (err)
	                res.send(err);

	            res.json(posts);
	        });
	    });
	    /* ==================================
			GET A SINGLE ITEM
	==================================*/
		router.route('/posts/:post_id')

	    // get the post with that id (accessed at GET http://localhost:8080/api/posts/:post_id)
	    .get(function(req, res) {
	        Post.findById(req.params.post_id, function(err, post) {
	            if (err)
	                res.send(err);
	            res.json(post);
	        });
	    })

	    // update the post with this id (accessed at PUT http://localhost:8080/api/posts/:post_id)
	    .put(function(req, res) {

	        // use our post model to find the post we want
	        Post.findById(req.params.post_id, function(err, post) {

	            if (err)
	                res.send(err);

	            post.url = req.body.url;
	            post.highlighted = req.body.highlighted;
	            post.comment = req.body.comment;  // update the posts info
	            post.image = req.body.image;
	            post.title = req.body.title;
		        post.description = req.body.description;
		        post.timeStamp = req.body.timeStamp;
		        post.group = req.body.group;
	            // save the post
	            post.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'post updated!' });
	            });

	        });
	    })

	    // delete the post with this id (accessed at DELETE http://localhost:8080/api/posts/:post_id)
	    .delete(function(req, res) {
	        Post.remove({
	            _id: req.params.post_id
	        }, function(err, post) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });
	    app.use('/api', router);
};