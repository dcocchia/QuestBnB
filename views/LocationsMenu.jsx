var React = require("react");

var LocationItem = React.createClass({
	render: function() {
		var place_id = this.props.prediction.place_id;
		var description = this.props.prediction.description;
		return (
			<div className="location-item" data-place-id={place_id} data-place-description={description} role="menuitem" aria-label="location auto-fill option">
				<span className="location">{description}</span>
			</div>
		)
	}
});

var LocationsMenu = React.createClass({
	render: function() {
		var predictions = this.props.predictions;
		return (
			<div>
			{predictions.map(function(prediction, index) {
				return <LocationItem prediction={prediction} key={index}/>;
			})}
			</div>
		)
	}
});

module.exports = LocationsMenu;