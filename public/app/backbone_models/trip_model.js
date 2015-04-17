var trip_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		tripDistance: 0,
		tripDuration: 0,
		numStops: 0,
		cost: 0,
		mpg: 25,
		gasPrice: 3.50,
		travellers: [],
		stops: []
	},

	defaultUrl: "/trips",

	url: "/trips",

	initialize: function(opts) {
		this.resetUrl();
	},

	setUrl: function(TripId) {
		this.url = this.defaultUrl + "/" + TripId;
	},

	resetUrl: function() {
		this.url = this.defaultUrl;
	},

	saveLocalStorageReference: function() {
		var tripList = localStorage.getItem("tripList");
		var newTrip = {
			title: this.get("title"),
			id: this.get("_id"),
			startDate: this.get("start"),
			endDate: this.get("end")
		}
		var prevTrip;

		if (!tripList) {
			tripList = [newTrip];
		} else {
			tripList = JSON.parse(tripList);
			_.find(tripList, function(trip, index) {
				if (newTrip.id === trip.id) {
					tripList.splice(index, 1);
					prevTrip = trip;
					return true;
				}
			});
			//if this trip was already in local storage, just update it
			if (prevTrip) { _.defaults(newTrip, prevTrip); }
			tripList.push(newTrip);
		}

		localStorage.setItem("tripList", JSON.stringify(tripList));
		this.updateTripReferences(tripList);
	},

	updateTripReferences: function(newTripList) {
		Backbone.trigger("triplist:update", newTripList);
	} 
});

module.exports = trip_model;