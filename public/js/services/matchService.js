var app = angular.module('scoreKeep');

app.service('matchService', function($firebase, $location, $q, $http) {

// Variables

	var matchObj = {

		player1: {

			name: 'player1Name',
			email: 'player1Email',
			wins: 0,
			pointsReceiving: 0,
			pointsServing: 0,
			ptsDblFaulted: 0,

		},

		player2: {

			name: 'player2Name',
			email: 'player2Email',
			wins: 0,
			pointsReceiving: 0,
			pointsServing: 0,
			ptsDblFaulted: 0,

		},

		winnerEmail: 'winnerEmail',
		matchLength: 0,
		gameNumber: 1,

		gamesArr: []

	};

	var firebaseMatchId;

// Setup Methods

	var createNewMatch = function() {

		var matchArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches');
		var sync = $firebase(matchArrayRef).$asArray();

		var dfd = $q.defer();

		sync.$add(matchObj).then(function(obj){

			firebaseMatchId = obj.key();
			newMatchId = obj.key();

			dfd.resolve(firebaseMatchId);

		});

		return dfd.promise;

	};

	var configureMatch = function(playerInfo, matchLength, matchId) {

			var newMatchObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches/' + matchId);
			var newMatchObj = $firebase(newMatchObjRef).$asObject();

			newMatchObj.$loaded(function() {

				newMatchObj.player1.email = playerInfo.p1Email;
				newMatchObj.player2.email = playerInfo.p2Email;

				newMatchObj.player1.name = playerInfo.p1Name;
				newMatchObj.player2.name = playerInfo.p2Name;

				newMatchObj.matchLength = matchLength;

				newMatchObj.$save();

				$location.path('/game');

			});

	};

// Get Info Methods

	var getMatchId = function() {

		return firebaseMatchId;

	}

	var getMatchObj = function(matchId) {

		var firebaseMatchObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches/' + matchId);

		var firebaseMatchObj = $firebase(firebaseMatchObjRef).$asObject();

		console.log('Match object coming from getMatchObj(): ', firebaseMatchObj);

		return firebaseMatchObj;

	};

// Save Methods

	var addGame = function(gameObj, matchId) {

		var dfd = $q.defer();

		var currentMatchRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches/' + matchId);

		var currentMatch = $firebase(currentMatchRef).$asObject();

		currentMatch.$loaded(function() {

			currentMatch.gameNumber++;

			if(!currentMatch.gamesArr) {

				currentMatch.gamesArr = [];

			};
			
			currentMatch.gamesArr.push(gameObj);

			dataUpdate(currentMatch, gameObj);

			matchFinishCheck(currentMatch, dfd);

		});

		return dfd.promise;

	};

	var sendMatch = function(matchObj) {

		console.log('sendMatch is runnning...');

		console.log(matchObj);

		matchObj.createdAt = Date.now();

		var dfd = $q.defer();
				
		$http({

			url: '/api/saveMatch',
			method: 'POST',
			data: matchObj

		})

			.then(function(matchJSON) {

				console.log('sendMatch promise should resolve with the json for the match.', matchJSON);

				dfd.resolve(matchJSON);

			}, function(err) {

				console.log(err);

				dfd.reject(err);

			}); 

		return dfd.promise;

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

	this.addGame = addGame;

	this.configureMatch = configureMatch;

	this.getMatchObj = getMatchObj;

	this.getMatchId = getMatchId

});
