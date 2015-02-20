var mongoose = require('mongoose');

var schema = mongoose.Schema({

	player1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	player1Wins: { type: Number, required: true },

	player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	player2Wins: { type: Number, required: true },

	matchWinnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	matchLength: { type: Number, required: true },

	gamesArr: [{

			totalScore: { type: Number, required: true },
			winner: { type: String, required: true },
			loser: { type: String, required: true },

	}]

});

module.exports = mongoose.model('Match', schema);