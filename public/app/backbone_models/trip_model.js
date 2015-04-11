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

	url: "/trips",

	initialize: function(opts) {
	},

	setUrl: function(TripId) {
		this.url = this.url + "/" + TripId;
	},

	saveLocalStorageReference: function() {
		var tripList = localStorage.getItem("tripList");
		var newTrip = {
			title: this.get("title"),
			id: this.get("_id")
		}
		var prevTrip;

		if (!tripList) { 
			tripList = [newTrip];
		} else {
			tripList = JSON.parse(tripList);
			prevTrip = _.find(tripList, function(trip, index) {
				if (newTrip.id === trip.id) {
					tripList.splice(index, 1);
					return true;
				}
			});
			//if this trip was already in local storage, just update it
			if (prevTrip) { _.defaults(newTrip, prevTrip); }
			tripList.push(newTrip);
		}

		localStorage.setItem("tripList", JSON.stringify(tripList));
	}
});

module.exports = trip_model;