var app = angular.module('scoreKeep');

app.controller('finishedGamePageCtrl', function($scope, finishedGamesArr, finishedGameDataService){

	$scope.finishedGamesArray = finishedGamesArr;

	console.log($scope.finishedGamesArray);

});