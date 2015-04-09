var traveller_model = Backbone.Model.extend({
	defaults: {
		name: "",
		img: {
			src: "/app/img/default-icon.jpg"
		}
	},

	initialize: function() {},

	removeTraveller: function() {
		this.trigger("remove_traveller", this.get("_id"));
	}
});

module.exports = traveller_model;