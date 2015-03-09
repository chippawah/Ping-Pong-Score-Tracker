var r = require('rethinkdb');
var q = require('q');
var matches = r.db('scoreKeep').table('matches');
var players = r.db('scoreKeep').table('players');
var bcrypt = require('bcrypt');

var saveMatch = function (matchObj, cb) {

	console.log('Saving this matchObj to rethinkDB: ', matchObj);

	var resObj = {};

	matches.insert(matchObj).run(connection, function(err, result) {

		if (err) {

			resObj.error = err;

		} else {

			console.log('Match saved with id: ', JSON.stringify(result.generated_keys[0]));

			resObj.matchId = result.generated_keys[0];

		};

		cb(resObj);	

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

				});

			});

		});

	});

};

var getMatch = function(matchId, cb) {

	onConnection(function(connection) {

		matches.filter({id: matchId}).run(connection, function(err, result) {

			var resObj = {};

			if (err) {

				console.log(err);

				resObj.error = err;

			} else {

				resObj.matchObj = result;

			};

			cb(resObj);

		});

	});

};

var findPlayer = function(email){		

	var dfd = q.defer();

	onConnection(function(connection){

		players.filter({email: email}).run(connection, function(err, response) {

			if (err) {

				dfd.reject(err);

			} else {

				response.next(function(err, player) {

					dfd.resolve(player);

				});

			};

			connection.close();

		});

	});

	return dfd.promise;

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

	saveMatch: saveMatch,
	registerPlayer: registerPlayer,
	getMatch: getMatch,
	findPlayer: findPlayer

};