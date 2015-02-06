var app = angular.module('scoreKeep', ['ngRoute', 'firebase']);

app.config(function($routeProvider){

	$routeProvider

		.when('/game', {

			templateUrl: 'templates/main-game-page/main-game-page-tmpl.html',
			controller: 'mainGamePageCtrl',
			resolve: {

				gameId: function(gameDataService) {

					 return gameDataService.createNewGame();

				}

			}

		})

		.when('/home', {

			templateUrl: 'templates/home-page/home-page-tmpl.html',
			controller: 'homePageCtrl'

		})

		.when('/finishedGames', {

			templateUrl: 'templates/finished-games-page/finished-game-page-tmpl.html',
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