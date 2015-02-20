var app = angular.module('scoreKeep');

app.service('matchService', function() {

	var finishedMatchObj = {
		
		player1Id: null,
		player1Wins: null,

		player2Id: null,
		player2Wins: null,

		matchWinnerId: null,
		matchLength: null,

		gamesArr: [],

	};

	this.addGame = function(gameObj) {

		finishedMatchObj.gamesArr.push(gameObj);

		gameWins.push(gameObj.winner);

		if (finishedMatchObj.gamesArr.length === matchLength) {

			var dfd = $q.defer();
		
			$http({

				url: '/api/saveMatch',
				method: 'POST',
				data: finishedMatchObj

			})
				.then(function(res) {

					dfd.resolve(res);

				}); 

			return dfd.promise;

		};

	};

	this.configureMatch = function(player1Id, player2Id, matchLength) {

		finishedMatchObj.player1Id = player1Id;
		finishedMatchObj.player2Id = player2Id;
		finishedMatchObj.matchLength = matchLength;

	};

});