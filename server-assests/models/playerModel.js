var mongoose = require('mongoose');
var q = require('q');
var bcrypt = require('bcrypt');

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

	bcrypt.genSalt(12, function(err, salt) {

		if (err) {

			return next(err);

		}

		bcrypt.hash(player.password, salt, function(err, hash) {

			player.password = hash;

			return next();

		});

	});

});

schema.methods.comparePassword = function(pass) {

	var deferred = q.defer();

	bcrypt.compare(pass, this.password, function(err, isMatch) {

		if (err) {

			deferred.reject(err);

		}

		else {

			deferred.resolve(isMatch);

		}

	});

	return deferred.promise;

};

module.exports = mongoose.model('Player', schema);