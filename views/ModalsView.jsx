var React 		= require('react');
var TripList 	= require('./TripList');

var ModalsView = React.createClass({
	render: function() {
		var tripList = this.props.tripList || [];

		return (
			<div className="modals-inner-wrapper">
				<div className="nav-modal-explain modal fade" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<button type="button" className="close btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<div className="panel">
								<div className="panel-header col-sm-12 col-md-12 col-lg-12">
								What is this?
								</div>
							</div>
							<p className="explain-txt">
								Good question! This is a project created entirely by Dominic Cocchiarella. It is an experiment both in technologies (React server and client) and as a job application to AirBnB. Hopefully if you’ve landed here, you work there and are happily amazed!
							</p>
							<p className="explain-txt"><strong>Things to be aware of</strong></p>
							<ul>
								<li>While I hope you enjoy the site, it is not meant to be used publicly. Because of this, <strong>there is no way to actually book AirBnB rooms through the site</strong>. You can manually change the booking status, but no booking actually occurs with AirBnB.</li>
								<li>Listings for AirBnB lodgings are supplied by <a href="https://www.mashape.com/zilyo/zilyo" target="_blank">Zilyo’s open API</a></li>
								<li>Zilyo has <a href="https://www.mashape.com/zilyo/zilyo/support/8#" target="_blank">announced they are shutting down</a>, so their API could dissapear at any time. :(</li>
								<li>And lastly, this site and its creator are not affiliated, associated, authorized, endorsed by, or in any way officially connected with AirBnB or any of its subsidiaries or its affiliates. The official AirBnB web site is available at <a href="https://www.airbnb.com" target="_blank">www.airbnb.com</a>.</li>
							</ul>
						</div>
					</div>
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
							<table className="table trip-list-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Dates</th>
									</tr>
								</thead>
								<TripList tripList={tripList}/>	
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ModalsView;