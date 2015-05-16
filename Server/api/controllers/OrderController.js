/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    listenOrder: function(req, res) {

        var data_from_client = req.params.all();
        console.log(data_from_client);
        if (req.isSocket && req.method == 'GET') {
            // subscribe client to model changes 
            Order.watch(req);
            console.log('User subscribed to ' + req.socket.id);
            return res.send("succ");
        }
        return res.send();
    },
};