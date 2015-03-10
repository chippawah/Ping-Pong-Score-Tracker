var r = require('rethinkdb');
var q = require('q');
var bcrypt = require('bcrypt');

module.exports = {

	getPlayerId: function(p1Email, p2Email) {

		var dfd1 = q.defer();
		var dfd2 = q.defer();

		Player.findOne({email: p1Email}).select('_id').exec()

			.then(function(playerId) {

				dfd1.resolve(playerId);

			}, function(err) {

				console.log(err);

			});

		Player.findOne({email: p2Email}).select('_id').exec()

			.then(function(playerId) {

				dfd2.resolve(playerId);

			}, function(err) {

				console.log(err);

			});

		return [dfd1.promise, dfd2.promise];

	},

	comparePassword: function(input, real) {

		console.log('comparePassword is running with these arguments: ', input, real);

		var dfd = q.defer();

		bcrypt.compare(input, real, function(err, isMatch) {

			if (err) {

				dfd.reject(err);

			}

			else {

				dfd.resolve(isMatch);

			}

		});

		return dfd.promise;

	}

};