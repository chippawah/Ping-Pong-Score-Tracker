var mongoose = require('mongoose');

var playerData = {

	name: { type: String, required: true },
	mongoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	score: { type: Number, required: true },
	pointsReceiving: { type: Number, required: true },
	pointsServing: { type: Number, required: true },
	ptsDblFaulted: { type: Number }

};

var schema = mongoose.Schema({

	player1: {

		name: { type: String, required: true },
		pointsReceiving: { type: Number, required: true },
		pointsServing: { type: Number, required: true },
		ptsDblFaulted: { type: Number },
		wins: { type: Number, required: true }


	},

	player2: {

		name: { type: String, required: true },
		pointsReceiving: { type: Number, required: true },
		pointsServing: { type: Number, required: true },
		ptsDblFaulted: { type: Number },
		wins: { type: Number, required: true }

	},

	player1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },

	winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', index: true },
	matchLength: { type: Number, required: true },
	createdAt: { type: Date, required: true },

	gamesArr: [{

		winner: playerData,
		loser: playerData

	}]

});

module.exports = mongoose.model('Match', schema);