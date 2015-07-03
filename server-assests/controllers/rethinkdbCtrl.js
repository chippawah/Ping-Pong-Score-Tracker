var r = require('rethinkdb');
var q = require('q');
var matchCtrl = require('./matchCtrl');
var matches = r.db('scoreKeep').table('matches');
var players = r.db('scoreKeep').table('players');
var bcrypt = require('bcrypt');

var newMatch = function (matchInfo, cb) {
	onConnection(function(connection) {
		console.log('Creating match with this info: ', matchInfo);
		var matchObj = matchCtrl.configureMatch(matchInfo);
		var resObj = {};
		matches.insert(matchObj).run(connection, function(err, result) {
			if (err) {
				resObj.error = err;
				cb(resObj);
				connection.close();
			} else {
				console.log('Match saved with id: ', JSON.stringify(result.generated_keys[0]));
				var id = result.generated_keys[0];
				matches.get(id).run(connection, function (err, match) {
					resObj.matchObj = match;
					console.log('Reponse being sent to match service from newMatch: ', resObj.matchObj);
					cb(resObj);
					connection.close();
				});
			};
		});
	});
};

var registerPlayer = function(playerObj, cb) {
	bcrypt.genSalt(12, function(err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(playerObj.password, salt, function(err, hash) {
			playerObj.password = hash;
			onConnection(function(connection) {
				players.insert(playerObj).run(connection, function(err, result) {
					var resObj = {};
					if (err) {
						console.log('Error from registerPlayer: ', err);
						resObj.error = err;
					} else {
						console.log('Player saved with id: ', JSON.stringify(result.generated_keys));
						resObj.playerId = result.generated_keys[0];
					};
					cb(resObj);
					connection.close();
				});
			});
		});
	});
};

var getMatch = function(matchId, cb) {
	var query;
	if (matchId) {
		query = matches.get(matchId);
	} else {
		query = matches;
	}
	onConnection(function(connection) {
		query
			.run(connection, function(err, result) {
				var resObj = {};
				if (err) {
					console.log(err);
					resObj.error = err;
				} else {
					resObj.matchObj = result;
				};
				cb(resObj);
				connection.close();
			});
	});
};

var updateMatch = function(matchObj, cb) {
	var id = matchObj.id
	onConnection(function(connection) {
		matches.get(id)
			.replace(matchObj)
			.run(connection, function(err, result) {
				var resObj = {};
				if (err) {
					console.log('Error from updateMatch: ', err);
					resObj.error = err;
					cb(resObj);
				} else {
					resObj.matchObj = matchObj;
					cb(resObj);
				};
			});
	});
};

var finishMatch = function(matchObj, cb) {

	var id = matchObj.id
	onConnection(function(connection) {
		matches.get(id)
			.replace(matchObj)
			.run(connection, function(err, result) {
				var resObj = {};
				if (err) {
					console.log('Error from finishMatch: ', err);
					resObj.error = err;
					cb(resObj);
				} else {
					resObj.matchObj = matchObj;
					cb(resObj);
				};
			});
	});
};

var findPlayer = function(email, cb) {
	var input = email;
	if (input.email) {
		input = input.email;
	};
	onConnection(function(connection){
		players.filter({email: input}).run(connection, function(err, response) {
			var resObj = {};
			if (err) {
				resObj.error = err;
				cb(resObj);
				connection.close();
			} else {
				response.next(function(err, player) {
					console.log(player);
					resObj.player = player;
					cb(resObj);
					connection.close();
				});
			};
		});
	});
};

var onConnection = function(cb) {
	r.connect( {host: 'localhost', port: 28015, db: 'scoreKeep'}, function(err, conn) {
	    if (err) {
	    	console.log('Connection failed with error: ', err);
	    };
	    cb(conn);
	});
};

module.exports = {

	newMatch: newMatch,
	registerPlayer: registerPlayer,
	getMatch: getMatch,
	updateMatch: updateMatch,
	finishMatch: finishMatch,
	findPlayer: findPlayer

};