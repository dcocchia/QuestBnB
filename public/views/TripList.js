var React = require('react');

var TripList = React.createClass({displayName: "TripList",
	render: function() {
		var isIE9 = this.props.isIE9 || false;
		var tripList = this.props.tripList;

		if (isIE9) {
			return(
				React.createElement("div", {className: "trip-list-wrapper"}, 
					tripList.map(function(trip, index) {
						return (
							React.createElement("tr", {key: index}, 
								React.createElement("td", null, 
									React.createElement("a", {href: "/trips/" + trip.id, target: "_blank"}, trip.title)
								), 
								React.createElement("td", null, (trip.startDate) ? trip.startDate : "", " – ", (trip.endDate) ? trip.endDate : "")
							)
						)
					})
				)
			);
		}

		return(
			React.createElement("tbody", {className: "trip-list-wrapper"}, 
				tripList.map(function(trip, index) {
					return (
						React.createElement("tr", {key: index}, 
							React.createElement("td", null, 
								React.createElement("a", {href: "/trips/" + trip.id, target: "_blank"}, trip.title)
							), 
							React.createElement("td", null, (trip.startDate) ? trip.startDate : "", " – ", (trip.endDate) ? trip.endDate : "")
						)
					)
				})
			)
		);
	}
});

module.exports = TripList;