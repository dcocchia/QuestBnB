var TravellerView = Backbone.View.extend({
	events: {
		"click"						: "toggleEditCard",
		"click .edit-card"			: "clickEditCard",		
		"click .close-edit-card"	: "toggleEditCard",
		"click .save-traveller"		: "saveTraveller",
		"click .remove-traveller"	: "removeTraveller",
		"keyup .edit-card input"	: "onEditNameKeyUp",
		"focus .edit-card input"	: "onFocusEditCardInput"
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.travellerId = opts.travellerId;

		if (opts.isNew) { _.delay( _.bind(this.toggleEditCard, this) , 300); }

		Backbone.on("TripView:render", _.bind(function() {
			this.setElement(this.$el.selector);
		}, this));
	},

	toggleEditCard: function() {
		var $card = this.$(".edit-card");

		if ($card.hasClass("active")) {
			$card.removeClass("active");
			$card.find("input").blur();	
		} else {
			$card.addClass("active");
			_.delay(function() { $card.find("input").focus(); }, 220);
		}
	},

	clickEditCard: function(e) {
		//required to stop toggleEditCard function from tirggering
		e.preventDefault();
		e.stopPropagation();
	},	

	saveTraveller: function(e) {
		var data = {
			name: this.$("input").val()
		};

		e.preventDefault();
		this.toggleEditCard();
		this.model.set(data);
	},

	removeTraveller: function(e) {
		e.preventDefault();
		this.toggleEditCard();
		this.model.removeTraveller();
	},

	onEditNameKeyUp: function(e) {
		if (e.keyCode === 13) {
			this.clearAllRanges();
			this.saveTraveller(e);
		}
	},

	onFocusEditCardInput: function(e) {
		//places cursor at end of text
		e.currentTarget.value = e.currentTarget.value;
	},

	clearAllRanges: function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection.createRange) {
			var range = document.selection.createRange();
			document.selection.empty();
		}
	}
});

module.exports = TravellerView;