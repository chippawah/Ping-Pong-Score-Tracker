var app = angular.module('scoreKeep', ['ngRoute']);

app.config(function($routeProvider){

	$routeProvider
		.when('/home', {
			templateUrl: 'components/home/home.html',
			controller: 'homePageCtrl'
		})
		.when('/game', {
			templateUrl: 'components/main-game/main-game.html',
			controller: 'mainGamePageCtrl',
			resolve: {
				matchObj: function(matchService) {
					return matchService.getCurrentMatch();
				}
			}
		})
		.when('/intermission', {
			templateUrl:'components/intermission/intermission.html',
			controller: 'intermissionCtrl',
			resolve: {
				matchObj: function(matchService) {
					return matchService.getCurrentMatch();
				}
			}
		})
		.when('/matchSetup', {
			templateUrl: 'components/match-setup/match-setup.html',
			controller: 'matchSetupCtrl',
			resolve: {
				primaryPlayer: function(playerService) {
					return playerService.getAuthedPlayer();
				}
			}
		})
		.when('/register', {
			templateUrl: 'components/register/register.html',
			controller: 'registerCtrl'
		})
		.when('/finishedMatches', {
			templateUrl: 'components/finished-match/finished-match.html',
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