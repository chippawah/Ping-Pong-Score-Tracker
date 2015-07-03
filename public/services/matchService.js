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

		currentMatch = matchObj;

		socket.emit('update match', currentMatch, function(response) {

			if (response.error) {

				console.log('Error from updateMatch: ', response.error);

			} else {

				console.log('Match updated.');

			};

		});

	};

// Helper Methods

	var endGame = function(gameObj, matchObj) {

		debugger;

		currentMatch = dataUpdate(gameObj, matchObj);

		matchFinishCheck(currentMatch);

	};

	var matchFinishCheck = function(matchObj) {

		if (matchObj.gameNumber - 1 === matchObj.matchLength) {

			determineWinner(matchObj);

			socket.emit('finshed match', matchObj, function(response) {

				if (response.error) {

					console.log('Error from saving finished: ', response.error);

					$location.path('/home');

				} else {

					$location.path('/finishedMatches');

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

		var player1,
			player2;

		matchObj.gamesArr[matchObj.gameNumber - 1].game = gameObj;

		matchObj.gameNumber++;

		if (gameObj.winner.playerId === matchObj.player1.id) {

			matchObj.player1.wins++;

			player1 = gameObj.winner;
			player2 = gameObj.loser;

		} else if (gameObj.winner.playerId === matchObj.player2.id) {

			matchObj.player2.wins++;

			player2 = gameObj.winner;
			player1 = gameObj.loser;

		};

		matchObj.player1 = pointDataUpdate(matchObj.player1, player1);
		matchObj.player2 = pointDataUpdate(matchObj.player2, player2);

		return matchObj;

	};

	var pointDataUpdate = function(matchPlayer, gamePlayer) {


		matchPlayer.pointsServing = 0;
		matchPlayer.pointsReceiving = 0;
		matchPlayer.ptsDblFaulted = 0;

		matchPlayer.pointsServing += gamePlayer.pointsServing;
		matchPlayer.pointsReceiving += gamePlayer.pointsReceiving;
		matchPlayer.ptsDblFaulted += gamePlayer.ptsDblFaulted;

		return matchPlayer;

	};



// Exported Service Methods

	this.updateMatch = updateMatch;

	this.configureMatch = configureMatch;

	this.getMatchObj = getMatchObj;

	this.getCurrentMatch = getCurrentMatch;

	this.endGame = endGame;

});
