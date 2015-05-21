var React 		= require('react');
var TripList 	= require('./TripList');

var ModalsView = React.createClass({displayName: "ModalsView",
	render: function() {
		var tripList = this.props.tripList || [];

		return (
			React.createElement("div", {className: "modals-inner-wrapper"}, 
				React.createElement("div", {className: "nav-modal-explain modal fade", "aria-hidden": "true"}, 
					React.createElement("div", {className: "modal-dialog"}, 
						React.createElement("div", {className: "modal-content"}, 
							React.createElement("button", {type: "button", className: "close btn", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
							React.createElement("div", {className: "panel"}, 
								React.createElement("div", {className: "panel-header col-sm-12 col-md-12 col-lg-12"}, 
								"What is this?"
								)
							), 
							React.createElement("p", {className: "explain-txt"}, 
								"Good question! This is a project created entirely by Dominic Cocchiarella. It is an experiment both in technologies (React server and client) and as a job application to AirBnB. Hopefully if you’ve landed here, you work there and are happily amazed!"
							), 
							React.createElement("p", {className: "explain-txt"}, "The source code is entirely ", React.createElement("a", {href: "https://github.com/dcocchia/QuestBnB", target: "_blank"}, "available on GitHub"), "! Feel free to pull it down and play around with it."), 
							React.createElement("p", {className: "explain-txt"}, React.createElement("strong", null, "Things to be aware of")), 
							React.createElement("ul", null, 
								React.createElement("li", null, "While I hope you enjoy the site, it is not meant to be used publicly. Because of this, ", React.createElement("strong", null, "there is no way to actually book AirBnB rooms through the site"), ". You can manually change the booking status, but no booking actually occurs with AirBnB."), 
								React.createElement("li", null, "Listings for AirBnB lodgings are supplied by ", React.createElement("a", {href: "https://www.mashape.com/zilyo/zilyo", target: "_blank"}, "Zilyo’s open API")), 
								React.createElement("li", null, "Zilyo has ", React.createElement("a", {href: "https://www.mashape.com/zilyo/zilyo/support/8#", target: "_blank"}, "announced they are shutting down"), ", so their API could dissapear at any time. :("), 
								React.createElement("li", null, "And lastly, this site and its creator are not affiliated, associated, authorized, endorsed by, or in any way officially connected with AirBnB or any of its subsidiaries or its affiliates. The official AirBnB web site is available at ", React.createElement("a", {href: "https://www.airbnb.com", target: "_blank"}, "www.airbnb.com"), ".")
							)
						)
					)
				), 

				React.createElement("div", {className: "nav-modal-your-trips modal fade", "aria-hidden": "true"}, 
					React.createElement("div", {className: "modal-dialog"}, 
						React.createElement("div", {className: "modal-content"}, 
							React.createElement("button", {type: "button", className: "close btn", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
							React.createElement("div", {className: "panel"}, 
								React.createElement("div", {className: "panel-header col-sm-12 col-md-12 col-lg-12"}, 
								"Your Trips"
								)
							), 
							React.createElement("table", {className: "table trip-list-table"}, 
								React.createElement("thead", null, 
									React.createElement("tr", null, 
										React.createElement("th", null, "Name"), 
										React.createElement("th", null, "Dates")
									)
								), 
								React.createElement(TripList, {tripList: tripList})	
							)
						)
					)
				)
			)
		)
	}
});

module.exports = ModalsView;