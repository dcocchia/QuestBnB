var React = require('react');

var ModalsView = React.createClass({displayName: "ModalsView",
	render: function() {
		return (
			React.createElement("div", {className: "modals-inner-wrapper"}, 
				React.createElement("div", {className: "nav-modal-explain modal fade", "aria-hidden": "true"}
				), 
				React.createElement("div", {className: "nav-modal-your-trips modal fade", "aria-hidden": "true"}, 
					React.createElement("div", {className: "modal-dialog"}, 
						React.createElement("div", {className: "modal-content"}, 
							React.createElement("button", {type: "button", className: "close btn", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
							React.createElement("div", {className: "panel"}, 
								React.createElement("div", {className: "panel-header col-sm-12 col-md-12 col-lg-12"}, 
								"Your Trips"
								)
							), 
							React.createElement("table", {className: "table"}, 
								React.createElement("tbody", null, 
									React.createElement("tr", null, 
										React.createElement("th", null, "Name"), 
										React.createElement("th", null, "Dates")
									), 
									this.props.tripList.map(function(trip, index) {
										return (
											React.createElement("tr", null, 
												React.createElement("td", null, 
													React.createElement("a", {href: "/trips/" + trip.id, target: "_blank"}, trip.title)
												), 
												React.createElement("td", null, (trip.startDate) ? trip.startDate : "", " – ", (trip.endDate) ? trip.endDate : "")
											)
										)
									})
								)
							)
						)
					)
				)
			)
		)
	}
});

module.exports = ModalsView;