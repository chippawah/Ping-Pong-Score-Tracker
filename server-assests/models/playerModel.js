var mongoose = require('mongoose');
var q = require('q');


var schema = mongoose.Schema({

			name: { type: String, required: true },
			email: { type: String, required: true, unique: true },
			phone: { type: String, default: '' },
			password: { type: String, required: true },
			win: { type: Number, default: 0 },
			loss: { type: Number, default: 0 },
			streaking: { type: Boolean, default: false },
			createdAt: { type: Date }

});

schema.pre('save', function(next) {

	var player = this;

	if (!player.isModified('password')) {

		return next();

	}

	

});

module.exports = mongoose.model('Player', schema);