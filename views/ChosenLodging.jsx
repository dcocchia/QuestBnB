var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var Status = React.createClass({
	buildStatus: function(opts) {
		var defaults = {
			statusClass: "pending",
			renderLinks: false,
			text: "Pending host approval",
			tripId: "",
			stopId: ""
		}

		if (!opts) { opts = {}; }

		_.defaults(opts, defaults);

		if (opts.renderLinks) {
			return (
				<div className={"lodging-booking-status " + opts.statusClass } role="button">
					<a href={"/trips/" + opts.tripId + "/stops/" + opts.stopId}>{opts.text} &gt;</a>
				</div>
			)
		} else {
			return (
				<div className={"chosen lodging-booking-status " + opts.statusClass}>
					{opts.text}
				</div>
			)
		}
	},

	render: function() {
		var bookingStatusElm;
		var bookingStatus = this.props.bookingStatus;
		var renderStatusLinks = this.props.renderStatusLinks;
		var tripId = this.props.tripId;
		var stopId = this.props.stopId;

		switch(bookingStatus) {
				case "pending":
					bookingStatusElm = this.buildStatus({
						statusClass: "pending",
						renderLinks: renderStatusLinks,
						text: "Pending host approval",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "approved":
					bookingStatusElm = this.buildStatus({
						statusClass: "approved",
						renderLinks: renderStatusLinks,
						text: "Approved",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "declined":
					bookingStatusElm = this.buildStatus({
						statusClass: "declined",
						renderLinks: renderStatusLinks,
						text: "Declined",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "expired":
					bookingStatusElm = this.buildStatus({
						statusClass: "declined",
						renderLinks: renderStatusLinks,
						text: "Request Expired",
						tripId: tripId,
						stopId: stopId
					});
					break;
				case "no_status":
					bookingStatusElm = this.buildStatus({
						statusClass: "",
						renderLinks: renderStatusLinks,
						text: "Find a place",
						tripId: tripId,
						stopId: stopId
					});
					break;
				default: 
					bookingStatusElm = this.buildStatus({
						statusClass: "",
						renderLinks: renderStatusLinks,
						text: "Find a place",
						tripId: tripId,
						stopId: stopId
					});
					break;
			}
		return bookingStatusElm;
	}
});

var StatusMenu = React.createClass({
	render: function() {
		return (
			<div className="lodging-booking-status-inner">
				<h4>Set status</h4>
				<div className="set-chosen lodging-booking-status pending" role="button" data-status="pending">
					Pending host approval
				</div>
				<div className="set-chosen lodging-booking-status approved" role="button" data-status="approved">
					Approved
				</div>
				<div className="set-chosen lodging-booking-status declined" role="button" data-status="declined">
					Declined
				</div>
				<div className="set-chosen lodging-booking-status declined" role="button" data-status="expired">
					Request Expired
				</div>
				<p>*Since this site is partially fake, booking is not actually possible. Please see "what is this?" section of the navigation menu for more information.</p>
			</div>
		);
	}
});

var ChosenLodging = React.createClass({
	render: function() {
		var data = this.props.data || {};
		var attr = data.attr || {};
		var photos = data.photos || [];
		var activePhotoIndex = data.activePhotoIndex || 0;
		var photoSize = this.props.photoSize || 'medium';
		var renderStatusLinks = this.props.renderStatusLinks || false;
		var tripId = this.props.tripId;
		var stopId = this.props.stopId;
		var photoSource = (photos[activePhotoIndex]) ? photos[activePhotoIndex][photoSize] : "";
		var altTxt = (photos[0]) ? photos[0].caption : ""
		var bookingStatus = data.bookingStatus || false;
		var showStatusMenu = data.showStatusMenu || false;
		var isHome = (data.id === "quest_home") ? true : false;
		var noLodging = (_.isEmpty(data) || data.id === "default") ? true : false;
		var isTripView = this.props.isTripView || false;
		var photoBtns = function() {
			if (photos.length > 1) {
				return (
					<div className="photo-btns-wrapper">
						<div className="next-photo" role="button" aria-label="next photo"></div>
						<div className="prev-photo" role="button" aria-label="previous photo"></div>
					</div>
				)
			} else {
				return undefined;
			}
		}();
		var removeBtn = function() {
			if (isTripView) { return <span></span> }

			return(
				<div className="remove" role="button" aria-label="cancel and remove lodging" title="Cancel and remove lodging"></div>
			)
		}();

		if (noLodging && isTripView && !_.isEmpty(this.props.location)) { 
			return (
				<div className="lodging-chosen no-lodging col-md-12 col-sm-12" data-id={data.id}>
					<div className="col-md-6 col-sm-12">
						<div className="result-img img-wrapper">
							<i className="fa fa-home"></i>
						</div>
					</div>
					<div className="result-body col-md-6 col-sm-12">
						<h3>Need a place to stay in {this.props.location}?</h3>
						<Status bookingStatus={bookingStatus} renderStatusLinks={renderStatusLinks} tripId={tripId} stopId={stopId}/>
					</div>
				</div>
			)
		}

		if ((noLodging && !isTripView) || ( noLodging  && _.isEmpty(this.props.location))) { return <span></span>; }

		if (isHome) {
			return (
				<div className="lodging-chosen home col-md-12 col-sm-12" data-id={data.id}>
					<div className="col-md-12 col-sm-12">
						<div className="result-img img-wrapper">
							<img className="center" src="/app/img/map-pin-home-icon-medium.png"  alt="home"/>
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className="lodging-chosen col-md-12 col-sm-12" data-id={data.id}>
				{removeBtn}
				<div className="col-md-6 col-sm-12">
					<div className="result-img img-wrapper">
						<div className="result-price">
							<h6><span className="dollar">$</span>{data.price.nightly}</h6>
						</div>
						<img className="center" src={photoSource}  alt={altTxt}/>
						{photoBtns}
					</div>
				</div>
				<div className="result-body col-md-6 col-sm-12">
					<h3 className="text-ellip">{attr.heading}</h3>
					<div className="result-info text-muted text-ellip">
						<span>{attr.roomType.text} &middot; </span>
						<div className="star-rating">
							<Stars rating={data.reviews.rating}/> &middot; <span>{data.reviews.count} reviews</span>
						</div>
					</div>
					<p>{attr.shortDesc}</p>
					<Status bookingStatus={bookingStatus} renderStatusLinks={renderStatusLinks} tripId={tripId} stopId={stopId}/>
					<div className={(!showStatusMenu) ? "booking-satus-menu hidden" : "booking-satus-menu"} aria-hidden={!!showStatusMenu}>
						<StatusMenu />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ChosenLodging;