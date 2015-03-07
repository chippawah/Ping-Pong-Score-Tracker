var app = angular.module('scoreKeep');

app.controller('intermissionCtrl', function($scope, $location, matchService, matchId) {

	console.log(matchId);

	var matchObj = matchService.getMatchObj(matchId);
	matchObj.$bindTo($scope, 'match').then(function() {

		$scope.gamesArr = gameArrFormatter($scope.match.gamesArr);

		console.log($scope.gamesArr);

	});

	$scope.playNext = function() {

		$location.path('/game');

	}

});

var gameArrFormatter = function(arr) {

	for (var i = 0; i < arr.length; i++) {

		arr[i].number = i + 1;

	};

	return arr;

};