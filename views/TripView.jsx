var React = require('react');
var LocationsMenu = require('./LocationsMenu');

var Stop = React.createClass({
	render: function() {
		var data = this.props.data;
		var isNew = data.isNew;
		var index = this.props.index;
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] ); 
		var stopProps = ( this.props.stopProps || {} );
		var hasPredictions = queryPredictions.length > 0 && stopProps._id === data._id;
		var distance = (data.distance && data.distance.text || (data.distance = { text: "0" }));
		var totals = ( data.totals || {} );
		var canAddStop = this.props.canAddStop;

		return (
			<li className={isNew ? "stop new left-full-width" : "stop left-full-width" } data-stop-id={data._id} data-stop-index={index} key={data._id}>
				<div className="remove" role="button" aria-label="remove stop"></div>
				<div className="stop-bar left-full-height">
					<button className={(canAddStop) ? "add-stop-btn" : "add-stop-btn hide"}>&#43;</button>
				</div>
				<div className="stop-num-wrapper left-full-height">
					<div className="stop-num center">{data.stopNum}</div>
				</div>
				<div className="stop-info left-full-height">
					<div className="stop-place-info left-full-height">
						<div className="stop-location-title-wrapper">
							<h3 className="stop-location-title" contentEditable="true">{data.location}</h3>
							<span className="clear"></span>
							<div className={hasPredictions ? "locations-menu" : "locations-menu hide"} id="locations-menu" aria-expanded={hasPredictions.toString()} aria-role="listbox">
								<LocationsMenu predictions={queryPredictions} />
							</div>
						</div>
						<p>Day {data.dayNum}</p>
						<p>From last {data.distance.text}</p>
						<p>Total distance {(totals.distance && totals.distance.text) ? totals.distance.text : "0 mi"}</p>
					</div>
				</div>
				<div className="stop-lodging left-full-height">

				</div>
			</li>
		)
	}
});

var Drawer = React.createClass({
	render: function() {
		var data = this.props.data;
		return (
			<div className="drawer">
				<div className="inner">
					<div className="form-group">
						<label for="mpg">MPG</label>
						<input type="number" min="0" step="1" id="mpg" name="mpg" className="mpg form-control" placeholder="MPG" value={data.mpg}/>
					</div>
					
					<div className="form-group">
						<label for="gasPrice">Gas Price</label>
						<input type="number" min="0" step="0.5" id="gasPrice" name="gasPrice" className="gas-price form-control" placeholder="Gas Price" value={data.gasPrice}/>
					</div>
				</div>
			</div>
		)
	}
});

var TripBlurb = React.createClass({
	render: function() {
		var drawer = (this.props.editable) ? <Drawer data={this.props.data}/> : undefined;
		return (
			<div className={(this.props.editable) ? "trip-blurb editable" : "trip-blurb"}>
				<h3>{this.props.text}</h3>
				{drawer}
			</div>
		)
	}
});

var Traveller = React.createClass({
	render: function() {
		var traveller = this.props.traveller;
		return (
			<div className="traveller" key={this.props.key}>
				<div className="profile-pic-wrapper img-wrapper">
					<img src={traveller && traveller.img && traveller.img.src ? traveller.img.src : ''} className="center"/>
				</div>
				<p className="name">{traveller.name}</p>
				<p>{traveller.bio}</p>
			</div>
		)
	}
});

var TripView = React.createClass({
	render: function() {
		var stops = this.props.stops;
		var canAddStop = (this.props.stops.length >= 10) ? false : true; 
		var locationProps = this.props.location_props;
		var stopProps = this.props.stop_props;
		var travellers = this.props.travellers;
		var slideInBottom = this.props.slideInBottom;

		return (
			<div className="trip-page" data-trip-id={this.props._id}>
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" contentEditable="true">{this.props.title}</h1>
						<div className="stops left-full-width">
							<ol className="left-full-width">
							{stops.map(function(stop, index) {
								return <Stop data={stop} index={index} locationProps={locationProps} stopProps={stopProps} canAddStop={canAddStop} key={index}/>;
							})}
							</ol>
						</div>
						<div className="trip-blurbs left-full-width">
							<TripBlurb text={this.props.tripDuration} editable={false}/>
							<TripBlurb text={this.props.tripDistance  + " miles"} editable={false}/>
							<TripBlurb text={this.props.numStops + " destinations"} editable={false}/>
							<TripBlurb text={"$" + this.props.cost} editable={true} data={this.props}/>
						</div>
					</div>
				</div>
				<div className="bottom-bar panel slide-in">
					<div className="travellers">
						<div className="trip-traveller-text">Travellers</div>
						<button className="add-traveller">&#43;</button>
						<div className="travellers-wrapper">
							{travellers.map(function(traveller, index) {
								return <Traveller traveller={traveller} key={index}/>
							})}
						</div>
					</div>
					<div className="trip-dates-wrapper search-box">
						<input type="text" name="startDate" className="date form-control" placeholder="Leaving" value={this.props.start}/>
						<input type="text" name="endDate" className="date form-control" placeholder="Returning" value={this.props.end}/>
						<button className="submit form-control btn btn-primary">Done</button>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = TripView;