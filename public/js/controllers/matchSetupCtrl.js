var app = angular.module('scoreKeep');

app.controller('matchSetupCtrl', function($scope, matchService, playerService, primaryPlayer) {

	$scope.primaryPlayer = primaryPlayer;

	$scope.submitMatch = function() {

		console.log('Primary player, ' + $scope.primaryPlayer.name + ' id: ' + $scope.primaryPlayer._id);
		console.log('Secondary player, ' + $scope.secondaryPlayer.name + ' id: ' + $scope.secondaryPlayer._id);

		//matchService.configureMatch($scope.primaryPlayer._id, $scope.secondaryPlayer._id, $scope.matchLength);

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