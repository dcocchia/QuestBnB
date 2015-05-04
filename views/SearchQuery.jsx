var React = require('react');
var ReactSlider = require('react-slider');
var LocationsMenu = require('./LocationsMenu');
var _ = require('lodash');

var SearchQuery = React.createClass({
	_updateModelDebounced: _.debounce( _.bind( function(value) {
		Backbone.trigger("slider:update", value);
	}, this), 500),

	getInitialState: function() {
		return { 
			sliderMin: 0,
			sliderMax: 1000
		}
	},

	onSliderChange: function(value) {
		this.setState({ 
			sliderMin: value[0],
			sliderMax: value[1]
		});

		if (!Backbone) { return; }

		this._updateModelDebounced(value);
	},

	render: function() {
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] );
		var hasPredictions = ( queryPredictions.length > 0 );
		var sliderMin = this.state.sliderMin || 0;
		var sliderMax = this.state.sliderMax || 1000;

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
						<div className="col-lg-9">
							<div className="col-lg-12 col-md-12">
								<ReactSlider defaultValue={[0, 1000]} max={1000} min={0} withBars onChange={this.onSliderChange} />
							</div>
						</div>
						<div className="col-lg-12 col-md-12">
							<div className="col-lg-6 col-md-6">
								<label>${sliderMin}</label>
							</div>
							<div className="col-lg-6 col-md-6 text-right">
								<label>${sliderMax}</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SearchQuery;