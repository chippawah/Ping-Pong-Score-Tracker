var app = angular.module('scoreKeep');

var socket = io.connect('http://localhost:80');

app.service('matchService', function($firebase, $location, $q, $http) {

// Variables

	var currentMatchId;	

	var matchObj = {};

// Setup Methods

	var configureMatch = function(playerInfo, matchLength) {

		var matchObj = {

			player1: {

				name: playerInfo.p1Name,
				email: playerInfo.p1Email,
				wins: 0

			},

			player2: {

				name: playerInfo.p2Name,
				email: playerInfo.p2Email,
				wins: 0

			},

			winnerEmail: 'winnerEmail',
			matchLength: matchLength,
			gameNumber: 1,

			gamesArr: []

		};

		matchObj = gameService.addGames(matchObj, matchLength);

		createNewMatch(matchObj)

			.then(function(id) {

				console.log('New match created with ID: ', id);
				
				$location.path('/game');

			}, function(err) {

				console.log('Error from createNewMatch: ', err);

			});

	};

	var createNewMatch = function(matchObj) {
		
		var dfd = q.defer();

		socket.emit('new match', matchObj, function(id) {

			if (response.matchId) {

				console.log('ID from saveMatch: ', response.matchId);

				currentMatchId = response.matchId;

				dfd.resolve(response.matchId);

			} else {

				console.log('Error from saveMatch: ', response.error);

				dfd.reject(response.error);

			};

		});

		return dfd.promise;

	};

// Get Info Methods

	var getCurrentMatch = function() {

		var dfd = q.defer();

		getMatchObj(currentMatchId).then(function(matchObj) {

			dfd.resolve(matchObj);

		}, function(err) {

			dfd.reject(err);

		});

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

	var sendMatch = function(matchObj) {

		console.log('sendMatch is runnning with this match: ', matchObj);

		matchObj.createdAt = Date.now();

		socket.emit('save match', matchObj);

	};

	var updateMatch = function(matchObj) {

		console.log('updateMatch is runnning with this match: ', matchObj);

		matchObj.updatedAt = Date.now();

		socket.emit('update match', matchObj);

	};

// Helper Methods

	var determineWinner = function(matchObj) {

		if(matchObj.player1.wins > matchObj.player2.wins) {

			matchObj.winnerEmail = matchObj.player1.email;

		} else if(matchObj.player2.wins > matchObj.player1.wins) {

			matchObj.winnerEmail = matchObj.player2.email;

		};

	};

	var dataUpdate = function(matchObj, gameObj) {

		if (gameObj.winner.name === matchObj.player1.name) {

			matchObj.player1.wins++;
			gameObj.player1 = gameObj.winner;
			gameObj.player2 = gameObj.loser;

		} else if (gameObj.winner.name === matchObj.player2.name) {

			matchObj.player2.wins++;
			gameObj.player2 = gameObj.winner;
			gameObj.player1 = gameObj.loser;

		};

		pointDataUpdate(matchObj.player1, gameObj.player1);
		pointDataUpdate(matchObj.player2, gameObj.player2);

		matchObj.$save();

	};

	var pointDataUpdate = function(matchPlayer, gamePlayer) {

		matchPlayer.pointsServing += gamePlayer.pointsServing;
		matchPlayer.pointsReceiving += gamePlayer.pointsReceiving;
		matchPlayer.ptsDblFaulted += gamePlayer.ptsDblFaulted;

	};

	var matchFinishCheck = function(matchObj, promiseObj) {

		if (matchObj.gamesArr.length === matchObj.matchLength) {

			determineWinner(matchObj);

			sendMatch(matchObj)

				.then(function(res) {

					console.log('Match saved: ' + res);

					promiseObj.resolve(function() {

						$location.path('/finishedMatches');

					});

				}, function(err) {

					console.log(err);

					promiseObj.reject(err);

				});

		} else {

			promiseObj.resolve(function() {

				$location.path('/intermission');

			});

		};

	};

// Exported Service Methods

	this.createNewMatch = createNewMatch;

	this.updateMatch = updateMatch;

	this.configureMatch = configureMatch;

	this.getMatchObj = getMatchObj;

	this.getMatchId = getMatchId

});
