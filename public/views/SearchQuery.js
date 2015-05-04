var React = require('react');
var ReactSlider = require('react-slider');
var LocationsMenu = require('./LocationsMenu');
var _ = require('lodash');

var SearchQuery = React.createClass({displayName: "SearchQuery",
	_updateModelDebounced: _.debounce( _.bind( function(value) {
		Backbone.trigger("slider:update", value);
	}, this), 500),

	getInitialState: function() {
		return { 
			sliderMin: 0,
			sliderMax: 1000
		}
	},

	onSliderChange: function(value) {
		this.setState({ 
			sliderMin: value[0],
			sliderMax: value[1]
		});

		if (!Backbone) { return; }

		this._updateModelDebounced(value);
	},

	render: function() {
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
		var sliderMin = this.state.sliderMin || 0;
		var sliderMax = this.state.sliderMax || 1000;
		var checkin = this.props.checkin || this.props.tripStart;
		var checkout = this.props.checkout || this.props.tripEnd;

		return (
			React.createElement("div", {className: "search-query-wrapper-inner"}, 
				React.createElement("div", {className: "filters-section panel-body panel-light"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-lg-2 col-md-12"}, 
							React.createElement("label", null, "Location")
						), 
						React.createElement("div", {className: "col-lg-9"}, 
							React.createElement("div", {className: "stop-location-title-wrapper-outter col-lg-12 col-md-12"}, 
								React.createElement("div", {className: "stop-location-title-wrapper"}, 
									React.createElement("h3", {className: "stop-location-title text-ellip", contentEditable: "true"}, this.props.location), 
									React.createElement("span", {className: "clear"}), 
									React.createElement("div", {className: hasPredictions ? "locations-menu" : "locations-menu hide", id: "locations-menu", "aria-expanded": hasPredictions.toString(), "aria-role": "listbox"}, 
										React.createElement(LocationsMenu, {predictions: queryPredictions})
									)
								)
							)
						)
					)
				), 
				React.createElement("div", {className: "filters-section panel-body panel-light"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-lg-2 col-md-12"}, 
							React.createElement("label", null, "Dates")
						), 
						React.createElement("div", {className: "col-lg-9"}, 
							React.createElement("div", {className: "date-input-wrapper col-lg-6 col-md-6"}, 
								React.createElement("input", {type: "text", name: "startDate", className: "start date form-control", placeholder: "Check In", "aria-label": "date start", defaultValue: checkin})
							), 
							React.createElement("div", {className: "date-input-wrapper col-lg-6 col-md-6"}, 
								React.createElement("input", {type: "text", name: "endDate", className: "end date form-control", placeholder: "Check Out", "aria-label": "date end", defaultValue: checkout})
							)
						)
					)
				), 
				React.createElement("div", {className: "filters-section panel-body panel-light"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-lg-2 col-md-12"}, 
							React.createElement("label", null, "Price Range")
						), 
						React.createElement("div", {className: "col-lg-9"}, 
							React.createElement("div", {className: "col-lg-12 col-md-12"}, 
								React.createElement(ReactSlider, {defaultValue: [1, 1000], max: 1000, min: 1, withBars: true, onChange: this.onSliderChange})
							), 
							
							React.createElement("div", {className: "col-lg-6 col-md-6"}, 
								React.createElement("label", null, "$", sliderMin)
							), 
							
							React.createElement("div", {className: "col-lg-6 col-md-6 text-right"}, 
								React.createElement("label", null, "$", sliderMax)
							)
						)
					)
				)
			)
		);
	}
});

module.exports = SearchQuery;