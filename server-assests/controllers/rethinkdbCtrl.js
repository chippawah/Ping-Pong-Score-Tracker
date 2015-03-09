var r = require('rethinkdb');
var q = require('q');
var matches = r.db('scoreKeep').table('matches');
var players = r.db('scoreKeep').table('players');

var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {

    if (err) {

    	console.log(err);

    };

    connection = conn;

});

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

};

var getMatch = function(matchId, cb) {

	matches.filter({id: id}).run(connection, function(err, result) {

		var resObj = {};

		if (err) {

			console.log(err);

			resObj.error = err;

		} else {

			resObj.matchObj = result;

		};


	})

};



module.exports = {

	saveMatch: saveMatch,
	registerPlayer: registerPlayer,
	getMatch: getMatch

};