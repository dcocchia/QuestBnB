var React = require('react');

var Stop = React.createClass({
	render: function() {
		var data = this.props.data;
		var isNew = data.isNew;
		var index = this.props.index;
		return (
			<li className={isNew ? "stop new left-full-width" : "stop left-full-width" } data-stop-id={data._id} data-stop-index={index} key={data._id}>
				<div className="stop-bar left-full-height">
					<button className="add-stop-btn">&#43;</button>
				</div>
				<div className="stop-num-wrapper left-full-height">
					<div className="stop-num center">{data.stopNum}</div>
				</div>
				<div className="stop-info left-full-height">
					<div className="stop-place-info left-full-height">
						<div className="stop-location-title-wrapper">
							<h3 className="stop-location-title" contentEditable="true">{data.location}</h3>
							<span className="clear"></span>
						</div>
						<p>Day {data.dayNum}</p>
						<p>{data.milesNum} miles</p>
					</div>
				</div>
				<div className="stop-lodging left-full-height">

				</div>
			</li>
		)
	}
});

var TripBlurb = React.createClass({
	render: function() {
		return (
			<div className="trip-blurb">
				<h3>{this.props.text}</h3>
			</div>
		)
	}
});

var Traveller = React.createClass({
	render: function() {
		var traveller = this.props.traveller;
		return (
			<div className="traveller" key={this.props.key}>
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
			<div className="trip-page" data-trip-id={this.props._id}>
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" contentEditable="true">{this.props.title}</h1>
						<div className="stops left-full-width">
							<ol className="left-full-width">
							{stops.map(function(stop, index) {
								return <Stop data={stop} index = {index} key={index}/>;
							})}
							</ol>
						</div>
						<div className="trip-blurbs left-full-width">
							<TripBlurb text={this.props.tripLength + " days"} />
							<TripBlurb text={this.props.tripDistance  + " miles"} />
							<TripBlurb text={this.props.numStops + " stops"}/>
							<TripBlurb text={"$" + this.props.cost} />
						</div>
					</div>
				</div>
				<div className="bottom-bar panel">
					<div className="travellers">
						<div className="trip-traveller-text">Travellers</div>
						<button className="add-traveller">&#43;</button>
						<div className="travellers-wrapper">
							{travellers.map(function(traveller, index) {
								return <Traveller traveller={traveller} key={index}/>
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