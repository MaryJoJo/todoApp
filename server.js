// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://localhost/todoApp');     // connect to mongoDB

    app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    
    
    var Schema = mongoose.Schema;
    
    var TodoSchema = new Schema({
    	name : String,
    	text: String,
    	priority: String,
        due: Date,
        category: [],
        reminders: [],
        note: String,
        completed: Boolean,
        completedOn: Date,
        created: {type: Date, Default: Date()}
    	
    	});
    
    var Todo = mongoose.model('Todo', TodoSchema);
    
    
// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            note : req.body.note,
            priority: req.body.priority,
            created: Date(),
            completed: false,
            category: req.body.category.split(','),
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err);
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err);
                res.json(todos);
            });
        });
    });
    
     // Mark a todo complete
    app.put('/api/todos/completed/:todo_id', function(req, res) {
        Todo.findById({
        		
            completed : true
  
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err);
                res.json(todos);
            });
        });
    });
    
         // Mark a todo complete v2
    app.get('/api/todos/complete/:todo_id', function(req, res) {
    	console.log(req.params.todo_id);
        Todo.findById(req.params.todo_id, function(err, todo) {
  if (err) throw err;

  // change the users location
  todo.completed = true;

  // save the user
  todo.save(function(err) {
    if (err) throw err;
Todo.find(function(err, todos) {
                if (err)
                    res.send(err);
                res.json(todos);
            });
    console.log('Todo successfully updated!');
  });

});
});
    
    
    app.get('*', function(req, res) {
    	res.sendfile('./index.html');
    	res.setHeader('Last-Modified', (new Date()).toUTCString());
    	
    });
    
    app.get('/design', function(req, res) {
    	res.sendfile('./indexa.html');
    	res.setHeader('Last-Modified', (new Date()).toUTCString());
    	
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");