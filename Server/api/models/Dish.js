/**
* Dish.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name    :     	{ type : 'string',required: true},
    price   :     	{ type : 'integer' },
    image_urls: 	{ type : 'integer'},
    description: 	{ type : 'text'},
    rating : 		{ type: 'integer'},
    owner:{
            model:'Menu'
        }
  }
};

