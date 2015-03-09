var React = require('react');

var Stylesheet = React.createClass({
	render: function(){
		return <link href={this.props.src} rel="stylesheet"/>;
	}
});

var Script = React.createClass({
	render: function(){
		return <script src={this.props.src}/>;
	}
});

var Map = React.createClass({
	render: function() {
		return (
			<div className={this.props.mapStyleClasses}>
				<div id="goog_map"></div>
			</div>
		)
	}
});

var Layout = React.createClass({
	render: function() {
		var styleSheets = this.props.styleSheets;
		var scripts = this.props.scripts;
		return (
			<html lang="eng">
				<head>
					<meta charSet="UTF-8"/>
					<title>{this.props.title}</title>
					<link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
					<link href="/app/css/common.css" rel="stylesheet" />
					{styleSheets.map(function(sheet) {
						return <Stylesheet src={sheet} />;
					})}
				</head>
				<body>
					<div className="page-view">
						{this.props.body}
					</div>
					<Map mapStyleClasses={this.props.mapStyleClasses}/>
					<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
					<script src="/libraries.js"></script>
					<script src="/bundle.js"></script>

				</body>
			</html>
		)
	}
});

module.exports = Layout;