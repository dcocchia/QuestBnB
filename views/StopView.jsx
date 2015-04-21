var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var Result = React.createClass({
	render: function() {
		return (
			<li className="lodging-result col-sm-12 col-md-6">
			</li>
		);
	}
});

var StopView = React.createClass({
	render: function() {
		var results = this.props.results || [];
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
		return (
			<div className="stop-page">
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" role="textbox">{this.props.tripTitle} &#8211; Stop {this.props.stopNum}</h1>
						<div className="search-query-wrapper">
							<div className="filters-section panel-body panel-light">
								<div className="row">
									<div className="col-lg-2 col-md-12">
										<label>Location</label>
									</div>
									<div className="col-lg-9">
										<div className="col-lg-12 col-md-12">
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
						<div className="search-results-wrapper left-full-width">
							<ol className="search-results left-full-width">
								{results.map(function(result, index) {
									return <Result result={result} key={index}/>
								})}
							</ol>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = StopView;