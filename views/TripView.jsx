var React = require('react');

var Stop = React.createClass({
	render: function() {
		var data = this.props.data;
		return (
			<li className="stop" data-stop-id={data._id}>
				<div className="stops-bar"></div>
				<div className="stop-info">
					<div className="stop-num">{data.stopNum}</div>
					<div className="stop-place-info">
						<h3>{data.location}</h3>
						<p>Day {data.dayNum}</p>
						<p>{data.milesNum} miles</p>
					</div>
				</div>
				<div className="stop-lodging">

				</div>
			</li>
		)
	}
});

var TripBlurb = React.createClass({
	render: function() {
		return (
			<div className="trip-blurb">
				{this.props.text}
			</div>
		)
	}
});

var Traveller = React.createClass({
	render: function() {
		var traveller = this.props.traveller;
		return (
			<div className="traveller">
				<div className="profile-pic-wrapper img-wrapper">
					<img src={traveller && traveller.img && traveller.img.src ? traveller.img.src : ''} className="center"/>
				</div>
				<p className="name">{traveller.name}</p>
				<p>{traveller.bio}</p>
			</div>
		)
	}
});

var TripView = React.createClass({
	render: function() {
		var stops = this.props.stops;
		var travellers = this.props.travellers;

		return (
			<div className="trip-page">
				<div className="side-bar panel">
					<h1>{this.props.title}</h1>
					<div className="stops">
						<ol>
						{stops.map(function(stop) {
							return <Stop data={stop}/>;
						})}
						</ol>
					</div>
					<div className="trip-blurbs">
						<TripBlurb text={this.props.tripLength + " days"} />
						<TripBlurb text={this.props.tripDistance  + " miles"} />
						<TripBlurb text={this.props.numStops + " stops"}/>
						<TripBlurb text={"$" + this.props.cost} />
					</div>
				</div>
				<div className="bottom-bar panel">
					<div className="travellers">
						<div className="trip-traveller-text">Travellers</div>
						<button className="add-traveller">&#43;</button>
						<div className="travellers-wrapper">
							{travellers.map(function(traveller) {
								return <Traveller traveller={traveller} />
							})}
						</div>
					</div>
					<div className="trip-dates-wrapper search-box">
						<input type="text" name="startDate" className="date form-control" placeholder="Leaving" value={this.props.start}/>
						<input type="text" name="endDate" className="date form-control" placeholder="Returning" value={this.props.end}/>
						<button className="submit form-control btn btn-primary">Done</button>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = TripView;