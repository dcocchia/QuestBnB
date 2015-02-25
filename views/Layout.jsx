var React = require('react');

var Layout = React.createClass({
	render: function() {
		return (
			<html lang="eng">
				<head>
					<meta charSet="UTF-8"/>
					<title>{this.props.title}</title>
					<link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
				</head>
				<body>
					{this.props.body}
					<script src="/libraries.js"></script>
					<script src="/app/app.js"></script>
				</body>
			</html>
		)
	}
});

module.exports = Layout;