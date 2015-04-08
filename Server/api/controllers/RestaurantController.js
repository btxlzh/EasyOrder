/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getAll: function (req, res) {
		var xx;
		Restaurant.find().exec(function (err, found) {return res.send(found);});
  	},
};

