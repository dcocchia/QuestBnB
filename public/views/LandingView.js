var React = require('react');

var LandingView = React.createClass({displayName: "LandingView",
	render: function() {
		return (
			React.createElement("div", {className: "landing-page"}, 
				React.createElement("div", {className: "search-area col-sm-12"}, 
					React.createElement("h1", {className: "title"}, "Find Your Adventure"), 
					React.createElement("div", {className: "search-box col-12"}, 
						React.createElement("form", {className: "search-form"}, 
							React.createElement("div", {className: "input-wrapper"}, 
								React.createElement("input", {className: "form-control location", type: "text", autoFocus: true, placeholder: "Where are you going?", name: "location"}), 
								React.createElement("input", {className: "form-control date start", type: "text", placeholder: "Leaving", "data-calendar": "start", name: "start"}), 
								React.createElement("input", {className: "form-control date end", type: "text", placeholder: "Returning", "data-calendar": "end", name: "end"}), 
								React.createElement("div", {className: "select"}, 
									React.createElement("select", {className: "form-control travellers", name: "travellers"}, 
										React.createElement("option", {value: "1"}, "1 Travellers"), 
										React.createElement("option", {value: "2"}, "2 Travellers"), 
										React.createElement("option", {value: "3"}, "3 Travellers"), 
										React.createElement("option", {value: "4"}, "4 Travellers"), 
										React.createElement("option", {value: "5"}, "5 Travellers"), 
										React.createElement("option", {value: "6"}, "6 Travellers"), 
										React.createElement("option", {value: "7"}, "7 Travellers"), 
										React.createElement("option", {value: "7"}, "8 Travellers")
									)
								), 
								React.createElement("div", {className: "locations-menu hide", id: "locations-menu", "aria-expanded": "false", "aria-role": "listbox"})
							), 
							React.createElement("button", {type: "submit", className: "search-btn submit form-inline btn btn-primary btn-large"}, "Search")
						)
					)
				)
			)
		)
	}
});

module.exports = LandingView;