/**
 * DishController
 *
 * @description :: Server-side logic for managing dishes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	 createDish:function(req,res){
      var id = req.param('owner');
      Dish.create({owner:id,name:'default'}).exec(function createCB(err,created_dish){
             return res.send(created_dish);
      });
    },
};

