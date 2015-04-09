var traveller_model = require("../backbone_models/traveller_model");

var travellers_collection = Backbone.Collection.extend({
	model: traveller_model,

	initialize: function() {
		this.on("remove_traveller", _.bind(function(id) {
			this.removeTraveller(id);
		}, this));
	},

	removeTraveller: function(id) {
		this.remove(this.where({_id: id}) );
	}
});

module.exports = travellers_collection;