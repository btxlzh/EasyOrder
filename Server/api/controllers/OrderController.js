/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	listenOrder:function(req,res){
		
		var data_from_client = req.params.all();
		if(req.isSocket){
			// subscribe client to model changes 
			Order.watch(req);
			console.log( 'User subscribed to ' + req.socket.id );
			return res.send("succ");
		}
	},
	createPub:function(req,res){
		Order.create()
				.exec(function(error){
					console.log("publish");
					Order.publishCreate({id: 10, message : "ata_from_client.message"});
				}); 
	}
};

