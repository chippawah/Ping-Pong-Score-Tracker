// Declarations & Set Up...
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Player = require('./server-assests/models/playerModel');
var playerCtrl = require('./server-assests/controllers/playerCtrl');
var matchCtrl =  require('./server-assests/controllers/matchCtrl');
var Match = require('./server-assests/models/matchModel');
var app = express();

// Middleware & Stuff...

mongoose.connect('mongodb://localhost/ScoreKeep');

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.use(session({

	secret: '12PINGpongGAMEon34'

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({

	usernameField: 'email',
	passwordField: 'password'

}, function(username, password, done) {

	Player.findOne({ email: username }).exec().then(function(player) {

		if (!player) {
		
			return done(null, false);
		
		}
		
		player.comparePassword(password).then(function(isMatch) {
		
			if (!isMatch) {
		
				return done(null, false);
		
			}
		
			return done(null, player);
		
		});
	
	});

}));

passport.serializeUser(function(user, done) {

	//input user model (mongoose)
	done(null, user);

});

passport.deserializeUser(function(obj, done) {

	//user object (json)
	done(null, obj);

});

var isAuthed = function(req, res, next) {

	if (!req.isAuthenticated()) {

		return res.status(403).end();


	};

	return next();

};
// POST REQUESTS

app.post('/api/saveMatch', isAuthed, matchCtrl.saveMatch);

app.post('/api/register', function(req, res) {

	console.log(req.body);

	var newPlayer = new Player(req.body);

	newPlayer.save(function(err, player) {

		if (err) {

			return res.status(500).end();

		};

		return res.json(player);

	})

});


app.post('/api/playerLogin', passport.authenticate('local'), function(req, res) {
	
	res.status(200).json(req.user);

});

app.post('/api/playerLookup', isAuthed, playerCtrl.findPlayer);

// GET REQUESTS

app.get('/api/logout', function(req, res) {

	req.logout();

	res.status(200).end();

});

app.get('/api/getPrimaryUser', isAuthed, function(req, res) {

	res.json(req.user);

});

app.listen(8080);
