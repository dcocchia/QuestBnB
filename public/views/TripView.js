var React 			= require('react');
var LocationsMenu 	= require('./LocationsMenu');
var ChosenLodging = require('./ChosenLodging');
var moment 			= require('moment');
require('moment-duration-format');

// var Stop = React.createClass({
// 	render: function() {
// 		var data = this.props.data;
// 		var isNew = data.isNew;
// 		var index = this.props.index;
// 		var locationProps = ( this.props.locationProps || {} );
// 		var queryPredictions = ( locationProps.queryPredictions || [] ); 
// 		var stopProps = ( this.props.stopProps || {} );
// 		var hasPredictions = queryPredictions.length > 0 && stopProps._id === data._id;
// 		var distance = (data.distance && data.distance.text || (data.distance = { text: "0 mi" }));
// 		var totals = ( data.totals || {} );
// 		var canAddStop = this.props.canAddStop;
// 		var checkout = data.checkout || "";
// 		var checkin = data.checkin || "";

// 		return (
// 			<li className={isNew ? "stop new left-full-width" : "stop left-full-width" } data-stop-id={data._id} data-stop-index={index} key={data._id}>
// 				<div className="remove" role="button" aria-label="remove stop" title="Remove stop"></div>
// 				<div className="stop-num-wrapper left-full-height">
// 					<div className="stop-num center">{data.stopNum}</div>
// 					<button className={(canAddStop) ? "add-stop-btn" : "add-stop-btn hide"} aria-label="add stop">&#43;</button>
// 				</div>
// 				<div className="stop-info left-full-height col-lg-6 col-md-6 col-sm-5">
// 					<div className="stop-place-info left-full-height">
// 						<div className="stop-location-title-wrapper">
// 							<h3 className="stop-location-title text-ellip" contentEditable="true">{data.location}</h3>
// 							<span className="clear"></span>
// 							<div className={hasPredictions ? "locations-menu" : "locations-menu hide"} id="locations-menu" aria-expanded={hasPredictions.toString()} aria-role="listbox">
// 								<LocationsMenu predictions={queryPredictions} />
// 							</div>
// 						</div>
// 						<p>Day {data.dayNum}</p>
// 						<p>{data.distance.text}</p>
// 					</div>
// 				</div>
// 				<Lodging lodging={data.lodging} tripId={this.props.tripId} stopId={data._id} checkin={checkin} checkout={checkout}/>
// 			</li>
// 		)
// 	}
// });

var Drawer = React.createClass({displayName: "Drawer",
	render: function() {
		var data = this.props.data;
		return (
			React.createElement("div", {className: "drawer"}, 
				React.createElement("div", {className: "inner"}, 
					React.createElement("div", {className: "form-group col-lg-6 col-m-6 col-sm-6 col-xs-12"}, 
						React.createElement("label", {htmlFor: "mpg"}, "MPG"), 
						React.createElement("input", {type: "range", min: "1", max: "150", step: "1", id: "mpg", name: "mpg", className: "gas-slider mpg", placeholder: "MPG", defaultValue: data.mpg, "data-model-attr": "mpg", role: "slider", "aria-valuenow": data.mpg, "aria-valuemin": "1", "aria-valuemax": "150", "aria-valuetext": "miles per gallon"}), 
						React.createElement("p", {className: "mpg-label"}, data.mpg, " mi / Gallon")
					), 
					React.createElement("div", {className: "form-group col-lg-6 col-m-6 col-sm-6 col-xs-12"}, 
						React.createElement("label", {htmlFor: "gasPrice"}, "Gas Price"), 
						React.createElement("input", {type: "range", min: ".10", max: "10.00", step: ".10", id: "gasPrice", name: "gasPrice", className: "gas-slider gas-price", placeholder: "Gas Price", defaultValue: data.gasPrice, "data-model-attr": "gasPrice", "data-to-fixed": "2", role: "slider", "aria-valuenow": data.gasPrice, "aria-valuemin": "1", "aria-valuemax": "10.00", "aria-valuetext": "gas price"}), 
						React.createElement("p", {className: "mpg-label"}, "$", data.gasPrice, " / Gallon")
					)
				)
			)
		)
	}
});

var TripBlurb = React.createClass({displayName: "TripBlurb",
	render: function() {
		var drawer = (this.props.editable) ? React.createElement(Drawer, {data: this.props.data}) : undefined;
		return (
			React.createElement("div", {className: (this.props.editable) ? "trip-blurb editable" : "trip-blurb"}, 
				React.createElement("h3", null, this.props.text), 
				drawer
			)
		)
	}
});

var Traveller = React.createClass({displayName: "Traveller",
	handleChange: function(event) {
		//TODO: seems a bit hacky
		//using setState may be better here. 
		this.props.traveller.name = event.target.value;
		this.forceUpdate();
	},
	render: function() {
		var traveller = this.props.traveller;
		return (
			React.createElement("div", {className: "traveller", key: this.props.key, "data-traveller-id": traveller._id}, 
				React.createElement("div", {className: "profile-pic-wrapper img-wrapper"}, 
					React.createElement("img", {src: traveller && traveller.img && traveller.img.src ? traveller.img.src : '', className: "center", alt: "traveller profile picture"})
				), 
				React.createElement("p", {className: "name text-ellip"}, traveller.name), 
				React.createElement("p", null, traveller.bio), 
				React.createElement("div", {className: "edit-card", "area-hidden": "true"}, 
					React.createElement("form", {className: "form-inline"}, 
						React.createElement("div", {className: "form-group col-sm-8 col-m-8 col-lg-8"}, 
							React.createElement("input", {type: "text", name: "travellerName", className: "traveller-name", placeholder: "Traveller Name", value: traveller.name, onChange: this.handleChange})
						), 
						 React.createElement("button", {type: "submit", className: "save-traveller btn btn-primary col-sm-2 col-m-2 col-lg-2"}, "Save"), 
						  React.createElement("button", {type: "submit", className: "remove-traveller btn col-sm-2 col-m-2 col-lg-2"}, "Remove")
					)
				)
			)
		)
	}
});

var Lodging = React.createClass({displayName: "Lodging",
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
						React.createElement("div", {className: "lodging-booking-status pending", role: "button"}, 
							React.createElement("a", {href: stopUrl}, "Pending host approval >")
						)
					);
					break;
				case "approved":
					bookingStatusElm = (
						React.createElement("div", {className: "lodging-booking-status approved", role: "button"}, 
							React.createElement("a", {href: stopUrl}, "Approved >")
						)
					);
					break;
				case "declined":
					bookingStatusElm = (
						React.createElement("div", {className: "lodging-booking-status declined", role: "button"}, 
							React.createElement("a", {href: stopUrl}, "Declined >")
						)
					);
					break;
				case "expired":
					bookingStatusElm = (
						React.createElement("div", {className: "lodging-booking-status declined", role: "button"}, 
							React.createElement("a", {href: stopUrl}, "Request Expired >")
						)
					);
					break;
				default: 
					bookingStatusElm = (
						React.createElement("div", {className: "lodging-booking-status", role: "button"}, 
							React.createElement("a", {href: stopUrl}, "Find a place >")
						)
					);
					break;
			}
		}
		
		if (isHome) {
			lodgingElm = ( 
				React.createElement("div", {className: "lodging-wrapper"}, 
					React.createElement("div", {className: "home-img-wrapper"}, 
						React.createElement("img", {src: "/app/img/map-pin-home-icon-medium.png", className: "absolute-center"})
					), 
					React.createElement("h4", null, "Home")
				)
			);
		} else {
			lodgingElm = (
				React.createElement("div", {className: "lodging-wrapper"}, 
					React.createElement("div", {className: "lodging-post-card"}, 
						React.createElement("div", {className: "lodging-img-wrapper col-sm-5 col-m-5 col-lg-5"}, 
							React.createElement("img", {src: mainPhoto.medium, alt: mainPhoto.caption, className: "absolute-center"})
						), 
						React.createElement("div", {className: "lodging-post-card-text col-sm-7 col-m-7 col-lg-7"}, 
							React.createElement("h4", {className: "text-ellip"}, heading), 
							React.createElement("p", {className: "text-ellip"}, "$999.99"), 
							React.createElement("p", {className: "text-ellip"}, checkin), 
							React.createElement("p", {className: "en-dash"}, "–"), 
							React.createElement("p", {className: "text-ellip"}, checkout)
						)
					), 
					bookingStatusElm
				)
			);
		}

		return (
			React.createElement("div", {className: "stop-lodging left-full-height col-lg-5 col-md-5 col-sm-4"}, 
				lodgingElm
			)
		)
	}
}); 

var StopHead = React.createClass({displayName: "StopHead",
	render: function() {
		var data = this.props.data || {};
		var distance = data.distance || {};
		return (
			React.createElement("div", {className: "stop-head col-lg-12 col-md-12 col-sm-12 col-xs-12"}, 
				React.createElement("h2", null, React.createElement("span", {className: "stop-num"}, data.stopNum), " ", data.location), 
				React.createElement("h4", null, distance.text)
			)
		)
	}
});

var TripView = React.createClass({displayName: "TripView",
	render: function() {
		var tripId = this.props._id;
		var stops = this.props.stops;
		var canAddStop = (this.props.stops.length >= 10) ? false : true; 
		var locationProps = this.props.location_props;
		var stopProps = this.props.stop_props;
		var travellers = this.props.travellers;
		var slideInBottom = this.props.slideInBottom;


		return (
			React.createElement("div", {className: "trip-page", "data-trip-id": tripId}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", contentEditable: "true", role: "textbox"}, this.props.title), 
						React.createElement("div", {className: "stops left-full-width"}, 
							React.createElement("ol", {className: "left-full-width"}, 
							stops.map(function(stop, index) {
								return (
									React.createElement("li", {className: "stop"}, 
										React.createElement(StopHead, {data: stop}), 
										React.createElement(ChosenLodging, {key: index, data: stop.lodging, photoSize: 'large', tripId: tripId, stopId: stop._id, renderStatusLinks: true})
									)
								)
							})
							)
						), 
						React.createElement("div", {className: "trip-blurbs left-full-width"}, 
							React.createElement(TripBlurb, {text: this.props.tripDuration, editable: false}), 
							React.createElement(TripBlurb, {text: this.props.tripDistance  + " miles", editable: false}), 
							React.createElement(TripBlurb, {text: this.props.numStops + " destinations", editable: false}), 
							React.createElement(TripBlurb, {text: "$" + this.props.cost, editable: true, data: this.props})
						)
					)
				), 
				React.createElement("div", {className: "bottom-bar panel slide-in"}, 
					React.createElement("div", {className: "travellers"}, 
						React.createElement("div", {className: "trip-traveller-text"}, "Travellers"), 
						React.createElement("button", {className: "add-traveller", "aria-label": "add traveller"}, "+"), 
						React.createElement("div", {className: "travellers-wrapper"}, 
							travellers.map(function(traveller, index) {
								return React.createElement(Traveller, {traveller: traveller, key: index})
							})
						)
					), 
					React.createElement("div", {className: "trip-dates-wrapper search-box"}, 
						React.createElement("input", {type: "text", name: "startDate", className: "start date form-control", placeholder: "Leaving", "aria-label": "date start", defaultValue: this.props.start}), 
						React.createElement("input", {type: "text", name: "endDate", className: "end date form-control", placeholder: "Returning", "aria-label": "date end", defaultValue: this.props.end}), 
						React.createElement("button", {className: "submit form-control btn btn-primary"}, "Done")
					)
				)
			)
		)
	}
});

module.exports = TripView;