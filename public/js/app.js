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

				matchObj: function(matchService) {

					return matchService.getCurrentMatch();

				}

			}

		})

		.when('/intermission', {

			templateUrl:'templates/intermission-page-tmpl.html',
			controller: 'intermissionCtrl',
			resolve: {

				matchObj: function(matchService) {

					return matchService.getCurrentMatch();

				}

			}

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