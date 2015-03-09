var app = angular.module('scoreKeep');

app.controller('mainCtrl', function($scope, $location, playerService){

	var socket = io.connect('http://localhost:80');

		socket.on('connect', function(){

			console.log('Connected!');
		
		});

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