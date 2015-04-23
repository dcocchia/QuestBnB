var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var SearchQuery = React.createClass({displayName: "SearchQuery",
	render: function() {
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
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
			)
		);
	}
});

module.exports = SearchQuery;