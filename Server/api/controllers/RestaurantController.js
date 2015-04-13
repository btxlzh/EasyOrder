/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var qr = require('qr-image');
module.exports = {
	getAll: function (req, res) {
		var xx;
		Restaurant.find().exec(function (err, found) {return res.send(found);});
  	},
  	getQRcode: function (req, res){
  		id = req.param('id');
  		var text ='http://localhost:1337/restaurant/'+ id;
        var img = qr.image(text);
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);	
  	}
  	
};

