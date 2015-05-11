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
			Order.watch(req.socket);
			console.log( 'User subscribed to ' + req.socket.id );
		}
	}	
};

