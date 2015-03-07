var app = angular.module('scoreKeep');

app.controller('finishedGamePageCtrl', function($scope, finishedGameDataService, matchesArr){

	$scope.finishedMatchesArray = matchesArr;

	console.log($scope.finishedMatchesArr);

});