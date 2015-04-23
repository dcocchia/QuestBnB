var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var SearchQuery = React.createClass({
	render: function() {
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
		return (
			<div className="search-query-wrapper-inner">
				<div className="filters-section panel-body panel-light">
					<div className="row">
						<div className="col-lg-2 col-md-12">
							<label>Location</label>
						</div>
						<div className="col-lg-9">
							<div className="stop-location-title-wrapper-outter col-lg-12 col-md-12">
								<div className="stop-location-title-wrapper">
									<h3 className="stop-location-title text-ellip" contentEditable="true">{this.props.location}</h3>
									<span className="clear"></span>
									<div className={hasPredictions ? "locations-menu" : "locations-menu hide"} id="locations-menu" aria-expanded={hasPredictions.toString()} aria-role="listbox">
										<LocationsMenu predictions={queryPredictions} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="filters-section panel-body panel-light">
					<div className="row">
						<div className="col-lg-2 col-md-12">
							<label>Dates</label>
						</div>
						<div className="col-lg-9">
							<div className="date-input-wrapper col-lg-6 col-md-6">
								<input type="text" name="startDate" className="start date form-control" placeholder="Check In" aria-label="date start" defaultValue={this.props.start}/>
							</div>
							<div className="date-input-wrapper col-lg-6 col-md-6">
								<input type="text" name="endDate" className="end date form-control" placeholder="Check Out" aria-label="date end" defaultValue={this.props.end}/>
							</div>
						</div>
					</div>
				</div>
				<div className="filters-section panel-body panel-light">
					<div className="row">
						<div className="col-lg-2 col-md-12">
							<label>Price Range</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SearchQuery;