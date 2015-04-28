var React 			= require('react');
var LocationsMenu 	= require('./LocationsMenu');

var Stop = React.createClass({
	render: function() {
		var data = this.props.data;
		var isNew = data.isNew;
		var index = this.props.index;
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] ); 
		var stopProps = ( this.props.stopProps || {} );
		var hasPredictions = queryPredictions.length > 0 && stopProps._id === data._id;
		var distance = (data.distance && data.distance.text || (data.distance = { text: "0 mi" }));
		var totals = ( data.totals || {} );
		var canAddStop = this.props.canAddStop;

		return (
			<li className={isNew ? "stop new left-full-width" : "stop left-full-width" } data-stop-id={data._id} data-stop-index={index} key={data._id}>
				<div className="remove" role="button" aria-label="remove stop" title="Remove stop"></div>
				<div className="stop-num-wrapper left-full-height">
					<div className="stop-num center">{data.stopNum}</div>
					<button className={(canAddStop) ? "add-stop-btn" : "add-stop-btn hide"} aria-label="add stop">&#43;</button>
				</div>
				<div className="stop-info left-full-height col-lg-6 col-md-6 col-sm-5">
					<div className="stop-place-info left-full-height">
						<div className="stop-location-title-wrapper">
							<h3 className="stop-location-title text-ellip" contentEditable="true">{data.location}</h3>
							<span className="clear"></span>
							<div className={hasPredictions ? "locations-menu" : "locations-menu hide"} id="locations-menu" aria-expanded={hasPredictions.toString()} aria-role="listbox">
								<LocationsMenu predictions={queryPredictions} />
							</div>
						</div>
						<p>Day {data.dayNum}</p>
						<p>{data.distance.text}</p>
					</div>
				</div>
				<Lodging lodging={data.lodging} tripId={this.props.tripId} stopId={data._id}/>
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
					<div className="form-group col-lg-6 col-m-6 col-sm-6 col-xs-12">
						<label htmlFor="mpg">MPG</label>
						<input type="range" min="1" max="150" step="1" id="mpg" name="mpg" className="gas-slider mpg" placeholder="MPG" defaultValue={data.mpg} data-model-attr="mpg" role="slider" aria-valuenow={data.mpg} aria-valuemin="1" aria-valuemax="150" aria-valuetext="miles per gallon"/>
						<p className="mpg-label">{data.mpg} mi / Gallon</p>
					</div>
					<div className="form-group col-lg-6 col-m-6 col-sm-6 col-xs-12">
						<label htmlFor="gasPrice">Gas Price</label>
						<input type="range" min=".10" max="10.00" step=".10" id="gasPrice" name="gasPrice" className="gas-slider gas-price" placeholder="Gas Price" defaultValue={data.gasPrice} data-model-attr="gasPrice" data-to-fixed="2" role="slider" aria-valuenow={data.gasPrice} aria-valuemin="1" aria-valuemax="10.00" aria-valuetext="gas price"/>
						<p className="mpg-label">${data.gasPrice} / Gallon</p>
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
	handleChange: function(event) {
		//TODO: seems a bit hacky
		//using setState may be better here. 
		this.props.traveller.name = event.target.value;
		this.forceUpdate();
	},
	render: function() {
		var traveller = this.props.traveller;
		return (
			<div className="traveller" key={this.props.key} data-traveller-id={traveller._id}>
				<div className="profile-pic-wrapper img-wrapper">
					<img src={traveller && traveller.img && traveller.img.src ? traveller.img.src : ''} className="center" alt="traveller profile picture"/>
				</div>
				<p className="name text-ellip">{traveller.name}</p>
				<p>{traveller.bio}</p>
				<div className="edit-card" area-hidden="true">
					<form className="form-inline">
						<div className="form-group col-sm-8 col-m-8 col-lg-8">
							<input type="text" name="travellerName" className="traveller-name" placeholder="Traveller Name" value={traveller.name} onChange={this.handleChange}/>
						</div>
						 <button type="submit" className="save-traveller btn btn-primary col-sm-2 col-m-2 col-lg-2">Save</button>
						  <button type="submit" className="remove-traveller btn col-sm-2 col-m-2 col-lg-2">Remove</button>
					</form>
				</div>
			</div>
		)
	}
});

var Lodging = React.createClass({
	render: function() {
		var lodging = (this.props.lodging || {} );
		var attributes = lodging.attr || {};
		var heading = attributes.heading || "";
		var photos = lodging.photos || [];
		var mainPhoto = photos[0] || { medium: "", caption: ""};
		var isHome = (lodging && lodging.id === "quest_home") ? true : false;
		var lodgingElm, bookingStatusElm, stopUrl;

		if (!isHome) {
			stopUrl = "/trips/" + this.props.tripId + "/stops/" + this.props.stopId + "";
			switch(lodging.bookingStatus) {
				case "pending":
					bookingStatusElm = (
						<div className="lodging-booking-status pending" role="button">
							<a href={stopUrl}>Pending host approval &gt;</a>
						</div>
					);
					break;
				case "approved":
					bookingStatusElm = (
						<div className="lodging-booking-status approved" role="button">
							<a href={stopUrl}>Approved &gt;</a>
						</div>
					);
					break;
				case "declined":
					bookingStatusElm = (
						<div className="lodging-booking-status declined" role="button">
							<a href={stopUrl}>Declined &gt;</a>
						</div>
					);
					break;
				case "epired":
					bookingStatusElm = (
						<div className="lodging-booking-status declined" role="button">
							<a href={stopUrl}>Request Expired &gt;</a>
						</div>
					);
					break;
				default: 
					bookingStatusElm = (
						<div className="lodging-booking-status" role="button">
							<a href={stopUrl}>Find a place &gt;</a>
						</div>
					);
					break;
			}
		}
		
		if (isHome) {
			lodgingElm = ( 
				<div className="lodging-wrapper">
					<div className="home-img-wrapper">
						<img src="/app/img/map-pin-home-icon-medium.png" className="absolute-center"/>
					</div>
					<h4>Home</h4>
				</div>
			);
		} else {
			lodgingElm = (
				<div className="lodging-wrapper">
					<div className="lodging-post-card">
						<div className="lodging-img-wrapper col-sm-6 col-m-6 col-lg-6">
							<img src={mainPhoto.medium} alt={mainPhoto.caption} className="absolute-center"/>
						</div>
						<div className="lodging-post-card-text col-sm-6 col-m-6 col-lg-6">
							<h4 className="text-ellip">{heading}</h4>
							<p className="text-ellip">$999.99</p>
							<p className="text-ellip">March 13th</p>
							<p className="en-dash">&#8211;</p>
							<p className="text-ellip">March 31st</p>
						</div>
					</div>
					{bookingStatusElm}
				</div>
			);
		}

		return (
			<div className="stop-lodging left-full-height col-lg-5 col-md-5 col-sm-4">
				{lodgingElm}
			</div>
		)
	}
}); 

var TripView = React.createClass({
	render: function() {
		var tripId = this.props._id;
		var stops = this.props.stops;
		var canAddStop = (this.props.stops.length >= 10) ? false : true; 
		var locationProps = this.props.location_props;
		var stopProps = this.props.stop_props;
		var travellers = this.props.travellers;
		var slideInBottom = this.props.slideInBottom;

		return (
			<div className="trip-page" data-trip-id={tripId}>
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" contentEditable="true" role="textbox">{this.props.title}</h1>
						<div className="stops left-full-width">
							<ol className="left-full-width">
							{stops.map(function(stop, index) {
								return <Stop tripId={tripId} data={stop} index={index} locationProps={locationProps} stopProps={stopProps} canAddStop={canAddStop} key={index}/>;
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
						<button className="add-traveller" aria-label="add traveller">&#43;</button>
						<div className="travellers-wrapper">
							{travellers.map(function(traveller, index) {
								return <Traveller traveller={traveller} key={index}/>
							})}
						</div>
					</div>
					<div className="trip-dates-wrapper search-box">
						<input type="text" name="startDate" className="start date form-control" placeholder="Leaving" aria-label="date start" defaultValue={this.props.start}/>
						<input type="text" name="endDate" className="end date form-control" placeholder="Returning" aria-label="date end" defaultValue={this.props.end}/>
						<button className="submit form-control btn btn-primary">Done</button>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = TripView;