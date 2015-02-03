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
		leading: false,
		streaking: false

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
		leading: false,
		streaking: false

	};

	$scope.game = {

		totalScore: 0,
		serveCounter: 0,
		gamePoint: false,
		tied: true,
		finalServe: false,
		showSwitchAlert: false,
		showFaultAlert: false,
		lastFivePoints : [],
		streakCount: {

			p1Streak: 0,
			p2Streak: 0,

		},
		lastPoint: undefined

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

	};

	$scope.gameModeCheck = function() {

		var p1Score = $scope.player1.score;

		var p2Score = $scope.player2.score;

		if(p1Score < 20 && p2Score < 20) {

			//console.log('normal mode engaged');

			return 'normal';

		};

		if((p1Score === 20 && p2Score < 20) || (p2Score === 20 && p1Score < 20)) {

			// console.log('gameFinishCheck running');	

			// $scope.gameFinishCheck();

			return 'comeBack';

		};

		if((p1Score === 21 && p2Score === 20) || (p1Score === 20 && p2Score === 21)) {

			// console.log('gameFinishCheck running');

			// $scope.gameFinishCheck();

			return 'comeBack';
		}

		if(p1Score === 20 && p2Score === 20) {

			// console.log('gameFinishCheck running');

			$scope.game.serveCounter = 0;

			// $scope.gameFinishCheck();

			return 'endGame';

		};

		if(p1Score >= 20 && p2Score >= 20) {

			// console.log('gameFinishCheck running');

			// $scope.gameFinishCheck();

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

		$scope.game.lastPoint = player;

		player.score++;

		$scope.game.totalScore++;

		$scope.game.showFaultAlert = false;

		$scope.game.showSwitchAlert = false;

		$scope.game.finalServe = false;

		$scope.leaderCheck();

		$scope.pointStreakUpdater(player);

		$scope.gameFinishCheck();	

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

		if((p1Score >= 21 && $scope.player1.leading === true) || (p2Score >= 21 && $scope.player2.leading === true)) {

			debugger;

			var winning = $scope.leaderCheck('winning');

			var losing = $scope.leaderCheck('losing');

			var scoreDiff = winning.score - losing.score;

			if(scoreDiff > 1 && winning.score >= 21) {

				alert(winning.name + ' has won the game. The page will now reload...');

				window.location.reload(true);
			}

		};

	};

	$scope.undoLastPoint = function() {

		debugger;

		var player = $scope.game.lastPoint;

		$scope.undoScoreUpdate(player);

		$scope.undoPointStreakUpdate(player);

		$scope.undoPointDataUpdate(player);

		$scope.leaderCheck();

	};

	$scope.undoPointStreakUpdate = function(player){

		var streakArr = $scope.game.lastFivePoints;

			switch (player.playerId) {

				case 'p1':

					$scope.player1.streaking = false;

					$scope.game.streakCount.p1Streak--;

					break;

				case 'p2':

					$scope.player2.streaking = false;

					$scope.game.streakCount.p1Streak--;					

					break;

			};
		
		streakArr.shift();

	};

	$scope.undoPointDataUpdate = function(player) {

		var server = $scope.ServerCheck('server');

		var receiver = $scope.ServerCheck('receiver');

		if($scope.game.serveCounter === 0) {

			server.serving = false;

			receiver.serving = true;

			$scope.game.serveCounter = 4;

			$scope.game.finalServe = true;

			$scope.game.showSwitchAlert = false;			

		} else {

			$scope.game.serveCounter--;

			if(player.playerId === server.playerId) {

				server.pointsServing--;

			};

			if(player.playerId === receiver.playerId) {

				receiver.pointsReceiving--

			};

		};

	};

	$scope.pointStreakUpdater = function(player) {

		//debugger;

		var streakArr = $scope.game.lastFivePoints;

		if(streakArr.length === 6) {

			streakArr.pop();

		};

		streakArr.unshift(player.playerId);

		var p1Points = 0;

		var p2Points = 0;

		for (var i = 0; i < 5; i++) {
			
			if(streakArr[i] === 'p1') {

				p1Points++;

			};

			if(streakArr[i] === 'p2') {

				p2Points++;

			};


		};

		$scope.game.streakCount = {

			p1Streak: p1Points,
			p2Streak: p2Points

		};

		if(streakArr[0] === streakArr[1]) {

			switch (streakArr[0]) {

				case 'p1':

					$scope.player1.streaking = true;

					$scope.player2.streaking = false;

					break;

				case 'p2':

					$scope.player2.streaking = true;

					$scope.player1.streaking = false;

					break;

			};

		} else {

			$scope.player2.streaking = false;

			$scope.player1.streaking = false;

		};

		if(streakArr.length === 1) {

			switch (streakArr[0]) {

				case 'p1':

					$scope.player1.streaking = true;

					$scope.player2.streaking = false;

					break;

				case 'p2':

					$scope.player2.streaking = true;

					$scope.player1.streaking = false;

					break;

			};

		};

		console.log(streakArr);
		console.log(p1Points + ' - ' + p2Points);

	};

	$scope.undoScoreUpdate = function(player) {

		$scope.game.totalScore--;

		player.score--;

	}

});




