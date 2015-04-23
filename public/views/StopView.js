var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SeachResults');

var StopView = React.createClass({displayName: "StopView",
	render: function() {
		var lodgingData = this.props.lodgingData || {};
		var results = lodgingData.result || [];
		var locationProps = ( this.props.locationProps || {} );

		return (
			React.createElement("div", {className: "stop-page"}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", role: "textbox"}, this.props.tripTitle, " – Stop ", this.props.stopNum), 
						React.createElement("div", {className: "search-query-wrapper"}, 
							React.createElement(SearchQuery, {locationProps: this.props.locationProps, location: this.props.location})
						), 
						React.createElement("div", {className: "search-results-wrapper left-full-width"}, 
							React.createElement(SeachResults, {results: results}), 
							React.createElement("div", {className: "results-data"}, React.createElement("span", {"data-result-data": JSON.stringify(results)}))
						)
					)
				)
			)
		)
	}
});

module.exports = StopView;