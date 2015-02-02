var app = angular.module('scoreKeep');

app.controller('mainGamePageCtrl', function($scope, $rootScope, $location){

	$scope.player1 = {

		name: $rootScope.playerNames.player1Name,
		score: 0,
		faults: 0,
		serving: true,
		pointsReceiving: 0,
		pointsServing: 0,
		ptsDblFaulted: 0,
		showPointData: false,
		playerId: 'p1',
		leading: false

	};

	$scope.player2 = {

		name: $rootScope.playerNames.player2Name,
		score: 0,
		faults: 0,
		serving: false,
		pointsReceiving: 0,
		pointsServing: 0,
		ptsDblFaulted: 0,
		showPointData: false,
		playerId: 'p2',
		leading: false

	};

	$scope.game = {

		totalScore: 0,
		serveCounter: 0,
		gamePoint: false,
		tied: true,
		finalServe: false,
		showSwitchAlert: false,
		showFaultAlert: false,

	};


	$scope.serveCountHandler = function() {

		$scope.game.serveCounter++;

		var mode = $scope.gameModeCheck();

		var server = $scope.ServerCheck('server');

		var receiver = $scope.ServerCheck('receiver');

		switch (mode) {

			case 'normal':

				if($scope.game.serveCounter === 4) {

					$scope.game.finalServe = true;

				};

				if($scope.game.serveCounter === 5) {

					server.serving = false;

					receiver.serving = true;

					$scope.game.serveCounter = 0;

					$scope.game.finalServe = false;

					$scope.game.showSwitchAlert = true;

				};

				break;				

			case 'comeBack':

				var winning = $scope.leaderCheck('winning');

				var losing = $scope.leaderCheck('losing');

				if(winning.serving) {

					winning.serving = false;

					losing.serving = true;

					$scope.game.showSwitchAlert = true;

				};

				break;

			case 'endGame':

				debugger;

				$scope.gameFinishCheck();

				if($scope.game.serveCounter === 1) {

					$scope.game.finalServe = true;

				};

				if($scope.game.serveCounter === 2) {

					server.serving = false;

					receiver.serving = true;

					$scope.game.serveCounter = 0;

					$scope.game.finalServe = false;

					$scope.game.showSwitchAlert = true;

				}

		};

			//debugger;

			// $scope.game.finalServe = false;

			// $scope.game.serveCounter = 0;

			

			//var scoreDiff = winning.score - losing.score;

			

			// if(scoreDiff === 0) {

			// 	$scope.game.finalServe = true;

			// }

	};

	$scope.gameModeCheck = function() {

		var p1Score = $scope.player1.score;

		var p2Score = $scope.player2.score;

		if(p1Score < 20 && p2Score < 20) {

			//console.log('normal mode engaged');

			return 'normal';

		};

		if(((p1Score === 20 && p2Score < 20) || (p2Score === 20 && p1Score < 20)) || ((p1Score === 21 && p2Score === 20) || (p1Score === 20 && p2Score === 21))) {

			//console.log('comeBack mode engaged');

			return 'comeBack';

		};

		if(p1Score === 20 && p2Score === 20) {

			$scope.game.serveCounter = 0;

			return 'endGame';

		};

		if(p1Score >= 20 && p2Score >= 20) {

			return 'endGame';

		};

	};

	$scope.leaderCheck = function(userState) {

		var winning;

		var losing;

		if($scope.player1.score > $scope.player2.score) {

			winning = $scope.player1;

			losing = $scope.player2;

			$scope.game.tied = false;

			$scope.player1.leading = true;

			$scope.player2.leading = false;

		};

		if ($scope.player2.score > $scope.player1.score) {

			winning = $scope.player2;

			losing = $scope.player1;

			$scope.game.tied = false;

			$scope.player2.leading = true;

			$scope.player1.leading = false;

		};

		if ($scope.player1.score === $scope.player2.score) {

			$scope.game.tied = true;

			$scope.player1.leading = false;

			$scope.player2.leading = false;

		};

		switch (userState) {

			case 'winning': 

				return winning;

			case 'losing':

				return losing;

		};

	};

	$scope.ServerCheck = function(player) {

		var server;

		var receiver;

		if($scope.player1.serving){

			server = $scope.player1;

			receiver = $scope.player2;
			
		}

		if($scope.player2.serving){

			server = $scope.player2;

			receiver = $scope.player1;

		};

		if(player === 'server') {

			return server;

		};

		if(player === 'receiver') {

			return receiver;

		}
		
	};

	$scope.pointDataUpdater = function(player) {

		var server = $scope.ServerCheck('server');

		var receiver = $scope.ServerCheck('receiver');

		if(player.playerId === server.playerId) {

			server.pointsServing++;

		};

		if(player.playerId === receiver.playerId) {

			receiver.pointsReceiving++

		};

		server.faults = 0;

	};

	$scope.point = function(player) {

		//debugger;

		player.score++;

		$scope.game.totalScore++;

		$scope.game.showFaultAlert = false;

		$scope.game.showSwitchAlert = false;

		$scope.game.finalServe = false;	

		$scope.leaderCheck();	

		$scope.pointDataUpdater(player);

		$scope.serveCountHandler();

	};

	$scope.fault = function() {

		var server = $scope.ServerCheck('server');

		var receiver = $scope.ServerCheck('receiver');

		gameMode = $scope.gameModeCheck();

		switch (gameMode) {

			case 'normal':
			case 'endGame':

				if(server.faults === 0) {

					server.faults++

				} else {

					$scope.game.showFaultAlert = true;

					server.ptsDblFaulted++;

					$scope.point(receiver);

				};

				break;

			case 'comeBack':

				server.faults = 0;

				break;

		};


	};

	$scope.togglePointData = function(player) {

		player.showPointData = !player.showPointData;

	};

	$scope.closeAlert = function(alert) {

		if(alert === 'fault') {

			$scope.game.showFaultAlert = false;

		};

		if(alert === 'switch') {

			$scope.game.showSwitchAlert = false;

		};

	};

	$scope.gameFinishCheck = function() {

		var p1Score = $scope.player1.score;

		var p2Score = $scope.player2.score;

		if(!$scope.game.tied) {

			var winning = $scope.leaderCheck('winning');

			var losing = $scope.leaderCheck('losing');

			var scoreDiff = winning.score - losing.score;

			if(scoreDiff > 1 && winning.score >= 21) {

				alert(winning.name + ' has won the game. The page will now reload...');

				window.location.reload(true);
			}

		};

	};

});