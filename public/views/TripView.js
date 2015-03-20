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

		return (
			React.createElement("li", {className: isNew ? "stop new left-full-width" : "stop left-full-width", "data-stop-id": data._id, "data-stop-index": index, key: data._id}, 
				React.createElement("div", {className: "stop-bar left-full-height"}, 
					React.createElement("button", {className: "add-stop-btn"}, "+")
				), 
				React.createElement("div", {className: "stop-num-wrapper left-full-height"}, 
					React.createElement("div", {className: "stop-num center"}, data.stopNum)
				), 
				React.createElement("div", {className: "stop-info left-full-height"}, 
					React.createElement("div", {className: "stop-place-info left-full-height"}, 
						React.createElement("div", {className: "stop-location-title-wrapper"}, 
							React.createElement("h3", {className: "stop-location-title", contentEditable: "true"}, data.location), 
							React.createElement("span", {className: "clear"}), 
							React.createElement("div", {className: queryPredictions.length > 0 && stopProps._id === data._id ? "locations-menu" : "locations-menu hide", id: "locations-menu", "aria-expanded": "false", "aria-role": "listbox"}, 
								React.createElement(LocationsMenu, {predictions: queryPredictions})
							)
						), 
						React.createElement("p", null, "Day ", data.dayNum), 
						React.createElement("p", null, data.milesNum, " miles")
					)
				), 
				React.createElement("div", {className: "stop-lodging left-full-height"}

				)
			)
		)
	}
});

var TripBlurb = React.createClass({displayName: "TripBlurb",
	render: function() {
		return (
			React.createElement("div", {className: "trip-blurb"}, 
				React.createElement("h3", null, this.props.text)
			)
		)
	}
});

var Traveller = React.createClass({displayName: "Traveller",
	render: function() {
		var traveller = this.props.traveller;
		return (
			React.createElement("div", {className: "traveller", key: this.props.key}, 
				React.createElement("div", {className: "profile-pic-wrapper img-wrapper"}, 
					React.createElement("img", {src: traveller && traveller.img && traveller.img.src ? traveller.img.src : '', className: "center"})
				), 
				React.createElement("p", {className: "name"}, traveller.name), 
				React.createElement("p", null, traveller.bio)
			)
		)
	}
});

var TripView = React.createClass({displayName: "TripView",
	render: function() {
		var stops = this.props.stops;
		var locationProps = this.props.location_props;
		var stopProps = this.props.stop_props;
		var travellers = this.props.travellers;
		var slideInBottom = this.props.slideInBottom;

		return (
			React.createElement("div", {className: "trip-page", "data-trip-id": this.props._id}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", contentEditable: "true"}, this.props.title), 
						React.createElement("div", {className: "stops left-full-width"}, 
							React.createElement("ol", {className: "left-full-width"}, 
							stops.map(function(stop, index) {
								return React.createElement(Stop, {data: stop, index: index, locationProps: locationProps, stopProps: stopProps, key: index});
							})
							)
						), 
						React.createElement("div", {className: "trip-blurbs left-full-width"}, 
							React.createElement(TripBlurb, {text: this.props.tripLength + " days"}), 
							React.createElement(TripBlurb, {text: this.props.tripDistance  + " miles"}), 
							React.createElement(TripBlurb, {text: this.props.numStops + " stops"}), 
							React.createElement(TripBlurb, {text: "$" + this.props.cost})
						)
					)
				), 
				React.createElement("div", {className: "bottom-bar panel slide-in"}, 
					React.createElement("div", {className: "travellers"}, 
						React.createElement("div", {className: "trip-traveller-text"}, "Travellers"), 
						React.createElement("button", {className: "add-traveller"}, "+"), 
						React.createElement("div", {className: "travellers-wrapper"}, 
							travellers.map(function(traveller, index) {
								return React.createElement(Traveller, {traveller: traveller, key: index})
							})
						)
					), 
					React.createElement("div", {className: "trip-dates-wrapper search-box"}, 
						React.createElement("input", {type: "text", name: "startDate", className: "date form-control", placeholder: "Leaving", value: this.props.start}), 
						React.createElement("input", {type: "text", name: "endDate", className: "date form-control", placeholder: "Returning", value: this.props.end}), 
						React.createElement("button", {className: "submit form-control btn btn-primary"}, "Done")
					)
				)
			)
		)
	}
});

module.exports = TripView;