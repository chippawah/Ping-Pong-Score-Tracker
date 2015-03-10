var app = angular.module('scoreKeep');

var socket = io.connect('http://localhost');

app.service('gameService', function($firebase, $q, $location, $http){

	var endGame = function(finishedGameObj) {

		console.log('Game ended');

	}

});