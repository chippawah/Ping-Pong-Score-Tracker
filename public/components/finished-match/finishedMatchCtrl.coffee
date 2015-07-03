app = angular.module 'scoreKeep'
app.controller 'finishedGamePageCtrl', ($scope, finsishedGameDataService, matchesArr) ->
	$scope.finsihedMatchesArray = matchesArr
	console.log $scope.finishedMatchesArr