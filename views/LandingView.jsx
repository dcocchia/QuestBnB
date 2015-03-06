var React = require('react');

var LandingView = React.createClass({
	render: function() {
		return (
			<div className="landing-page">
				<div className="search-area col-sm-12">
					<h1 className="title">{this.props.title}</h1>
					<div className="search-box col-12">
						<form>
							<div className="input-wrapper">
								<input className="form-control location" type="text" placeholder="Where are you going?"/>
								<input className="form-control date start" type="text" placeholder="Leaving" data-calendar="start"/>
								<input className="form-control date end" type="text" placeholder="Returning" data-calendar="end"/>
								<div className="select">
									<select className="form-control travellers" name="travellers">
										<option value="1">1 Travellers</option>
										<option value="2">2 Travellers</option>
										<option value="3">3 Travellers</option>
										<option value="4">4 Travellers</option>
										<option value="5">5 Travellers</option>
										<option value="6">6 Travellers</option>
										<option value="7">7 Travellers</option>
										<option value="7">8 Travellers</option>
									</select>
								</div>
								<div className="locations-menu hide" id="locations-menu" aria-expanded="false" aria-role="listbox"></div>
							</div>
							<button type="submit" className="submit form-inline btn btn-primary btn-large">Search</button>
						</form>
					</div>
				</div>
				
				<div className="map">
					<iframe width="100%" height="100%" frameborder="0" src="https://www.google.com/maps/embed/v1/view?zoom=5&center=38%2C-97&key=AIzaSyAPMAgMJTJlHowEL_-ns7OZIjXrbEb9pCI"></iframe>
				</div>
			</div>
		)
	}
});

module.exports = LandingView;