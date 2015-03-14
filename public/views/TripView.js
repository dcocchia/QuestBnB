var React = require('react');

var Stop = React.createClass({displayName: "Stop",
	render: function() {
		var data = this.props.data;
		return (
			React.createElement("li", {className: "stop", "data-stop-id": data._id}, 
				React.createElement("div", {className: "stops-bar"}), 
				React.createElement("div", {className: "stop-info"}, 
					React.createElement("div", {className: "stop-num"}, data.stopNum), 
					React.createElement("div", {className: "stop-place-info"}, 
						React.createElement("h3", null, data.location), 
						React.createElement("p", null, "Day ", data.dayNum), 
						React.createElement("p", null, data.milesNum, " miles")
					)
				), 
				React.createElement("div", {className: "stop-lodging"}

				)
			)
		)
	}
});

var TripBlurb = React.createClass({displayName: "TripBlurb",
	render: function() {
		return (
			React.createElement("div", {className: "trip-blurb"}, 
				this.props.text
			)
		)
	}
});

var Traveller = React.createClass({displayName: "Traveller",
	render: function() {
		var traveller = this.props.traveller;
		return (
			React.createElement("div", {className: "traveller"}, 
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
		var travellers = this.props.travellers;

		return (
			React.createElement("div", {className: "trip-page"}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("h1", null, this.props.title), 
					React.createElement("div", {className: "stops"}, 
						React.createElement("ol", null, 
						stops.map(function(stop) {
							return React.createElement(Stop, {data: stop});
						})
						)
					), 
					React.createElement("div", {className: "trip-blurbs"}, 
						React.createElement(TripBlurb, {text: this.props.tripLength + " days"}), 
						React.createElement(TripBlurb, {text: this.props.tripDistance  + " miles"}), 
						React.createElement(TripBlurb, {text: this.props.numStops + " stops"}), 
						React.createElement(TripBlurb, {text: "$" + this.props.cost})
					)
				), 
				React.createElement("div", {className: "bottom-bar panel"}, 
					React.createElement("div", {className: "travellers"}, 
						React.createElement("div", {className: "trip-traveller-text"}, "Travellers"), 
						React.createElement("button", {className: "add-traveller"}, "+"), 
						React.createElement("div", {className: "travellers-wrapper"}, 
							travellers.map(function(traveller) {
								return React.createElement(Traveller, {traveller: traveller})
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