var React = require('react');

var TripList = React.createClass({
	render: function() {
		var isIE9 = this.props.isIE9 || false;
		var tripList = this.props.tripList;

		if (isIE9) {
			return(
				<div className="trip-list-wrapper">
					{tripList.map(function(trip, index) {
						return (
							<tr key={index}>
								<td>
									<a href={"/trips/" + trip.id} target="_blank">{trip.title}</a>
								</td>
								<td>{(trip.startDate) ? trip.startDate : ""} &#8211; {(trip.endDate) ? trip.endDate : ""}</td>
							</tr>
						)
					})}
				</div>
			);
		}

		return(
			<tbody className="trip-list-wrapper">
				{tripList.map(function(trip, index) {
					return (
						<tr key={index}>
							<td>
								<a href={"/trips/" + trip.id} target="_blank">{trip.title}</a>
							</td>
							<td>{(trip.startDate) ? trip.startDate : ""} &#8211; {(trip.endDate) ? trip.endDate : ""}</td>
						</tr>
					)
				})}
			</tbody>
		);
	}
});

module.exports = TripList;