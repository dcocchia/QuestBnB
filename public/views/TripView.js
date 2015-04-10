var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var Stop = React.createClass({displayName: "Stop",
	render: function() {
		var data = this.props.data;
		var isNew = data.isNew;
		var index = this.props.index;
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] ); 
		var stopProps = ( this.props.stopProps || {} );
		var hasPredictions = queryPredictions.length > 0 && stopProps._id === data._id;
		var distance = (data.distance && data.distance.text || (data.distance = { text: "0" }));
		var totals = ( data.totals || {} );
		var canAddStop = this.props.canAddStop;

		return (
			React.createElement("li", {className: isNew ? "stop new left-full-width" : "stop left-full-width", "data-stop-id": data._id, "data-stop-index": index, key: data._id}, 
				React.createElement("div", {className: "remove", role: "button", "aria-label": "remove stop", title: "Remove stop"}), 
				React.createElement("div", {className: "stop-bar left-full-height"}, 
					React.createElement("button", {className: (canAddStop) ? "add-stop-btn" : "add-stop-btn hide", "aria-label": "add stop"}, "+")
				), 
				React.createElement("div", {className: "stop-num-wrapper left-full-height"}, 
					React.createElement("div", {className: "stop-num center"}, data.stopNum)
				), 
				React.createElement("div", {className: "stop-info left-full-height"}, 
					React.createElement("div", {className: "stop-place-info left-full-height"}, 
						React.createElement("div", {className: "stop-location-title-wrapper"}, 
							React.createElement("h3", {className: "stop-location-title text-ellip", contentEditable: "true"}, data.location), 
							React.createElement("span", {className: "clear"}), 
							React.createElement("div", {className: hasPredictions ? "locations-menu" : "locations-menu hide", id: "locations-menu", "aria-expanded": hasPredictions.toString(), "aria-role": "listbox"}, 
								React.createElement(LocationsMenu, {predictions: queryPredictions})
							)
						), 
						React.createElement("p", null, "Day ", data.dayNum), 
						React.createElement("p", null, "From last ", data.distance.text), 
						React.createElement("p", null, "Total distance ", (totals.distance && totals.distance.text) ? totals.distance.text : "0 mi")
					)
				), 
				React.createElement(Lodging, {lodging: data.lodging})
			)
		)
	}
});

var Drawer = React.createClass({displayName: "Drawer",
	render: function() {
		var data = this.props.data;
		return (
			React.createElement("div", {className: "drawer"}, 
				React.createElement("div", {className: "inner"}, 
					React.createElement("div", {className: "form-group col-lg-6 col-m-6 col-sm-6 col-xs-12"}, 
						React.createElement("label", {htmlFor: "mpg"}, "MPG"), 
						React.createElement("input", {type: "range", min: "1", max: "150", step: "1", id: "mpg", name: "mpg", className: "gas-slider mpg", placeholder: "MPG", defaultValue: data.mpg, "data-model-attr": "mpg", role: "slider", "aria-valuenow": data.mpg, "aria-valuemin": "1", "aria-valuemax": "150", "aria-valuetext": "miles per gallon"}), 
						React.createElement("p", {className: "mpg-label"}, data.mpg, " mi / Gallon")
					), 
					React.createElement("div", {className: "form-group col-lg-6 col-m-6 col-sm-6 col-xs-12"}, 
						React.createElement("label", {htmlFor: "gasPrice"}, "Gas Price"), 
						React.createElement("input", {type: "range", min: ".10", max: "10.00", step: ".10", id: "gasPrice", name: "gasPrice", className: "gas-slider gas-price", placeholder: "Gas Price", defaultValue: data.gasPrice, "data-model-attr": "gasPrice", "data-to-fixed": "2", role: "slider", "aria-valuenow": data.gasPrice, "aria-valuemin": "1", "aria-valuemax": "10.00", "aria-valuetext": "gas price"}), 
						React.createElement("p", {className: "mpg-label"}, "$", data.gasPrice, " / Gallon")
					)
				)
			)
		)
	}
});

var TripBlurb = React.createClass({displayName: "TripBlurb",
	render: function() {
		var drawer = (this.props.editable) ? React.createElement(Drawer, {data: this.props.data}) : undefined;
		return (
			React.createElement("div", {className: (this.props.editable) ? "trip-blurb editable" : "trip-blurb"}, 
				React.createElement("h3", null, this.props.text), 
				drawer
			)
		)
	}
});

var Traveller = React.createClass({displayName: "Traveller",
	handleChange: function(event) {
		//TODO: seems a bit hacky
		//using setState may be better here. 
		this.props.traveller.name = event.target.value;
		this.forceUpdate();
	},
	render: function() {
		var traveller = this.props.traveller;
		return (
			React.createElement("div", {className: "traveller", key: this.props.key, "data-traveller-id": traveller._id}, 
				React.createElement("div", {className: "profile-pic-wrapper img-wrapper"}, 
					React.createElement("img", {src: traveller && traveller.img && traveller.img.src ? traveller.img.src : '', className: "center", alt: "traveller profile picture"})
				), 
				React.createElement("p", {className: "name"}, traveller.name), 
				React.createElement("p", null, traveller.bio), 
				React.createElement("div", {className: "edit-card", "area-hidden": "true"}, 
					React.createElement("form", {className: "form-inline"}, 
						React.createElement("div", {className: "form-group col-sm-8 col-m-8 col-lg-8"}, 
							React.createElement("input", {type: "text", name: "travellerName", className: "traveller-name", placeholder: "Traveller Name", value: traveller.name, onChange: this.handleChange})
						), 
						 React.createElement("button", {type: "submit", className: "save-traveller btn btn-primary col-sm-2 col-m-2 col-lg-2"}, "Save"), 
						  React.createElement("button", {type: "submit", className: "remove-traveller btn col-sm-2 col-m-2 col-lg-2"}, "Remove")
					)
				)
			)
		)
	}
});

var Lodging = React.createClass({displayName: "Lodging",
	render: function() {
		var lodging = (this.props.lodging || {} );
		var isHome = (lodging.isHome || false);
		var lodgingElm, bookingStatusElm;

		bookingStatusElm = (
			React.createElement("div", {className: "lodging-booking-status", role: "button"}, 
				"Find a place >"
			)
		);

		if (isHome) {
			lodgingElm = ( 
				React.createElement("div", {className: "lodging-wrapper"}, 
					React.createElement("div", {className: "home-img-wrapper"}, 
						React.createElement("img", {src: "/app/img/map-pin-home-icon-medium.png", className: "absolute-center"})
					), 
					React.createElement("h4", null, "Home")
				)
			);
		} else {
			lodgingElm = (
				React.createElement("div", {className: "lodging-wrapper"}, 
					React.createElement("div", {className: "lodging-post-card"}, 
						React.createElement("div", {className: "lodging-img-wrapper col-sm-6 col-m-6 col-lg-6"}, 
							React.createElement("img", {src: "/app/img/fake-place.jpg", className: "absolute-center"})
						), 
						React.createElement("div", {className: "lodging-post-card-text col-sm-6 col-m-6 col-lg-6"}, 
							React.createElement("h4", {className: "text-ellip"}, "Lodging Title"), 
							React.createElement("p", {className: "text-ellip"}, "$999.99"), 
							React.createElement("p", {className: "text-ellip"}, "March 13th"), 
							React.createElement("p", {className: "en-dash"}, "–"), 
							React.createElement("p", {className: "text-ellip"}, "March 31st")
						)
					), 
					bookingStatusElm
				)
			);
		}

		return (
			React.createElement("div", {className: "stop-lodging left-full-height"}, 
				lodgingElm
			)
		)
	}
}); 

var TripView = React.createClass({displayName: "TripView",
	render: function() {
		var stops = this.props.stops;
		var canAddStop = (this.props.stops.length >= 10) ? false : true; 
		var locationProps = this.props.location_props;
		var stopProps = this.props.stop_props;
		var travellers = this.props.travellers;
		var slideInBottom = this.props.slideInBottom;

		return (
			React.createElement("div", {className: "trip-page", "data-trip-id": this.props._id}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", contentEditable: "true", role: "textbox"}, this.props.title), 
						React.createElement("div", {className: "stops left-full-width"}, 
							React.createElement("ol", {className: "left-full-width"}, 
							stops.map(function(stop, index) {
								return React.createElement(Stop, {data: stop, index: index, locationProps: locationProps, stopProps: stopProps, canAddStop: canAddStop, key: index});
							})
							)
						), 
						React.createElement("div", {className: "trip-blurbs left-full-width"}, 
							React.createElement(TripBlurb, {text: this.props.tripDuration, editable: false}), 
							React.createElement(TripBlurb, {text: this.props.tripDistance  + " miles", editable: false}), 
							React.createElement(TripBlurb, {text: this.props.numStops + " destinations", editable: false}), 
							React.createElement(TripBlurb, {text: "$" + this.props.cost, editable: true, data: this.props})
						)
					)
				), 
				React.createElement("div", {className: "bottom-bar panel slide-in"}, 
					React.createElement("div", {className: "travellers"}, 
						React.createElement("div", {className: "trip-traveller-text"}, "Travellers"), 
						React.createElement("button", {className: "add-traveller", "aria-label": "add traveller"}, "+"), 
						React.createElement("div", {className: "travellers-wrapper"}, 
							travellers.map(function(traveller, index) {
								return React.createElement(Traveller, {traveller: traveller, key: index})
							})
						)
					), 
					React.createElement("div", {className: "trip-dates-wrapper search-box"}, 
						React.createElement("input", {type: "text", name: "startDate", className: "start date form-control", placeholder: "Leaving", "aria-label": "date start", defaultValue: this.props.start}), 
						React.createElement("input", {type: "text", name: "endDate", className: "end date form-control", placeholder: "Returning", "aria-label": "date end", defaultValue: this.props.end}), 
						React.createElement("button", {className: "submit form-control btn btn-primary"}, "Done")
					)
				)
			)
		)
	}
});

module.exports = TripView;