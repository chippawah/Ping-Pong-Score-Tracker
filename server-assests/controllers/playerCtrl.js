var Player = require('./../models/playerModel');
var q = require('q');

module.exports.findPlayer = function(req, res){

	Player.findOne({email: req.body.email}).select('-password -createdAt -phone -__v').exec()

		.then(function(player) {

			res.status(200).json(player);

		}, function(err) {

			res.status(404).end();

		});

};

module.exports.getPlayerId = function(p1Email, p2Email) {

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

};