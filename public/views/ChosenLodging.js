var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var Status = React.createClass({displayName: "Status",
	render: function() {
		var bookingStatusElm;
		var bookingStatus = this.props.bookingStatus;

		switch(bookingStatus) {
				case "pending":
					bookingStatusElm = (
						React.createElement("div", {className: "chosen lodging-booking-status pending"}, 
							"Pending host approval"
						)
					);
					break;
				case "approved":
					bookingStatusElm = (
						React.createElement("div", {className: "chosen lodging-booking-status approved"}, 
							"Approved"
						)
					);
					break;
				case "declined":
					bookingStatusElm = (
						React.createElement("div", {className: "chosen lodging-booking-status declined"}, 
							"Declined"
						)
					);
					break;
				case "expired":
					bookingStatusElm = (
						React.createElement("div", {className: "chosen lodging-booking-status declined"}, 
							"Request Expired"
						)
					);
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
		var photoSource = (data.photos[activePhotoIndex]) ? data.photos[activePhotoIndex].medium : "";
		var altTxt = (data.photos[0]) ? data.photos[0].caption : ""
		var bookingStatus = data.bookingStatus || false;
		var showStatusMenu = data.showStatusMenu || false;
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

		if (_.isEmpty(data)) { return; }
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
					React.createElement(Status, {bookingStatus: bookingStatus}), 
					React.createElement("div", {className: (!showStatusMenu) ? "booking-satus-menu hidden" : "booking-satus-menu", "aria-hidden": !!showStatusMenu}, 
						React.createElement(StatusMenu, null)
					)
				)
			)
		)
	}
});

module.exports = ChosenLodging;