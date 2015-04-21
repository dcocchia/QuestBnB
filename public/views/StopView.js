var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var Result = React.createClass({displayName: "Result",
	render: function() {
		return (
			React.createElement("li", {className: "lodging-result col-sm-12 col-md-6"}
			)
		);
	}
});

var StopView = React.createClass({displayName: "StopView",
	render: function() {
		var results = this.props.results || [];
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
		return (
			React.createElement("div", {className: "stop-page"}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", role: "textbox"}, this.props.tripTitle, " – Stop ", this.props.stopNum), 
						React.createElement("div", {className: "search-query-wrapper"}, 
							React.createElement("div", {className: "filters-section panel-body panel-light"}, 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col-lg-2 col-md-12"}, 
										React.createElement("label", null, "Location")
									), 
									React.createElement("div", {className: "col-lg-9"}, 
										React.createElement("div", {className: "col-lg-12 col-md-12"}, 
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
											React.createElement("input", {type: "text", name: "startDate", className: "start date form-control", placeholder: "Check In", "aria-label": "date start", defaultValue: this.props.start})
										), 
										React.createElement("div", {className: "date-input-wrapper col-lg-6 col-md-6"}, 
											React.createElement("input", {type: "text", name: "endDate", className: "end date form-control", placeholder: "Check Out", "aria-label": "date end", defaultValue: this.props.end})
										)
									)
								)
							), 
							React.createElement("div", {className: "filters-section panel-body panel-light"}, 
								React.createElement("div", {className: "row"}, 
									React.createElement("div", {className: "col-lg-2 col-md-12"}, 
										React.createElement("label", null, "Price Range")
									)
								)
							)
						), 
						React.createElement("div", {className: "search-results-wrapper left-full-width"}, 
							React.createElement("ol", {className: "search-results left-full-width"}, 
								results.map(function(result, index) {
									return React.createElement(Result, {result: result, key: index})
								})
							)
						)
					)
				)
			)
		)
	}
});

module.exports = StopView;