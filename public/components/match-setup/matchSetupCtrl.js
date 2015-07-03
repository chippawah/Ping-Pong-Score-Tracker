var app = angular.module('scoreKeep');

app.controller('matchSetupCtrl', function($scope, $location, matchService, playerService, primaryPlayer) {

	$scope.primaryPlayer = primaryPlayer;

	$scope.startMatch = function() {
		
		var playerInfo = {

			p1Id: $scope.primaryPlayer.id,
			p2Id: $scope.secondaryPlayer.id,
			
			p1Name: $scope.primaryPlayer.name,
			p2Name: $scope.secondaryPlayer.name

		};

		matchService.configureMatch(playerInfo, $scope.matchLength)

			.then(function(res) {

				$location.path('/game');

			});

	};

	$scope.matchLengthSet = function(length) {

		$scope.matchLength = length;

	};

	$scope.player2Lookup = function() {

		playerService.playerLookup($scope.secondaryPlayerEmail)

			.then(function(player) {

				$scope.secondaryPlayer = player;

			}, function(err) {

				console.log('No player found with that email found.');

			});

		$scope.secondaryPlayerEmail = null;

	}

});