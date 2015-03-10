var app = angular.module('scoreKeep');

app.controller('intermissionCtrl', function($scope, $location, matchService, matchObj) {

	$scope.match = matchObj;

	$scope.playNext = function() {

		$location.path('/game');

	}

});