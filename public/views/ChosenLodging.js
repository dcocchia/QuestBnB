var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var Status = React.createClass({displayName: "Status",
	buildStatus: function(opts) {
		var defaults = {
			statusClass: "pending",
			renderLinks: false,
			text: "Pending host approval",
			tripId: "",
			stopId: ""
		}

		if (!opts) { opts = {}; }

		_.defaults(opts, defaults);

		if (opts.renderLinks) {
			return (
				React.createElement("div", {className: "lodging-booking-status " + opts.statusClass, role: "button"}, 
					React.createElement("a", {href: "/trips/" + opts.tripId + "/stops/" + opts.stopId}, opts.text, " >")
				)
			)
		} else {
			return (
				React.createElement("div", {className: "chosen lodging-booking-status " + opts.statusClass}, 
					opts.text
				)
			)
		}
	},

	render: function() {
		var bookingStatusElm;
		var bookingStatus = this.props.bookingStatus;
		var renderStatusLinks = this.props.renderStatusLinks;
		var tripId = this.props.tripId;
		var stopId = this.props.stopId;

		switch(bookingStatus) {
				case "pending":
					bookingStatusElm = this.buildStatus({
						statusClass: "pending",
						renderLinks: renderStatusLinks,
						text: "Pending host approval",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "approved":
					bookingStatusElm = this.buildStatus({
						statusClass: "approved",
						renderLinks: renderStatusLinks,
						text: "Approved",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "declined":
					bookingStatusElm = this.buildStatus({
						statusClass: "declined",
						renderLinks: renderStatusLinks,
						text: "Declined",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "expired":
					bookingStatusElm = this.buildStatus({
						statusClass: "declined",
						renderLinks: renderStatusLinks,
						text: "Request Expired",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "no_status":
					bookingStatusElm = this.buildStatus({
						statusClass: "",
						renderLinks: renderStatusLinks,
						text: "Find a place",
						tripId: tripId,
						stopId: stopId
					});
					break;
				default: 
					bookingStatusElm = (
						React.createElement("span", null)
					)
					break;
			}
		return bookingStatusElm;
	}
});

var StatusMenu = React.createClass({displayName: "StatusMenu",
	render: function() {
		return (
			React.createElement("div", {className: "lodging-booking-status-inner"}, 
				React.createElement("h4", null, "Set status"), 
				React.createElement("div", {className: "set-chosen lodging-booking-status pending", role: "button", "data-status": "pending"}, 
					"Pending host approval"
				), 
				React.createElement("div", {className: "set-chosen lodging-booking-status approved", role: "button", "data-status": "approved"}, 
					"Approved"
				), 
				React.createElement("div", {className: "set-chosen lodging-booking-status declined", role: "button", "data-status": "declined"}, 
					"Declined"
				), 
				React.createElement("div", {className: "set-chosen lodging-booking-status declined", role: "button", "data-status": "expired"}, 
					"Request Expired"
				), 
				React.createElement("p", null, "*Since this site is partially fake, booking is not actually possible. Please see \"what is this?\" section of the navigation menu for more information.")
			)
		);
	}
});

var ChosenLodging = React.createClass({displayName: "ChosenLodging",
	render: function() {
		var data = this.props.data || {};
		var attr = data.attr || {};
		var photos = data.photos || [];
		var activePhotoIndex = data.activePhotoIndex || 0;
		var photoSize = this.props.photoSize || 'medium';
		var renderStatusLinks = this.props.renderStatusLinks || false;
		var tripId = this.props.tripId;
		var stopId = this.props.stopId;
		var photoSource = (photos[activePhotoIndex]) ? photos[activePhotoIndex][photoSize] : "";
		var altTxt = (photos[0]) ? photos[0].caption : ""
		var bookingStatus = data.bookingStatus || false;
		var showStatusMenu = data.showStatusMenu || false;
		var isHome = (data.id === "quest_home") ? true : false;
		var photoBtns = function() {
			if (photos.length > 1) {
				return (
					React.createElement("div", {className: "photo-btns-wrapper"}, 
						React.createElement("div", {className: "next-photo", role: "button", "aria-label": "next photo"}), 
						React.createElement("div", {className: "prev-photo", role: "button", "aria-label": "previous photo"})
					)
				)
			} else {
				return undefined;
			}
		}();

		if (_.isEmpty(data) || data.id === "default") { 
			return (React.createElement("span", null)); 
		}

		if (isHome) {
			return (
				React.createElement("div", {className: "lodging-chosen home col-md-12 col-sm-12", "data-id": data.id}, 
					React.createElement("div", {className: "col-md-12 col-sm-12"}, 
						React.createElement("div", {className: "result-img img-wrapper"}, 
							React.createElement("img", {className: "center", src: "/app/img/map-pin-home-icon-medium.png", alt: "home"})
						)
					)
				)
			)
		}

		return (
			React.createElement("div", {className: "lodging-chosen col-md-12 col-sm-12", "data-id": data.id}, 
				React.createElement("div", {className: "col-md-6 col-sm-12"}, 
					React.createElement("div", {className: "result-img img-wrapper"}, 
						React.createElement("div", {className: "result-price"}, 
							React.createElement("h6", null, React.createElement("span", {className: "dollar"}, "$"), data.price.nightly)
						), 
						React.createElement("img", {className: "center", src: photoSource, alt: altTxt}), 
						photoBtns
					)
				), 
				React.createElement("div", {className: "result-body col-md-6 col-sm-12"}, 
					React.createElement("h3", {className: "text-ellip"}, attr.heading), 
					React.createElement("div", {className: "result-info text-muted text-ellip"}, 
						React.createElement("span", null, attr.roomType.text, " · "), 
						React.createElement("div", {className: "star-rating"}, 
							React.createElement(Stars, {rating: data.reviews.rating}), " · ", React.createElement("span", null, data.reviews.count, " reviews")
						)
					), 
					React.createElement("p", null, attr.shortDesc), 
					React.createElement(Status, {bookingStatus: bookingStatus, renderStatusLinks: renderStatusLinks, tripId: tripId, stopId: stopId}), 
					React.createElement("div", {className: (!showStatusMenu) ? "booking-satus-menu hidden" : "booking-satus-menu", "aria-hidden": !!showStatusMenu}, 
						React.createElement(StatusMenu, null)
					)
				)
			)
		)
	}
});

module.exports = ChosenLodging;