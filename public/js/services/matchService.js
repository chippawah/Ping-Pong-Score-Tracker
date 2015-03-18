var app = angular.module('scoreKeep');

var socket = io.connect('http://localhost:80');

app.service('matchService', function($location, $q, $http) {

// Variables

	var currentMatch = {};

// Setup Methods

	var configureMatch = function(playerInfo, matchLength) {

		var dfd = $q.defer();

		var matchInfo = {

			matchLength: matchLength,
			playerInfo: playerInfo

		};

		socket.emit('new match', matchInfo, function(response) {

			if (response.matchObj) {

				console.log('New match created: ', response.matchObj);

				currentMatch = response.matchObj;

				dfd.resolve();

			} else {

				console.log('Error from configureMatch: ', response.error);

				dfd.reject();

			};

		});

		return dfd.promise;

	};

// Get Info Methods

	var getCurrentMatch = function() {

		return currentMatch;

	};

	var getMatchObj = function(matchId) {

		var dfd = q.defer();

		socket.emit('get match', { matchId: matchId }, function(response) {

			if(response.error) {

				console.log('Error coming from getMatchObj: ', response.error);

				dfd.reject(response.error);

			} else {

				console.log('Match object coming from getMatchObj: ', response.matchObj);

				dfd.resolve(response.matchObj);

			};


		});

		return dfd.promise;

	};

// Save Methods

	var updateMatch = function(gameObj, player1, player2, matchObj) {

		var updatedGame = {

			game: gameObj,
			player1: player1,
			player2: player2

		};

		matchObj.gamesArr[matchObj.gameNumber - 1] = updatedGame;

		var updatedMatch = matchObj;

		console.log('updateMatch is runnning with this match: ', updatedMatch);

		socket.emit('update match', updatedMatch, function(response) {

			if (response.error) {

				console.log('Error from updateMatch: ', response.error);

			} else {

				console.log('Match updated.');

			};

		});

	};

// Helper Methods

	var endGame = function(gameObj, matchObj) {

		dataUpdate(gameObj, matchObj);

		matchObj.gamesArr[gameObj.gameNumber - 1].game = gameObj;

		matchFinishCheck(matchObj);

	};

	var matchFinishCheck = function(matchObj) {

		if (matchObj.gameNumber === matchObj.matchLength) {

			determineWinner(matchObj);

			sendMatch(matchObj, function(response) {

				if (response.status === 500) {

					console.log('Something went wrong on the server. Refer to those logs. Maybe add a resend feature?');

					$location.path('/home');

				} else {

					$location.path('/finishedGames');

				};

			});

		} else {

			$location.path('/intermission');

		};

	};

	var determineWinner = function(matchObj) {

		if(matchObj.player1.wins > matchObj.player2.wins) {

			matchObj.winnerId = matchObj.player1.id;

		} else if(matchObj.player2.wins > matchObj.player1.wins) {

			matchObj.winnerId = matchObj.player2.id;

		};

	};

	var dataUpdate = function(gameObj, matchObj) {

		matchObj.gameNumber++;

		if (gameObj.winner.playerId === matchObj.player1.id) {

			matchObj.player1.wins++;

		} else if (gameObj.winner.playerId === matchObj.player2.id) {

			matchObj.player2.wins++;

		};

		pointDataUpdate(matchObj.player1, gameObj.player1);
		pointDataUpdate(matchObj.player2, gameObj.player2);

	};

	var pointDataUpdate = function(matchPlayer, gamePlayer) {

		matchPlayer.pointsServing += gamePlayer.pointsServing;
		matchPlayer.pointsReceiving += gamePlayer.pointsReceiving;
		matchPlayer.ptsDblFaulted += gamePlayer.ptsDblFaulted;

	};


// Exported Service Methods

	this.updateMatch = updateMatch;

	this.configureMatch = configureMatch;

	this.getMatchObj = getMatchObj;

	this.getCurrentMatch = getCurrentMatch;

	this.endGame = endGame;

});
