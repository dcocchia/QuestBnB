var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var ChosenLodging = React.createClass({displayName: "ChosenLodging",
	render: function() {
		var data = this.props.data || {};
		var photos = data.photos || [];
		var activePhotoIndex = data.activePhotoIndex || 0;
		var photoSource = (data.photos[activePhotoIndex]) ? data.photos[activePhotoIndex].medium : "";
		var altTxt = (data.photos[0]) ? data.photos[0].caption : "";
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
					React.createElement("h3", {className: "text-ellip"}, data.attr.heading), 
					React.createElement("div", {className: "result-info text-muted text-ellip"}, 
						React.createElement("span", null, data.attr.roomType.text, " · "), 
						React.createElement("div", {className: "star-rating"}, 
							React.createElement(Stars, {rating: data.reviews.rating}), " · ", React.createElement("span", null, data.reviews.count, " reviews")
						)
					)
				)
			)
		)
	}
});

module.exports = ChosenLodging;