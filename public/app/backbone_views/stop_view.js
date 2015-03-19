StopView = Backbone.View.extend({
	events: {
		"keydown .stop-location-title": "onEditKeyDown",
		"blur .stop-location-title": "onLocationTitleBlur",
		"click .clear": "onClearClick"
	},

	initialize: function(opts) {
		console.log("stop view init. el: ", this.$el);
		this.focus();
	},

	onLocationTitleBlur: function(e) {
		var target = e.currentTarget,
			text = (target && target.textContent && typeof(target.textContent) != "undefined") ? target.textContent : target.innerText;

		//TODO: save to db
		console.log(text);
	},

	onEditKeyDown: function(e) {
		if (e && e.keyCode === 13) {
			if (e.preventDefault) { e.preventDefault(); }
			$(e.currentTarget).blur();
			this.clearAllRanges();
		}
	},

	onClearClick: function(e) {
		var $target = this.$(e.currentTarget).siblings(".stop-location-title");

		if (e.preventDefault) { e.preventDefault(); }

		$target.text("");
	},

	clearAllRanges: function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection.createRange) {
			var range = document.selection.createRange();
			document.selection.empty();
		}
	},

	focus: function(stop) {
		this.$(".stop-location-title").focus();
	}
});

module.exports = StopView;