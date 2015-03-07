var app = angular.module('scoreKeep');

app.service('gameService', function($firebase, $q, $location, $http){

	var gamesArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/games');

	var sync = $firebase(gamesArrayRef).$asArray();

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
			email: null,
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
			email: null,
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

	this.createNewGame = function() {

		var dfd = $q.defer();

		sync.$add(gameObj).then(function(obj){

			firebaseGameId = obj.key();

			console.log('New game added with firebase reference of: ' + firebaseGameId);

			dfd.resolve(firebaseGameId);

		});

		return dfd.promise;

	};

	this.getNewGame = function() {

		return gameObj;

	};

	this.getGameObj = function(gameId) {

		var gameObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/games/' + gameId + '/game');

		var gameObj = $firebase(gameObjRef).$asObject();

		return gameObj;

	};

});