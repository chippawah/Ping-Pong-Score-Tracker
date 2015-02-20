var app = angular.module('scoreKeep');

app.service('finishedGameDataService', function($firebase, $location) {

	var firebaseUrl = 'https://ping-pong-scorekeep.firebaseio.com/finishedGames';

	this.getGames = function() {

		var gamesArrRef = new Firebase(firebaseUrl);

		var gamesArr = $firebase(gamesArrRef).$asArray();

		return gamesArr

	};

});