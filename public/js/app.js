var app = angular.module('scoreKeep', ['ngRoute', 'firebase']);

app.config(function($routeProvider){

	$routeProvider

		.when('/game', {

			templateUrl: 'templates/main-game-page-tmpl.html',
			controller: 'mainGamePageCtrl',
			resolve: {

				gameId: function(gameDataService) {

					 return gameDataService.createNewGame();

				}

			}

		})

		.when('/home', {

			templateUrl: 'templates/home-page-tmpl.html',
			controller: 'homePageCtrl'

		})

		.when('/matchSetup', {

			templateUrl: 'templates/match-setup-tmpl.html',
			controller: 'matchSetupCtrl',
			resolve: {

				primaryPlayer: function(playerService) {

					return playerService.getAuthedPlayer();

				}

			}

		})

		.when('/register', {

			templateUrl: 'templates/register-tmpl.html',
			controller: 'registerCtrl'

		})

		.when('/finishedGames', {

			templateUrl: 'templates/finished-game-page-tmpl.html',
			controller: 'finishedGamePageCtrl',
			resolve: {

				finishedGamesArr: function(finishedGameDataService) {

					return finishedGameDataService.getGames();
					
				}

			}

		})

		.otherwise({

			redirectTo: '/home'

		})

});