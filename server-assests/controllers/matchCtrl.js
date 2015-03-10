var gameCtrl = require('./gameCtrl');

var configureMatch = function(matchInfo) {

	var matchObj = {

		player1: {

			name: matchInfo.playerInfo.p1Name,
			id: matchInfo.playerInfo.p1Id,
			wins: 0

		},

		player2: {

			name: matchInfo.playerInfo.p2Name,
			id: matchInfo.playerInfo.p2Id,
			wins: 0

		},

		winnerId: 'winnerEmail',
		matchLength: matchInfo.matchLength,
		gameNumber: 1,

		gamesArr: []

	};

	matchObj = gameCtrl.addGames(matchObj, matchInfo.matchLength);

	return matchObj;

}

module.exports = {

	configureMatch: configureMatch

};
