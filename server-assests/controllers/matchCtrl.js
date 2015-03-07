var playerCtrl = require('./playerCtrl');
var Match = require('./../models/matchModel');
var q = require('q');

module.exports.saveMatch = saveMatch;

function saveMatch(req, res) {

	// debugger;

	emailToId(req.body)

		.then(function(matchObj) {

			var finishedMatch = new Match(matchObj);

			finishedMatch.save(function(err, match) {

				if (err) {

					console.log('Save match says: ', err);

					return res.status(500).end();

				};

				return res.json(match);

			});

		});

	

};

var emailToId = function(matchObj) {

	var dfd = q.defer();

	q.all(playerCtrl.getPlayerId(matchObj.player1.email, matchObj.player2.email))

		.then(function(data) {

			matchObj.player1Id = data[0];
			matchObj.player2Id = data[1];

			if(matchObj.winnerEmail === matchObj.player1.email) {

				matchObj.winnerId = data[0];

			} else if (matchObj.winnerEmail === matchObj.player2.email) {

				matchObj.winnerId = data[1];

			}

			for (var i = 0; i < matchObj.gamesArr.length; i++) {

				if (matchObj.gamesArr[i].winner === matchObj.player1.email) {

					matchObj.gamesArr[i].winner.mongoId = data[0];
					matchObj.gamesArr[i].loser.mongoId = data[1];

				} else if (matchObj.gamesArr[i].winner === matchObj.player2.email) {

					matchObj.gamesArr[i].winner.mongoId = data[1];
					matchObj.gamesArr[i].loser.mongoId = data[0];

				};
			
			};

			dfd.resolve(matchObj);

	});

	return dfd.promise;

}