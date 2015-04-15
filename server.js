// server.js

    // set up ========================
    var express  = require('express');
    var app      = express(); // create our app w/ express
    var session = require('cookie-session');
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var flash    = require('connect-flash');
    var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


    // configuration =================

    mongoose.connect('mongodb://localhost/todoApp');     // connect to mongoDB

    app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(session({secret: 'Noble64'}));
    //app.use(express.session({ secret: 'noble64' }));
  	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(flash());


    // Set Schema for our todos and users.


    var Schema = mongoose.Schema;

    var TodoSchema = new Schema({
    	name : String,
    	text: String,
    	priority: String,
        due: Date,
        category: [],
        reminders: [],
        note: String,
        userid: String,
        completed: Boolean,
        completedOn: Date,
        created: {type: Date, Default: Date()}

    	});

    var Todo = mongoose.model('Todo', TodoSchema);

    var UserSchema = new Schema({
    	username: String,
    	password: String,
    	lastlogin: {type: Date, Default: Date()},
    	logins: {type: Number, Default: 0},
    	created: {type: Date, Default: Date()}
    });

        UserSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

    var User = mongoose.model('User', UserSchema);



    // Authentication via passport module.

    passport.use(new LocalStrategy(
	  function(username, password, done) {
	    User.findOne({ username: username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect username.' });
	      }
	      if (!user.validPassword(password)) {
	        return done(null, false, { message: 'Incorrect password.' });
	      }
	      return done(null, user);
	    });
	  }
	));

			passport.serializeUser(function(user, done) {
		    console.log('serializeUser: ' + user._id);
		    done(null, user._id);
		});

		passport.deserializeUser(function(id, done) {
		    User.findById(id, function(err, user){
		        console.log(user);
		        if(!err) done(null, user);
		        else done(err, null);
		    });
		});

    // End authentication code... thank god.

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

    // get all todos for specific user.
    app.get('/api/todos/users', function(req, res) {

        console.log("Getting todo's for " + req.session.passport.user);
        // use mongoose to get all todos in the database
        Todo.find({userid: req.session.passport.user}, function(err, todos) {
            console.log(todos);
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
			console.log(req.session.passport.user + " is creating a todo!");
        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            note : req.body.note,
            priority: req.body.priority,
            userid: req.session.passport.user,
            created: Date(),
            completed: false,
            category: req.body.category.split(','),
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find({userid: req.session.passport.user},function(err, todos) {
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
            Todo.find({userid: req.session.passport.user},function(err, todos) {
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

		  // change the todo to completed
		  if(todo.completed === true) {
		  todo.completed = false;
		} else{
			todo.completed = true;
		}
		  // save the todo
		  todo.save(function(err) {
		    if (err) throw err;
		Todo.find({userid: req.session.passport.user}, function(err, todos) {
		                if (err)
		                    res.send(err);
		                res.json(todos);
		            });
		    console.log('Todo successfully updated!');
		  });

		});
		});

      // Login code
      app.post('/api/users/login',
	  passport.authenticate('local'),
	  function(req, res) {
	    // If this function gets called, authentication was successful.
	    // `req.user` contains the authenticated user.
	    //res.redirect('/' + req.user.username);
	    User.findOne(req.user.username, function(err, user) {
		  if (err) throw err;
          var loginCount = user.logins;
		  // update the lastlogin date and increment the login count.
		  user.lastlogin = Date();
    //user.logins =  loginCount + 1;
		  // save the todo
		  user.save();

		});
	    res.json(req.user);


	    console.log("Logged in: " + req.user.username);
	  });


        app.post('/api/users/createuser', function(req, res) {

        // create a user, information comes from AJAX request from Angular
        User.create({
           username: req.body.username,
           password: req.body.password,
           logins: 0,
           lastlogin: Date(),
            created: Date()

        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return the user
            User.findOne(function(err, user) {
                if (err)
                    res.send(err);
                //res.json(todos);
                res.json(user);
            });
        });

    });


    // Routing

    app.get('/', function(req, res) {
    	res.sendfile('./index.html');
    	res.setHeader('Last-Modified', (new Date()).toUTCString());

    });

    app.get('/todo', function(req, res) {
      res.sendfile('./indexa.html');
      res.setHeader('Last-Modified', (new Date()).toUTCString());

    });

    app.get('/#/todo', function(req, res) {
      res.redirect('/todo');

    });




    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
