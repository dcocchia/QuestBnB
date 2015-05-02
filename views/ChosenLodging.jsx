var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var Status = React.createClass({
	render: function() {
		var bookingStatusElm;
		var bookingStatus = this.props.bookingStatus;

		switch(bookingStatus) {
				case "pending":
					bookingStatusElm = (
						<div className="chosen lodging-booking-status pending">
							Pending host approval
						</div>
					);
					break;
				case "approved":
					bookingStatusElm = (
						<div className="chosen lodging-booking-status approved">
							Approved
						</div>
					);
					break;
				case "declined":
					bookingStatusElm = (
						<div className="chosen lodging-booking-status declined">
							Declined
						</div>
					);
					break;
				case "expired":
					bookingStatusElm = (
						<div className="chosen lodging-booking-status declined">
							Request Expired
						</div>
					);
					break;
				default: 
					bookingStatusElm = (
						<span></span>
					)
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
		var photoSource = (data.photos[activePhotoIndex]) ? data.photos[activePhotoIndex].medium : "";
		var altTxt = (data.photos[0]) ? data.photos[0].caption : ""
		var bookingStatus = data.bookingStatus || false;
		var showStatusMenu = data.showStatusMenu || false;
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

		if (_.isEmpty(data)) { return; }
		return (
			<div className="lodging-chosen col-md-12 col-sm-12" data-id={data.id}>
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
					<Status bookingStatus={bookingStatus} />
					<div className={(!showStatusMenu) ? "booking-satus-menu hidden" : "booking-satus-menu"} aria-hidden={!!showStatusMenu}>
						<StatusMenu />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ChosenLodging;