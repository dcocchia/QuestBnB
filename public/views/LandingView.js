var React = require('react');

var LandingView = React.createClass({displayName: "LandingView",
	render: function() {
		return (
			React.createElement("div", {className: "landing-page"}, 
				React.createElement("div", {className: "search-area col-sm-12"}, 
					React.createElement("h1", {className: "title"}, this.props.title), 
					React.createElement("div", {className: "search-box col-12"}, 
						React.createElement("form", null, 
							React.createElement("div", {className: "input-wrapper"}, 
								React.createElement("input", {className: "form-control location", type: "text", placeholder: "Where are you going?"}), 
								React.createElement("input", {className: "form-control date start", type: "text", placeholder: "Leaving", "data-calendar": "start"}), 
								React.createElement("input", {className: "form-control date end", type: "text", placeholder: "Returning", "data-calendar": "end"}), 
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
							React.createElement("button", {type: "submit", className: "submit form-inline btn btn-primary btn-large"}, "Search")
						)
					)
				), 
				
				React.createElement("div", {className: "map"}, 
					React.createElement("iframe", {width: "100%", height: "100%", frameborder: "0", src: "https://www.google.com/maps/embed/v1/view?zoom=5&center=38%2C-97&key=AIzaSyAPMAgMJTJlHowEL_-ns7OZIjXrbEb9pCI"})
				)
			)
		)
	}
});

module.exports = LandingView;