var TravellerView = Backbone.View.extend({
	events: {
		"click"						: "toggleEditCard",
		"click .close-edit-card"	: "toggleEditCard",
		"click .save-traveller-btn"	: "saveTraveller"
	},

	initialize: function(opts) {
		this.travellerId = opts.travellerId;
	},

	toggleEditCard: function(e) {
		console.log(e);
	},

	saveTraveller: function() {
		var data = {};

		this.model.set(data);
	},

	removeTraveller: function() {
		this.model.removeTraveller();
	},

	destroy: function() {
		this.undelegateEvents();

		this.$el.removeData().unbind(); 

		this.remove();  
		Backbone.View.prototype.remove.call(this);
	}
});

module.exports = TravellerView;