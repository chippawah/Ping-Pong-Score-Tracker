var app = angular.module('scoreKeep');

app.controller('intermissionCtrl', function($scope, $location, matchService, matchObj) {

	$scope.match = matchObj;

	$scope.games = matchObj.gamesArr.map(function(gameObj) {

		if (gameObj.game.totalScore > 0) {

			return gameObj

		};

	});

	console.log($scope.games);

	$scope.playNext = function() {

		$location.path('/game');

	}

});