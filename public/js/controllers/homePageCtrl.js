var app = angular.module('scoreKeep');

app.controller('homePageCtrl', function($scope, $location){

	$scope.newMatch = function() {

		$location.path('/matchSetup');

	};

	$scope.newGuestMatch = function() {

		$location.path('/game');

	};

	$scope.finishedGamePage = function() {

		$location.path('/finishedGames');
		
	};

});