var React = require('react');

var LandingView = React.createClass({
	render: function() {
		return (
			<div className="landing-page">
				<div className="search-area col-sm-12">
					<h1 className="title">Find Your Adventure</h1>
					<div className="search-box col-12">
						<form className="search-form">
							<div className="input-wrapper">
								<input className="form-control location" type="text" autoFocus placeholder="Where are you going?" name="location"/>
								<input className="form-control date start" type="text" placeholder="Leaving" data-calendar="start" name="start"/>
								<input className="form-control date end" type="text" placeholder="Returning" data-calendar="end" name="end"/>
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
							<button type="submit" className="search-btn submit form-inline btn btn-primary btn-large">Search</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = LandingView;