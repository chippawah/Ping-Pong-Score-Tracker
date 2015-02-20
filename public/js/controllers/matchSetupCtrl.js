var app = angular.module('scoreKeep');

app.controller('matchSetupCtrl', function($scope, matchService, playerService, primaryPlayer) {

	$scope.primaryPlayer = primaryPlayer;

	$scope.startMatch = function() {

		var playerInfo = {

			p1Email: $scope.primaryPlayer.email,
			p2Email: $scope.secondaryPlayer.email,

			p1Name: $scope.primaryPlayer.name,
			p2Name: $scope.secondaryPlayer.name

		}

		matchService.configureMatch(playerInfo, $scope.matchLength);

	};

	$scope.matchLengthSet = function(length) {

		$scope.matchLength = length;

	};

	$scope.login = function() {

		playerService.loginPlayer($scope.email, $scope.password)

			.then(function(player) {

				$scope.player1Id = player._id;
				$scope.player1Name = player.name;

			}, function(err) {

				console.log(err);

			});

		$scope.email = null;
		$scope.password = null;

	};

	$scope.player2Lookup = function() {

		playerService.playerLookup($scope.secondaryPlayerEmail)

			.then(function(player) {

				$scope.secondaryPlayer = player;

				console.log('P2 name: ' + $scope.secondaryPlayer.name);

			}, function(err) {

				console.log(err);

			});

		$scope.secondaryPlayerEmail = null;

	}

});