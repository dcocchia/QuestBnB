var _ = require('lodash');
var React = require('react');
var Stars = require('./Stars');

var ChosenLodging = React.createClass({
	render: function() {
		var data = this.props.data || {};
		var photos = data.photos || [];
		var activePhotoIndex = data.activePhotoIndex || 0;
		var photoSource = (data.photos[activePhotoIndex]) ? data.photos[activePhotoIndex].medium : "";
		var altTxt = (data.photos[0]) ? data.photos[0].caption : "";
		var photoBtns = function() {
			if (photos.length > 1) {
				return (
					<div className="photo-btns-wrapper">
						<div className="next-photo" role="button" aria-label="next photo"></div>
						<div className="prev-photo" role="button" aria-label="previous photo"></div>
					</div>
				)
			} else {
				return undefined;
			}
		}();
		
		if (_.isEmpty(data)) { return; }
		return (
			<div className="lodging-chosen col-md-12 col-sm-12" data-id={data.id}>
				<div className="col-md-6 col-sm-12">
					<div className="result-img img-wrapper">
						<div className="result-price">
							<h6><span className="dollar">$</span>{data.price.nightly}</h6>
						</div>
						<img className="center" src={photoSource}  alt={altTxt}/>
						{photoBtns}
					</div>
				</div>
				<div className="result-body col-md-6 col-sm-12">
					<h3 className="text-ellip">{data.attr.heading}</h3>
					<div className="result-info text-muted text-ellip">
						<span>{data.attr.roomType.text} &middot; </span>
						<div className="star-rating">
							<Stars rating={data.reviews.rating}/> &middot; <span>{data.reviews.count} reviews</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ChosenLodging;