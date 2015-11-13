var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('posts', ['posts']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/posts', function(req, res) {
	console.log('I recieved a get request');

	db.posts.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	})
});

app.post('/posts', function(req, res) {
	console.log(req.body);
	db.posts.insert(req.body, function(err, doc) {
		res.json(doc);
	})
});

app.delete('/posts/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.posts.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	})
});

app.get('/posts/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.posts.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

app.put('/posts/:id', function(req, res) {
	var id = req.params.id;
	console.log(req.body.url);
	db.posts.findAndModify({query:{_id: mongojs.ObjectId(id)}, 
			update: {$set: 
				{url: req.body.url, 
				highlighted: req.body.highlighted, 
				comment: req.body.comment}
			},
		new: true}, function(err, doc) {
			res.json(doc);
		});
});

app.listen('3000')
console.log('hello world from server.js on port 3000')