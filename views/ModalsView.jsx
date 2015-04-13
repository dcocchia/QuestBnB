var React = require('react');

var ModalsView = React.createClass({
	render: function() {
		return (
			<div className="modals-inner-wrapper">
				<div className="nav-modal-explain modal fade" aria-hidden="true">
				</div>
				<div className="nav-modal-your-trips modal fade" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<button type="button" className="close btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<div className="panel">
								<div className="panel-header col-sm-12 col-md-12 col-lg-12">
								Your Trips
								</div>
							</div>
							<table className="table">
								<tbody>
									<tr>
										<th>Name</th>
										<th>Dates</th>
									</tr>
									{this.props.tripList.map(function(trip, index) {
										return (
											<tr>
												<td>
													<a href={"/trips/" + trip.id} target="_blank">{trip.title}</a>
												</td>
												<td>{(trip.startDate) ? trip.startDate : ""} &#8211; {(trip.endDate) ? trip.endDate : ""}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ModalsView;