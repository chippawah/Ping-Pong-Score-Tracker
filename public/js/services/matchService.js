var app = angular.module('scoreKeep');

app.service('matchService', function($firebase, $location, $q) {

	var matchArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches');

	var sync = $firebase(matchArrayRef).$asArray();

	var matchObj = {
		
		player1Name: null,
		player1Email: null,
		player1Wins: 0,

		player2Email: null,
		player2Name: null,
		player2Wins: 0,

		matchWinnerEmail: null,
		matchLength: 0,

		gamesArr: []

	};

	this.createNewMatch = function() {

		var dfd = $q.defer();

		sync.$add(matchObj).then(function(obj){

			firebaseMatchId = obj.key();

			console.log('New match added with firebase reference of: ' + firebaseMatchId);

			dfd.resolve(firebaseMatchId);

		});

		return dfd.promise;

	};

	this.addGame = function(gameObj) {

		matchObj.gamesArr.push(gameObj);

		if (gameObj.winner.email === player1Email) {

			player1Wins++;

		} else if (gameObj.winner.email === player2Email) {

			player2Wins++;

		};

		if (matchObj.gamesArr.length === matchObj.matchLength) {

			var dfd = $q.defer();
		
			$http({

				url: '/api/saveMatch',
				method: 'POST',
				data: matchObj

			})
				.then(function(res) {

					dfd.resolve(res);

				}); 

			return dfd.promise;

		};

	};

	this.configureMatch = function(playerInfo, matchLength) {

		matchObj.player1Email = playerInfo.p1Email;
		matchObj.player2Email = playerInfo.p2Email;

		matchObj.player1Name = playerInfo.p1Name;
		matchObj.player2Name = playerInfo.p2Name;

		matchObj.matchLength = matchLength;

		$location.path('/game');

	};

	this.getMatchObj = function(matchId) {

		var matchObjRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches/' + matchId);

		var matchObj = $firebase(matchObjRef).$asObject();

		return matchObj;

	};

});