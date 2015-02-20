var Player = require('./../models/playerModel');

module.exports.findPlayer = function(req, res){

	Player.findOne({email: req.body.email}).select('name id').exec()

		.then(function(player) {

			res.status(200).json(player);

		}, function(err) {

			res.status(404).end();

		});

};