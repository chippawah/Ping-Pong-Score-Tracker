var app = angular.module('scoreKeep');

app.controller('homePageCtrl', function($scope, $location){

	$scope.playNewGame = function() {

		$location.path('/game');

	};

	$scope.finishedGamePage = function() {

		$location.path('/finishedGames');
		
	}

});