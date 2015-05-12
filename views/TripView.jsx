var React 			= require('react');
var LocationsMenu 	= require('./LocationsMenu');
var ChosenLodging 	= require('./ChosenLodging');
var moment 			= require('moment');
var _ 				= require('lodash');
require('moment-duration-format');

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
				<h3><i className={this.props.icon}></i> {this.props.text}</h3>
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
		var checkout = this.props.checkout || "";
		var checkin = this.props.checkin || "";
		var photos = lodging.photos || [];
		var mainPhoto = photos[0] || { medium: "", caption: ""};
		var isHome = (lodging && lodging.id === "quest_home") ? true : false;
		var lodgingElm, bookingStatusElm, stopUrl;

		if (checkout !== "") { checkout = moment(checkout).format("MMM Do"); }
		if (checkin !== "") { checkin = moment(checkin).format("MMM Do"); }

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
				case "expired":
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
						<div className="lodging-img-wrapper col-sm-5 col-m-5 col-lg-5">
							<img src={mainPhoto.medium} alt={mainPhoto.caption} className="absolute-center"/>
						</div>
						<div className="lodging-post-card-text col-sm-7 col-m-7 col-lg-7">
							<h4 className="text-ellip">{heading}</h4>
							<p className="text-ellip">$999.99</p>
							<p className="text-ellip">{checkin}</p>
							<p className="en-dash">&#8211;</p>
							<p className="text-ellip">{checkout}</p>
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

var StopHead = React.createClass({
	render: function() {
		var data = this.props.data || {};
		var lodging = data.lodging || {};
		var distance = data.distance || {};
		var duration = data.duration || {};
		var cost = data.cost || {};
		var locationProps = ( this.props.locationProps || {} );
		var queryPredictions = ( locationProps.queryPredictions || [] ); 
		var stopProps = ( this.props.stopProps || {} );
		var isHome = (lodging.id === "quest_home") ? true : false;
		var hasPredictions = queryPredictions.length > 0 && stopProps._id === data._id;
		var checkin = data.checkin;
		var checkout = data.checkout;
		var lodgingInfoWrapper = <span></span>;
		var distanceInfoWrapper = <span></span>;
		var costInfoWrapper = <span></span>;

		//distance info
		if (!isHome && !_.isEmpty(data.location)) {
			distanceInfoWrapper = (
				<div className='distance-info-wrapper col-lg-4 col-md-4 col-sm-4 col-xs-12'>
					<label>Distance</label>
					<h4 title="leg distance"><i className="fa fa-car"></i> {distance.text}</h4>
					<h4 title="leg duration"><i className="fa fa-clock-o"></i> {duration.text}</h4>
				</div>
			)
		}

		//lodging info
		if (checkin || checkout) {
			lodgingInfoWrapper = (
				<div className="lodging-info-wrapper col-lg-4 col-md-4 col-sm-4 col-xs-12">
					<label>Lodging</label>
					<h4 title="checkin/checkout times"><i className="fa fa-home"></i> {data.checkin} &ndash; {data.checkout}</h4>
				</div>
			)
		}

		//cost info
		if (!_.isEmpty(lodging) && (checkout && checkout)) {
			costInfoWrapper = (
				<div className='cost-info-wrapper col-lg-4 col-md-4 col-sm-4 col-xs-12'>
					<label>Cost</label>
					<h4 title="driving cost"><i className="fa fa-tachometer"></i> ${cost.travelCost}</h4>
					<h4 title="lodging cost"><i className="fa fa-home"></i> ${cost.lodgingCost}</h4>
					<h4 title="total cost"><i className="fa fa-money"></i> ${cost.totalCost}</h4>
				</div>
			)
		}

		return (
			<div className="stop-head col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="stop-num-wrapper col-xs-1 col-sm-1 col-md-2 col-lg-1">
					<span className="stop-num">{data.stopNum}</span>
				</div>
				<div className="stop-location-title-wrapper col-xs-11 col-sm-11 col-md-10 col-lg-11">
					<h2 className="stop-location-title text-ellip" contentEditable="true">{data.location}</h2>
					<span className="clear"></span>
					<div className={hasPredictions ? "locations-menu" : "locations-menu hide"} id="locations-menu" aria-expanded={hasPredictions.toString()} aria-role="listbox">
						<LocationsMenu predictions={queryPredictions} />
					</div>
				</div>
				{distanceInfoWrapper}
				{lodgingInfoWrapper}
				{costInfoWrapper}
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
		var stopClasses;

		return (
			<div className="trip-page" data-trip-id={tripId}>
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" contentEditable="true" role="textbox">{this.props.title}</h1>
						<div className="stops left-full-width">
							<ol className="left-full-width">
							{stops.map(function(stop, index) {
								stopClasses = "stop clear-fix";
								if (stop.isNew) { stopClasses += " new"; }
								if (_.isEmpty(stop.location)) { stopClasses += " no-location"; }
								if (stop.lodging && stop.lodging.id === "quest_home") { stopClasses += " home"; }
								if (stop.isRemoving) { stopClasses += " removing"; }
								return (
									<li className={stopClasses} data-stop-id={stop._id} data-stop-index={index}>
										<div className="remove" role="button" aria-label="remove stop" title="Remove stop"></div>
										<StopHead data={stop} stopProps={stopProps} locationProps={locationProps} key={stop._id}/>
										<ChosenLodging key={index} data={stop.lodging} photoSize={'large'} tripId={tripId} stopId={stop._id} renderStatusLinks={true} location={stop.location} isTripView={true} />
										<div className="add-stop-btn-wrapper">
											<i className={(canAddStop) ? "fa fa-plus-square-o" : "fa fa-plus-square-o hide"}></i>
											<button className={(canAddStop) ? "add-stop-btn absolute-center" : "add-stop-btn absolute-center hide"}>Add Stop &#43;</button>
										</div>
									</li>
								)
							})}
							</ol>
						</div>
						<div className="trip-blurbs left-full-width">
							<TripBlurb icon={"fa fa-clock-o"} text={this.props.tripDuration} editable={false}/>
							<TripBlurb icon={"fa fa-car"} text={this.props.tripDistance  + " miles"} editable={false}/>
							<TripBlurb icon={"fa fa-map-marker"} text={this.props.numStops + " destinations"} editable={false}/>
							<TripBlurb icon={"fa fa-money"} text={"$" + this.props.cost} editable={true} data={this.props}/>
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