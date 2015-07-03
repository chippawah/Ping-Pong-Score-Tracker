var app = angular.module('scoreKeep');

app.controller('mainGamePageCtrl', function($scope, gameService, $location, matchService, playerService, matchObj) {

// Setting up all the info

	$scope.match = matchObj;
	$scope.game = matchObj.gamesArr[matchObj.gameNumber -1].game;
	$scope.player1 = matchObj.gamesArr[matchObj.gameNumber -1].player1;
	$scope.player2 = matchObj.gamesArr[matchObj.gameNumber -1].player2;

	$scope.player1.playerId = matchObj.player1.id;
	$scope.player2.playerId = matchObj.player2.id;

// Game Status Methods

	$scope.gameFinishCheck = function() {

		var p1Score = $scope.player1.score;

		var p2Score = $scope.player2.score;

		if((p1Score >= 21 && $scope.player1.leading === true) || (p2Score >= 21 && $scope.player2.leading === true)) {

			var winning = $scope.leaderCheck('winning');

			var losing = $scope.leaderCheck('losing');

			var scoreDiff = winning.score - losing.score;

			if(scoreDiff > 1 && winning.score >= 21) {

				var finishedGame = {

					game: $scope.game,
					winner: winning,
					loser: losing

				};

				matchService.endGame(finishedGame, $scope.match);

			};

		};

	};

	$scope.gameModeCheck = function() {

		var p1Score = $scope.player1.score;

		var p2Score = $scope.player2.score;

		if(p1Score < 20 && p2Score < 20) {

			return 'normal';

		};

		if((p1Score === 20 && p2Score < 20) || (p2Score === 20 && p1Score < 20)) {

			return 'comeBack';

		};

		if((p1Score === 21 && p2Score === 20) || (p1Score === 20 && p2Score === 21)) {

			return 'comeBack';
		}

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

// Undo Methods

	$scope.undoLastPoint = function() {

		var player = $scope.game.lastPoint;

		$scope.undoScoreUpdate(player);

		$scope.undoPointStreakUpdate(player);

		$scope.undoPointDataUpdate(player);

		$scope.leaderCheck();

		matchService.updateMatch($scope.game, $scope.player1, $scope.player2, $scope.match);

	};

	$scope.undoPointStreakUpdate = function(player){

		var streakArr = $scope.game.lastFivePoints;

			switch (player.playerId) {

				case $scope.match.player1.id:

					$scope.player1.streaking = false;

					$scope.game.streakCount.p1Streak--;

					break;

				case $scope.match.player2.id:

					$scope.player2.streaking = false;

					$scope.game.streakCount.p2Streak--;					

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

		} else if ($scope.game.serveCounter === 4) {

			$scope.game.finalServe = false;

		};

		$scope.game.serveCounter--;

		switch(player.playerId) {

			case receiver.playerId: 

				player.pointsReceiving--;

				break;

			case server.playerId:

				player.pointsServing--

				break;

		};

	};

	$scope.undoScoreUpdate = function(player) {

		$scope.game.totalScore--;

		player.score--;

	};

// Game Helpers

	$scope.toggler = function(prop, player) {

		switch (prop) {

			case 'fault':

				$scope.game.showFaultAlert = false;

				break;

			case 'switch':

				$scope.game.showSwitchAlert = false;

				break;

			case 'nameForm':

				player.showPlayerNameForm = !player.showPlayerNameForm;

				break;

			case 'pointData':

				player.showPointData = !player.showPointData;

				break;

			case 'serverSelect':

				if(player.playerId === $scope.match.player1.id) {

					$scope.player1.serving = true;

					$scope.player2.serving = false;

				};

				if(player.playerId === $scope.match.player2.id) {

					$scope.player1.serving = false;

					$scope.player2.serving = true;

				};

		};

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

	$scope.pointStreakUpdater = function(player) {

		var streakArr = $scope.game.lastFivePoints;

		if(streakArr.length === 6) {

			streakArr.pop();

		};

		streakArr.unshift(player.playerId);

		var p1Points = 0;

		var p2Points = 0;

		for (var i = 0; i < 5; i++) { //Looping to count only the last five points
			
			if(streakArr[i] === $scope.player1.playerId) {

				p1Points++;

			};

			if(streakArr[i] === $scope.player2.playerId) {

				p2Points++;

			};


		};

		$scope.game.streakCount.p1Streak = p1Points;
		$scope.game.streakCount.p2Streak = p2Points;

		if(streakArr[0] === streakArr[1]) {

			switch (streakArr[0]) {

				case $scope.player1.playerId:

					$scope.player1.streaking = true;

					$scope.player2.streaking = false;

					break;

				case $scope.player2.playerId:

					$scope.player2.streaking = true;

					$scope.player1.streaking = false;

					break;

			};

		} else {

			$scope.player2.streaking = false;

			$scope.player1.streaking = false;

		};

		if(streakArr.length === 2) {

			switch (streakArr[0]) {

				case $scope.player1.playerId:

					$scope.player1.streaking = true;

					$scope.player2.streaking = false;

					break;

				case $scope.player2.playerId:

					$scope.player2.streaking = true;

					$scope.player1.streaking = false;

					break;

			};

		};

		console.log(streakArr);
		console.log(p1Points + ' - ' + p2Points);

	};

	$scope.point = function(player) {

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

		matchService.updateMatch($scope.game, $scope.player1, $scope.player2, $scope.match);

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

		matchService.updateMatch($scope.game, $scope.player1, $scope.player2, $scope.match);

	};

});




