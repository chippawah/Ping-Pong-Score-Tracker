app = angular.module 'scoreKeep'
app.controller 'homePageCtrl', ($scope, $location, gameService) ->
	$scope.newMatch = () ->
		$location.path '/matchSetup'

	$scope.newGuestMatch = () ->
		$location.path '/game'

	$scope.finishedGamePage = () ->
		$location.path '/finishedGames'