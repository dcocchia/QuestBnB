var React = require('react');

var TripList = React.createClass({
	render: function() {
		var tripList = this.props.tripList;

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