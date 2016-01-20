var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

require('./config/passport.js')(passport)



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8100");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("X-ACCESS_TOKEN", "Access-Control-Allow-Origin", "Authorization", "Origin", "Access-Control-Allow-Headers", "x-xsrf-token, X-Requested-With, Content-Type, Access-Control-Allow-Headers", "Content-Type", "Content-Range", "Content-Disposition", "Content-Description");
  next();
});



mongoose.connect('mongodb://jled5917:Jled591711811000@ds053944.mongolab.com:53944/posts'); // connect to our database
var Post  = require('./app/models/post');
var Group = require('./app/models/groups');
var User  = require('./app/models/user');


app.use(express.static(__dirname + "/views"));

var router = express.Router();              // get an instance of the express Router

// setInterval(function(){
// Post.findOneAndUpdate({ user: '5693257517369ca1710ecaed' }, { user: '1246548868692222' }, function(err, user) {
//   if (err) throw err;
      
//   // we have the updated user returned to us
//   console.log(user);
// });
// }, 3000)

//Group.find({ _id:"564d0263de572ffcfa5c5359" }).remove().exec(); 




// more routes for our API will happen here
/* ==================================
        POST TO THE database
==================================*/
router.route('/users')
        .post(function(req, res, next) {
            var user = new User();

            user.local.name     = req.body.name;
            user.local.email    = req.body.email;
            user.local.password = req.body.password;
            user.local.post    = req.body.post;
            user.local.group    = req.body.group;

            user.save(function(err) {
                if (err) 
                   res.send(err);

                res.json({ message: 'user created!' });
            });
        }) 
        .get(function(req, res, next) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });
    router.route('/users/:user_id/posts')
    .get(function(req, res, next) {

        Post.find({ user: req.params.user_id }).exec(function(err, posts) {
          if (err) throw err;
          res.json(posts)
        });

    });
    router.route('/users/:user_id/posts/:post_id')

    // get the post with that id (accessed at GET http://localhost:8080/api/posts/:post_id)
    .get(function(req, res, next) {
        Post.findById(req.params.post_id, function(err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
    })
    

    // update the post with this id (accessed at PUT http://localhost:8080/api/posts/:post_id)
    .put(function(req, res, next) {

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
            post.favorite       = req.body.favorite;
            post.readlater      = req.body.readlater;
            post.private        = req.body.private;
            post.user           = req.user.facebook.id;
            // save the post
            post.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'post updated!' });
            });

        });
    })

    // delete the post with this id (accessed at DELETE http://localhost:8080/api/posts/:post_id)
    .delete(function(req, res, next) {
        Post.remove({
            _id: req.params.post_id
        }, function(err, post) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    router.route('/users/:user_id/groups')
    .get(function(req, res, next) {

        Group.find({ user: req.params.user_id }).exec(function(err, groups) {
          if (err) throw err;
          res.json(groups)
        });

    })
    .post(function(req, res, next) {
        var group = new Group();
        group.name = req.body.name;
        group.user = req.user.facebook.id;
        console.log("req.body.name: " + req.body.name)
        console.log("req.body.user: " + req.user.facebook.id)
        group.save(function(err) {
            if (err) 
               res.send(err);

            res.json({ message: 'group created!' });
        });
    });
    router.route('/users/:user_id/groups/:group_id/posts')
    .get(function(req, res, next) {

        Post.find({ group: req.params.group_id }).exec(function(err, groups) {
          if (err) throw err;
          res.json(groups)
        });

    });
    router.route('/users/:user_id/groups/:group_id')

    // get the post with that id (accessed at GET http://localhost:8080/api/groups/:group_id)
    .get(function(req, res, next) {

            Group.findById(req.params.group_id, function(err, group) {
                if (err)
                    res.send(err);
               res.json(group)
            });
        
        
    })

    // update the group with this id (accessed at PUT http://localhost:8080/api/groups/:group_id)
    .put(function(req, res, next) {

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
    .delete(function(req, res, next) {
        Group.remove({
            _id: req.params.group_id
        }, function(err, group) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    router.route('/users/:user_id')

        // get the post with that id (accessed at GET http://localhost:8080/api/users/:user_id)
        .get(function(req, res, next) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(function(req, res, next) {

            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {

                if (err)
                    res.send(err);

                user.name           = req.body.name;
                user.local.email    = req.body.email;
                user.local.password = req.body.password;
                user.local.post    = req.body.post;
                user.local.group    = req.body.group;

                // save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'user updated!' });
                });

            });
        })

        // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res, next) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });




// more routes for our API will happen here
/* ==================================
		POST TO THE database
==================================*/
router.route('/groups')
	.post(function(req, res, next) {
		var group = new Group();
    	group.name = req.body.name;
        group.user = req.user.facebook.id;
        console.log("req.body.name: " + req.body.name)
        console.log("req.body.user: " + req.user.facebook.id)
    	group.save(function(err) {
            if (err) 
               res.send(err);

            res.json({ message: 'group created!' });
        });
	}) 
	.get(function(req, res, next) {
        var current_user = req.user;
        console.log("req: " + req)

        Group.find({ user: current_user.facebook.id }).exec(function(err, groups) {
          if (err) throw err;

          // show the admins in the past month
          console.log(groups);
           res.json(groups);
           console.log("current user:" + current_user);
        });
    });

router.route('/groups/:group_id/posts')
    .get(function(req, res, next) {

        Post.find({ group: req.params.group_id }).exec(function(err, groups) {
          if (err) throw err;
          res.json(groups)
        });

    });
router.route('/groups/:group_id')

    // get the post with that id (accessed at GET http://localhost:8080/api/groups/:group_id)
    .get(function(req, res, next) {

            Group.findById(req.params.group_id, function(err, group) {
                if (err)
                    res.send(err);
               res.json(group)
            });
        
        
    })

    // update the group with this id (accessed at PUT http://localhost:8080/api/groups/:group_id)
    .put(function(req, res, next) {

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
    .delete(function(req, res, next) {
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
    .post(function(req, res, next) {
        var post            = new Post();      // create a new instance of the post model
        post.url            = req.body.url;
        post.highlighted    = req.body.highlighted;
        post.comment        = req.body.comment;  // set the posts name (comes from the request)
        post.image          = req.body.image;
        post.title          = req.body.title;
        post.description    = req.body.description;
        post.timeStamp      = req.body.timeStamp;
        post.group          = req.body.group;
        post.favorite       = req.body.favorite;
        post.readlater      = req.body.readlater;
        post.private        = req.body.private;
        post.user           = req.user.facebook.id;
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
    .get(function(req, res, next) {
        
        var current_user = req.user.facebook.id || req.Authorization;

        Post.find({ user: current_user }).exec(function(err, posts) {
          if (err) throw err;

          // show the admins in the past month
          console.log(posts);
           res.json(posts);
           console.log("current user:" + current_user);
        });

    });
    /* ==================================
		GET A SINGLE ITEM
==================================*/

	router.route('/posts/:post_id')

    // get the post with that id (accessed at GET http://localhost:8080/api/posts/:post_id)
    .get(function(req, res, next) {
        Post.findById(req.params.post_id, function(err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
    })
    

    // update the post with this id (accessed at PUT http://localhost:8080/api/posts/:post_id)
    .put(function(req, res, next) {

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
            post.favorite       = req.body.favorite;
            post.readlater      = req.body.readlater;
            post.private        = req.body.private;
            post.user           = req.user.facebook.id;
            // save the post
            post.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'post updated!' });
            });

        });
    })

    // delete the post with this id (accessed at DELETE http://localhost:8080/api/posts/:post_id)
    .delete(function(req, res, next) {
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