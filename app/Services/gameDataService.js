var app = angular.module('scoreKeep');

app.service('gameDataService', function($firebase, $q, $location){

	var gameArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/games');

	var sync = $firebase(gameArrayRef).$asArray();

	var finishedGameObj = {};

	var gameObj = {

		game: {

			totalScore: 0,
			serveCounter: 0,
			gamePoint: false,
			tied: true,
			finalServe: false,
			showSwitchAlert: false,
			showFaultAlert: false,
			lastFivePoints : ['playerId'],
			streakCount: {

				p1Streak: 0,
				p2Streak: 0,

			},
			lastPoint: 'player',
			winner: 'player',
			loser: 'player'

		},

		player1: {

			name: 'Player 1',
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

			name: 'Player 2',
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

		},	

	};

	var finishedGameObj = {};

	this.createNewGame = function() {

		var dfd = $q.defer();

		sync.$add(gameObj).then(function(obj){

			firebaseGameId = obj.key();

			console.log('New game added with firebase reference of: ' + firebaseGameId);
			dfd.resolve(firebaseGameId);

		});

		return dfd.promise;

	};

	this.getNewGameData = function() {

		return gameObj;

	};

	this.saveGameData = function(p1Obj, p2Obj, game) {

		var indexForGame = sync.keyAt(firebaseGameId);

		sync[indexForGame].player1 = p1Obj;

		sync[indexForGame].player2 = p2Obj;

		sync[indexForGame].game = game;

		sync.$save(indexForGame).then(function(obj) {

			console.log('Game at position ' + indexForGame + ' has been saved.');

		});

	}

	this.saveFinishedGame = function(p1Obj, p2Obj, game) {

		debugger;

		var dateObj = new Date();

		var gameDate = {

			day: dateObj.getDate(),
			month: dateObj.getMonth()
			
		};

		finishedGameObj = {

			player1: p1Obj,
			player2: p2Obj,
			game: game,
			createdAt: gameDate

		};

	};

	this.sendFinishedGame = function() {

		var postGamesArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/finishedGames');

		var postGamesArrayObj = $firebase(postGamesArrayRef).$asArray();

		var dfd = $q.defer();

		postGamesArrayObj.$add(finishedGameObj)

			.then(function(obj){

				var objId = obj.key();

				console.log('Finished Game Object created with ID: ' + objId);

				alert(finishedGameObj.game.winner.name + ' has won the game.');

				dfd.resolve(objId);

			}, function(err) {

				console.log(err);

			});

		return dfd.promise;

	};

	this.getPlayerData = function(player, gameId) {

		var playerObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/games/' + gameId + '/' + player);

		var playerObj = $firebase(playerObjRef).$asObject();

		return playerObj;	

	};

	this.getGameObj = function(gameId) {

		var gameObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/games/' + gameId + '/game');

		var gameObj = $firebase(gameObjRef).$asObject();

		return gameObj;

	};

});