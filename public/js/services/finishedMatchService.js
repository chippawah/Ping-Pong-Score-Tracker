var app = angular.module('scoreKeep');

app.service('finishedMatchService', function($firebase, $location, $q, $http) {

	var firebaseUrl = 'https://ping-pong-scorekeep.firebaseio.com/finishedGames';

	this.getFinishedMatches = function() {

		var dfd = $q.defer();

		var matchArrayRef = new Firebase('https://ping-pong-scorekeep.firebaseio.com/matches');
		var matchesArr = $firebase(matchArrayRef).$asArray().$loaded()

			.then(function(matchesArr) {

				dfd.resolve(matchesArr);

			}, function(err) {

				dfd.reject(err);

			});



	};

});