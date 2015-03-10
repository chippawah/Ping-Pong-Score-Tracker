var app = angular.module('scoreKeep');

var socket = io.connect('http://localhost');

app.service('gameService', function($firebase, $q, $location, $http){

	this.createNewGame = function() {

		socket.emit('new game', gameObj);

	};

	this.getNewGame = function() {

		return gameObj;

	};

});