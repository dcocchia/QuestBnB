var traveller_model = require("../backbone_models/traveller_model");

var travellers_collection = Backbone.Collection.extend({
	model: traveller_model,
	
	initalize: function() {
		console.log("travellers_collection init!");
	}
});

module.exports = travellers_collection;