var express = require('express');
var app = express();

//var mongojs = require('mongojs');
//var db = mongojs('posts', ['posts']);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');

var connectionString = process.env.SEARCHBOX_URL;

mongoose.connect('mongodb://jled5917:Jled591711811000@ds053944.mongolab.com:53944/posts'); // connect to our database
var Post = require('./models/post');
var Group = require('./models/groups');

var client = new elasticsearch.Client({
    host: connectionString
});
client.index({
  index: 'sample',
  type: 'document',
  id: '1',
  body: {
          name: 'Reliability',
          text: 'Reliability is improved if multiple redundant sites are used, which makes well-designed cloud computing suitable for business continuity.'
  }
}, function (error, response) {
  console.log(response);
});
client.search({
        index: 'sample',
        type: 'document',
        body: {
            query: {
                query_string:{
                   query:"Reliability"
                }
            }
        }
    }).then(function (resp) {
        console.log(resp);
    }, function (err) {
        console.log(err.message);
    });

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

var router = express.Router();              // get an instance of the express Router

app.use('/static', express.static('iframe'));

// more routes for our API will happen here
/* ==================================
		POST TO THE database
==================================*/
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


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port)
console.log('hello world from server.js on port 3000')