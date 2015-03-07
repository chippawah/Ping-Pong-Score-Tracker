var app = angular.module('scoreKeep', ['ngRoute', 'firebase']);

app.config(function($routeProvider){

	$routeProvider

		.when('/home', {

			templateUrl: 'templates/home-page-tmpl.html',
			controller: 'homePageCtrl'

		})

		.when('/game', {

			templateUrl: 'templates/main-game-page-tmpl.html',
			controller: 'mainGamePageCtrl',
			resolve: {

				gameId: function(gameService) {

					 return gameService.createNewGame();

				}, 

				matchId: function(matchService) {

					 return matchService.getMatchId();

				}



			}

		})

		.when('/intermission', {

			templateUrl:'templates/intermission-page-tmpl.html',
			controller: 'intermissionCtrl',
			resolve: {

				matchId: function(matchService) {

					 return matchService.getMatchId();

				}

			}

		})

		.when('/matchSetup', {

			templateUrl: 'templates/match-setup-tmpl.html',
			controller: 'matchSetupCtrl',
			resolve: {

				primaryPlayer: function(playerService) {

					return playerService.getAuthedPlayer();

				}, 

				newMatchId: function(matchService) {

					 return matchService.createNewMatch();

				}

			}

		})

		.when('/register', {

			templateUrl: 'templates/register-tmpl.html',
			controller: 'registerCtrl'

		})

		.when('/finishedMatches', {

			templateUrl: 'templates/finished-match-page-tmpl.html',
			controller: 'finishedMatchCtrl',
			resolve: {

				finishedMatchesArr: function(finishedMatchService) {

					return finishedMatchService.getFinishedMatches();
					
				}

			}

		})

		.otherwise({

			redirectTo: '/home'

		})

});