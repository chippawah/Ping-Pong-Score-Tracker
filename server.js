// Declarations & Set Up...
	var session = require('express-session');
	var bodyParser = require('body-parser');
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var Player = require('./server-assests/models/playerModel');
	var playerCtrl = require('./server-assests/controllers/playerCtrl');
	var matchCtrl = require('./server-assests/controllers/matchCtrl');
	var rethink = require('./server-assests/controllers/rethinkdbCtrl')
	var Match = require('./server-assests/models/matchModel');
	var express = require('express');
	var app = express();
	var http = require('http');
	var server = http.createServer(app);
	var io = require('socket.io').listen(server);

// Middleware & Stuff...

	server.listen(80);

	io.on('connection', function(socket) {

		console.log('Sockets work, ya bish');
		socket.on('new match', rethink.newMatch);
		socket.on('new player', rethink.registerPlayer);
		socket.on('get match', rethink.getMatch);
		socket.on('find player', rethink.findPlayer);
		socket.on('update match', rethink.updateMatch);
		socket.on('finished match', rethink.finishMatch);

	});

	app.use(bodyParser.json());

	app.use(express.static(__dirname+'/public'));

	app.use('/bower_components', express.static(__dirname + '/bower_components'));

	app.use(session({
		secret: '12PINGpongGAMEon34'
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(username, password, done) {
		rethink.findPlayer(username, function(response) {
			console.log('Player found for pass compare: ', response.player);
			if (!response.player) {		
				return done(null, false);		
			};
			playerCtrl.comparePassword(password, response.player.password).then(function(isMatch) {
				console.log('isMatch: ', isMatch);
				if (!isMatch) {
					return done(null, false);
				};
				return done(null, response.player);
			});
		
		});

	}));

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	var isAuthed = function(req, res, next) {
		if (!req.isAuthenticated()) {
			return res.status(403).end();
		};
		return next();
	};

// POST REQUESTS

	app.post('/api/playerLogin', passport.authenticate('local'), function(req, res) {
		res.status(200).json(req.user);
	});

// GET REQUESTS

	app.get('/api/logout', function(req, res) {
		req.logout();
		res.status(200).end();
	});

	app.get('/api/getPrimaryUser', isAuthed, function(req, res) {
		res.json(req.user);
	});

app.listen(8001);
