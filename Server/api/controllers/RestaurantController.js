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
      console.log("getQRcode");
  		var text ='http://localhost:1337/restaurant/?id='+ id;
        var img = qr.image(text);
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);	
  	},
  	authSession: function (req, res) {
      return res.send("session got it");
    },
    token: function (req, res) {
      return res.send(" token got it");
    },
    getDetailAll:function(req,res){
      thisId = req.param('id');
      Restaurant.findOne({id:thisId})
      .populateAll()
      .exec(function findOneCB(err,found){
        return res.send(found);
      });
    }
};

