var React = require("react");

var LocationItem = React.createClass({displayName: "LocationItem",
	render: function() {
		var place_id = this.props.prediction.place_id;
		var description = this.props.prediction.description;
		return (
			React.createElement("div", {className: "location-item", "data-place-id": place_id, "data-place-description": description, role: "menuitem", "aria-label": "location auto-fill option"}, 
				React.createElement("span", {className: "location"}, description)
			)
		)
	}
});

var LocationsMenu = React.createClass({displayName: "LocationsMenu",
	render: function() {
		var predictions = this.props.predictions;
		return (
			React.createElement("div", null, 
			predictions.map(function(prediction) {
				return React.createElement(LocationItem, {prediction: prediction});
			})
			)
		)
	}
});

module.exports = LocationsMenu;