var headerViewTemplate = require("../../views/HeaderView");
var navModalsTemplate = require("../../views/ModalsView");
var renderer = require("../../../renderer/client_renderer");

var HeaderView = Backbone.View.extend({
	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
		this.elms.$navModals = $(".nav-modals");
	},

	elms: {},

	events: {
		"click" 			: "toggleMenu",
		"click .explain" 	: "onClickExplain",
		"click .your-trips" : "onClickYourTrips"
	},

	initialize: function(opts) {
		opts || (opts = {});

		this._findElms(opts.$parentEl);

		this.model.on("change", _.bind(function() {
			this.render();
		}, this));

		Backbone.on("triplist:update", _.bind(function(newTripList) {
			this.renderTripList(newTripList);
		}, this));

		this.render();
		this.renderTripList(this.getTripList());
	},

	render: function() {
		renderer.render(headerViewTemplate, this.model.attributes, this.elms.$parentEl[0]);

		this.setElement(this.elms.$parentEl.children(this.$el.selector));
	},

	renderTripList: function(tripList) {
		renderer.render(navModalsTemplate, {tripList: tripList}, this.elms.$navModals[0]);
	},

	toggleMenu: function() {
		var opened = this.model.get("open") || false;

		this.model.set({open: !opened})
	},
	
	onClickExplain: function(e) {
		e.preventDefault();
		e.stopPropagation();

		this.elms.$navModals.find(".nav-modal-explain").on("hide.bs.modal", _.bind(function(e) {
			this.model.set({open: false});
		}, this)).modal("show");
	},

	onClickYourTrips: function(e) {
		e.preventDefault();
		e.stopPropagation();

		this.elms.$navModals.find(".nav-modal-your-trips").on("hide.bs.modal", _.bind(function(e) {
			this.model.set({open: false});
		}, this)).modal("show");
	},

	getTripList: function() {
		var tripList = localStorage.getItem("tripList");

		if (tripList) {
			try { return JSON.parse(tripList) }
			catch(e) {
				return [];
			}
		} else {
			return [];
		}
	}
});

module.exports = HeaderView;