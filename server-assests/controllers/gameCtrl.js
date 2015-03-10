var addGames = function(matchObj, matchLength) {

	for (var i = 0; i < matchLength; i++) {

		var gameObj = {

			winner: null,
			loser: null,
			gameNumber: null,

			game: {

				totalScore: 0,
				serveCounter: 0,
				gamePoint: false,
				tied: true,
				finalServe: false,
				showSwitchAlert: false,
				showFaultAlert: false,
				lastFivePoints: ['playerId'],
				streakCount: {

					p1Streak: 0,
					p2Streak: 0,

				},
				lastPoint: 'player'

			},

			player1: {

				score: 0,
				faults: 0,
				serving: false,
				pointsReceiving: 0,
				pointsServing: 0,
				ptsDblFaulted: 0,
				showPointData: false,
				playerId: 'p1',
				leading: false,
				streaking: false,
				showPlayerNameForm: false

			},

			player2: {

				score: 0,
				faults: 0,
				serving: false,
				pointsReceiving: 0,
				pointsServing: 0,
				ptsDblFaulted: 0,
				showPointData: false,
				playerId: 'p2',
				leading: false,
				streaking: false,
				showPlayerNameForm: false

			}

		};

		gameObj.gameNumber = i + 1;
		
		matchObj.gamesArr.push(gameObj);

	};

	return matchObj;

};

module.exports = {

	addGames: addGames

};