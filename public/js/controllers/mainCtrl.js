var app = angular.module('scoreKeep');

app.controller('mainCtrl', function($scope, $location, playerService){

	$scope.pathSelect = function(path){

		$location.path(path);
	};

	$scope.login = function() {

		playerService.loginPlayer($scope.email, $scope.password)

			.then(function(response) {

				$scope.user = response.data;

				console.log($scope.user);

				$scope.email = null;
				$scope.password = null;

			}, function(err) {

				console.log(err);

			});

	};



});