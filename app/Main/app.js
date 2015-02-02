var app = angular.module('scoreKeep', ['ngRoute', 'firebase']);

app.config(function($routeProvider){

	$routeProvider

		.when('/game', {

			templateUrl: 'templates/main-game-page/main-game-page-tmpl.html',
			controller: 'mainGamePageCtrl'

		})

		.when('/home',{

			templateUrl: 'templates/home-page/home-page-tmpl.html',
			controller: 'homePageCtrl'

		})

		.otherwise({

			redirectTo: '/home'

		})

});

app.run(function($rootScope, $location, playerService){

	$rootScope.$on('$routeChangeStart', function(event, next, current) {

		if(playerService.getPlayerNames()) {

			$location.path('/game');

		} else {

			$location.path('/home');

		};

	});

});