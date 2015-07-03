var app = angular.module('scoreKeep');

app.service('playerService', function($location, $q, $http){

	this.getAuthedPlayer = function() {

		var dfd = $q.defer();

		$http({

			method: 'GET',
			url: '/api/getPrimaryUser'

		})

			.then(function(response) {

				dfd.resolve(response.data);

			}, function(err) {

				dfd.reject(err);

			});

		return dfd.promise;		

	};

	this.loginPlayer = function(email, password) {
		
		var dfd = $q.defer();

		$http({

			method: 'POST',
			url: '/api/playerLogin',
			data: {

				email: email,
				password: password

			}


		})

			.then(function(response) {

				console.log('The following user is logged in ' + response.data.name);

				dfd.resolve(response);

			}, function(err) {

				dfd.reject(err);

			});

		return dfd.promise;

	};

	this.playerLookup = function(email) {

		var dfd = $q.defer();

		socket.emit('find player', email, function(response) {

			if (response.error) {

				console.log('Error from playerLookup: ', response.error);

				dfd.reject(response.error);

			} else {

				console.log('Player found: ', response.player);

				dfd.resolve(response.player);

			};

		});

		return dfd.promise;


	};

	this.saveNewPlayer = function(player) {

		socket.emit('new player', player, function(response) {

			if (response.error) {

				console.log('Error from saveNewPlayer: ', response.error);

			} else {

				console.log('New player saved with ID: ', response.playerId);

			};

		});

	}
	
});