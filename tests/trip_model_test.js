var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var assert = require("assert");
var expect = chai.expect;

//usually found in libraries.js, but for testing let's require in directly
_ = require("lodash");
Backbone = require("backbone");

//pull in necessary views/collections/models for testing
var appSrc = "../public/app/";
var trip_model = require(appSrc + "backbone_models/trip_model");

//create a sandbox for sinon spies and fake timers
var sandbox;
var oldLodash = _;
beforeEach(function () {
	sandbox = sinon.sandbox.create();
	this.clock = sinon.useFakeTimers();
	// this makes lodash's internal setTimeOut work with this.clock.tick()
	_ = _.runInContext()
});

afterEach(function () {
	sandbox.restore();
	this.clock.restore();
	_ = oldLodash;
});

describe('trip_model', function(){
	describe('initialize', function(){
		var trip = new trip_model();

		it('should initialize without error', function(){
			expect(trip).to.be.an.instanceof(trip_model);
		});

		it('should set default values', function(){
			expect(trip.attributes).to.be.deep.equal({
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
			});
		});

		it('should set the default url to /trips', function(){
			expect(trip.url).to.be.equal("/trips");
		});

		it('should reset the url to the default url', function(){
			var spy = sinon.spy(trip, "resetUrl");

			expect(trip.url).to.be.equal("/trips");

			trip.setUrl("123456");
			expect(trip.url).to.be.equal("/trips/123456");
			
			trip.initialize();
			expect(spy).to.have.been.called;
			expect(trip.url).to.be.equal("/trips");
		});
	});

	describe('setUrl', function(){
		var trip = new trip_model();
		it('should set the url to /trips/<id>', function(){
			expect(trip.url).to.be.equal("/trips");

			trip.setUrl(123456);
			expect(trip.url).to.be.equal("/trips/123456");

			trip.setUrl("123456789");
			expect(trip.url).to.be.equal("/trips/123456789");

			trip.setUrl("ABCDEFG");
			expect(trip.url).to.be.equal("/trips/ABCDEFG");
		});
	});

	describe('resetUrl', function(){
		var trip = new trip_model();
		it('should set the url back to the default url', function(){
			expect(trip.url).to.be.equal("/trips");

			trip.setUrl(123456);
			expect(trip.url).to.be.equal("/trips/123456");

			trip.resetUrl();
			expect(trip.url).to.be.equal("/trips");
		});
	});

	describe('saveLocalStorageReference', function(){
		var trip = new trip_model();

		//mock out local storage
		localStorage = {
			storage: {},
			setItem: function(key, value) {
				this.storage[key] = value;
			},
			getItem: function(key) {
				return this.storage[key];
			}
		}

		it('should save current trip as new reference in localStorage', function(){
			var parsedTrips;
			var modelData = {
				title: "Test Title",
				_id: 1234513,
				start: "05/05/17",
				end: "05/20/17"
			};

			trip.set(modelData, {silent: true});
			expect(localStorage.getItem("tripList")).to.be.undefined;
			
			trip.saveLocalStorageReference();
			expect(localStorage.getItem("tripList")).to.be.a('string');

			parsedTrips = JSON.parse(localStorage.getItem("tripList"));
			expect(parsedTrips).to.be.an('array');
			expect(parsedTrips.length).to.equal(1);
			expect(parsedTrips[0]).to.deep.equal({
				title: "Test Title",
				id: 1234513,
				startDate: "05/05/17",
				endDate: "05/20/17"
			});
		});

		it('should overwrite current trip reference in localStorage with new data', function(){
			var parsedTrips;
			var newModelData = {
				title: "Test Title two!",
				_id: 1234513,
				start: "06/06/17",
				end: "06/10/17"
			};

			parsedTrips = JSON.parse(localStorage.getItem("tripList"));
			expect(parsedTrips[0]).to.deep.equal({
				title: "Test Title",
				id: 1234513,
				startDate: "05/05/17",
				endDate: "05/20/17"
			});

			trip.set(newModelData, {silent: true});
			
			trip.saveLocalStorageReference();
			expect(localStorage.getItem("tripList")).to.be.a('string');

			parsedTrips = JSON.parse(localStorage.getItem("tripList"));
			expect(parsedTrips).to.be.an('array');
			expect(parsedTrips.length).to.equal(1);
			expect(parsedTrips[0]).to.deep.equal({
				title: "Test Title two!",
				id: 1234513,
				startDate: "06/06/17",
				endDate: "06/10/17"
			});
		});

		it('should add a new trip to local storage without affecting othter trips', function(){
			var parsedTrips;
			var newModelData = {
				title: "Test Title three!",
				_id: 765432,
				start: "06/06/17",
				end: "06/10/17"
			};

			parsedTrips = JSON.parse(localStorage.getItem("tripList"));
			expect(parsedTrips[0]).to.deep.equal({
				title: "Test Title two!",
				id: 1234513,
				startDate: "06/06/17",
				endDate: "06/10/17"
			});

			trip.set(newModelData, {silent: true});
			trip.saveLocalStorageReference();
			expect(localStorage.getItem("tripList")).to.be.a('string');

			parsedTrips = JSON.parse(localStorage.getItem("tripList"));
			expect(parsedTrips[0]).to.deep.equal({
				title: "Test Title two!",
				id: 1234513,
				startDate: "06/06/17",
				endDate: "06/10/17"
			});
			expect(parsedTrips[1]).to.deep.equal({
				title: "Test Title three!",
				id: 765432,
				startDate: "06/06/17",
				endDate: "06/10/17"
			});
			expect(parsedTrips).to.be.an('array');
			expect(parsedTrips.length).to.equal(2);

		});

		it('should call updateTripReferences', function(){
			var parsedTrips;
			var modelData = {
				title: "Test Title",
				id: 1234513,
				start: "05/05/17",
				end: "05/20/17"
			};
			var spy = sinon.spy(trip, "updateTripReferences");

			trip.set(modelData, {silent: true});			
			trip.saveLocalStorageReference();

			expect(spy).to.have.been.called;
		});
	});
	
	describe('updateTripReferences', function(){
		var trip = new trip_model();
		it('should trigger triplist:update event on Backbone event bus', function(){
			var spy = sinon.spy();

			Backbone.on("triplist:update", spy);			
			trip.updateTripReferences(123);

			expect(spy).to.have.been.calledWith(123);
		});
	});
});