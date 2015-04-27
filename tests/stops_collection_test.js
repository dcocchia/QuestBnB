var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var assert = require("assert");
var expect = chai.expect;

//usually found in libraries.js, but for testing let's require in directly
_ = require("lodash");
Backbone = require("backbone");
var moment = require("moment");
require("moment-duration-format");

//pull in necessary views/collections/models for testing
var appSrc = "../public/app/";
var stops_collection = require(appSrc + "backbone_collections/stops_collection");
var stop_model = require(appSrc +  "backbone_models/stop_model");
var StopView = require(appSrc +  "backbone_views/stop_view");

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

describe('stops_collection', function(){
	describe('initialize', function(){
		var stops = new stops_collection();

		it('should initialize without error', function(){
			expect(stops).to.be.an.instanceof(stops_collection);
		});

		it('should use stopModel as its model', function(){
			expect(stops.model).to.eql(stop_model);
		});

		it('should call removeStop on removeStop event trigger', function(){
			var spy = sinon.spy(stops, "removeStop");
			stops.trigger("removeStop", "123");
			expect(spy).to.have.been.called;
		});
	});

	describe('_numberStops', function(){
		var stops = new stops_collection();

		it('should give index to stop models in numerical order', function(){
			var stop1, stop2, stop3;
			stops.add([
				{
					isNew: true, 
					stopNum: 0, 
					_id: 1 
				},
				{
					isNew: true, 
					stopNum: 0, 
					_id: 2
				},
				{
					isNew: true, 
					stopNum: 0, 
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("stopNum")).to.be.equal(0);
			expect(stop2.get("stopNum")).to.be.equal(0);
			expect(stop3.get("stopNum")).to.be.equal(0);
			stops._numberStops();
			expect(stop1.get("stopNum")).to.deep.equal({index: 1});
			expect(stop2.get("stopNum")).to.deep.equal({index: 2});
			expect(stop3.get("stopNum")).to.deep.equal({index: 3});
		});

		it('should _not_ trigger change event on collection', function(){
			var spy = sinon.spy();

			stops.on("change", spy);
			expect(spy).not.to.have.been.called;
			stops._numberStops();
			expect(spy).not.to.have.been.called;
		});
	});

	describe('getStop', function(){
		var stops = new stops_collection();

		it('should return stop model by passed in Id', function(){
			var id = _.uniqueId();
			stops.add([
				{
					isNew: true, 
					stopNum: 1, 
					_id: 1234
				},
				{
					isNew: false, 
					stopNum: 2, 
					_id: id
				},
				{
					isNew: false, 
					stopNum: 3, 
					_id: "ABCD1234"
				}
			]);

			expect(stops.getStop(1234).get("_id")).to.be.equal(1234);
			expect(stops.getStop(1234)).to.be.deep.equal(stops.models[0]);

			expect(stops.getStop(id).get("_id")).to.be.equal(id);
			expect(stops.getStop(id)).to.be.deep.equal(stops.models[1]);

			expect(stops.getStop("ABCD1234").get("_id")).to.be.equal("ABCD1234");
			expect(stops.getStop("ABCD1234")).to.be.deep.equal(stops.models[2]);
		});
	});

	describe('addStop', function(){
		var stops = new stops_collection();

		it('should add a stop when addStop is called', function() {
			var id = _.uniqueId("stop__");

			stops.addStop(1, {
				isNew: true, 
				stopNum: 2, 
				_id: id 
			});

			expect(stops.models.length).to.equal(1);
			expect(stops.models[0].id === id);

		});

		it('should add the model at the passed in index', function() {
			var id = _.uniqueId("stop__");

			stops.addStop(1, {
				isNew: true, 
				stopNum: 2, 
				_id: 1
			});

			stops.addStop(2, {
				isNew: true, 
				stopNum: 2, 
				_id: 2
			});

			stops.addStop(3, {
				isNew: true, 
				stopNum: 2, 
				_id: id 
			});

			stops.addStop(4, {
				isNew: true, 
				stopNum: 2, 
				_id: id 
			});

			expect(stops.models[0].id === 1);
			expect(stops.models[1].id === 2);
			expect(stops.models[2].id === id);
			expect(stops.models[3].id === 4);
		});

		it('should call _numberStops', function() {
			var spy = sinon.spy(stops, "_numberStops");

			stops.addStop(1, {
				isNew: true, 
				stopNum: 2, 
				_id: 1 
			});

			expect(spy).to.have.been.called;
		});

		it('should trigger change event', function() {
			var spy = sinon.spy();

			stops.on("change", spy);

			stops.addStop(1, {
				isNew: true, 
				stopNum: 2, 
				_id: 1 
			});

			expect(spy).to.have.been.called;
		});

		it('should call setStopsActive after 450ms', function() {
			var spy = sinon.stub(stops, "setStopsActive");

			stops.addStop(1, {
				isNew: true, 
				stopNum: 2, 
				_id: 1 
			});

			expect(spy).to.not.have.been.called;
			this.clock.tick(500);
			expect(spy).to.have.been.called;
			
		});
	});

	describe('setStopsActive', function(){
		var stops = new stops_collection();

		it('should mark isNew to false on new models', function() {
			stops.add([
				{
					isNew: true, 
					stopNum: 1, 
					_id: 1 
				},
				{
					isNew: true, 
					stopNum: 2, 
					_id: 2
				}
			]);

			expect(stops.models[0].get("isNew")).to.be.true;
			expect(stops.models[1].get("isNew")).to.be.true;

			stops.setStopsActive();

			expect(stops.models[0].get("isNew")).to.be.false;
			expect(stops.models[1].get("isNew")).to.be.false;
		});

		it('should trigger active event on model', function() {
			var spy = sinon.spy();
			var stop;

			stops.add([
				{
					isNew: true, 
					stopNum: 3, 
					_id: 3 
				}
			]);

			stop = stops.models[2];
			stop.on("active", spy);

			expect(spy).not.to.have.been.called;
			stops.setStopsActive();
			expect(spy).to.have.been.called;

		});

		it('should trigger change event on collection', function() {
			var spy = sinon.spy();
			var stop;

			stops.add([
				{
					isNew: true, 
					stopNum: 4, 
					_id: 4 
				}
			]);

			stop = stops.models[3];
			stops.on("change", spy);

			expect(spy).not.to.have.been.called;

			stops.setStopsActive();

			expect(spy).to.have.been.called;
			expect(spy).to.have.been.calledWith(stop);

		});

		it('should not trigger active event when no new stops', function() {
			var spy = sinon.spy();
			var stop;

			stops.add([
				{
					isNew: false, 
					stopNum: 4, 
					_id: 4 
				}
			]);

			stop = stops.models[3];
			stops.on("change", spy);

			expect(spy).not.to.have.been.called;

			stops.setStopsActive();

			expect(spy).not.to.have.been.called;

		});
					
	});
	
	describe('removeStop', function(){
		var stops = new stops_collection();

		it('should remove the model with the specified id', function() {
			var spy = sinon.spy(stops, "remove");
			var stop;

			stops.add([
				{
					isNew: true, 
					stopNum: 1, 
					_id: 1 
				},
				{
					isNew: true, 
					stopNum: 2, 
					_id: 2
				},
				{
					isNew: true, 
					stopNum: 3, 
					_id: 3
				}
			]);

			expect(spy).not.to.have.been.called;
			expect(stops.length).to.be.equal(3);

			stop = stops.models[1];
			stops.removeStop(2);

			expect(spy).to.have.been.called;
			expect(stops.length).to.be.equal(2);
			expect(stops.models[0].get("_id")).to.be.equal(1);
			expect(stops.models[1].get("_id")).to.be.equal(3);
			expect(stops.models[2]).to.be.undefined;
		});

		it('should expect _numberStops to be called', function() {
			var spy = sinon.spy(stops, "_numberStops");

 			stops.removeStop(1);

			expect(spy).to.have.been.called;
		});

		it('should trigger change event on collection', function() {
			var spy = sinon.spy();

			stops.on("change", spy);

			expect(spy).to.not.have.been.called;

 			stops.removeStop(1);

			expect(spy).to.have.been.called;
		});

		it('should trigger removeStop event on Backbone event bus', function() {
			var spy = sinon.spy();

			Backbone.on("removeStop", spy);

			expect(spy).to.not.have.been.called;

 			stops.removeStop(1);

			expect(spy).to.have.been.calledWith(1);
		});
	});

	describe('mergeMapData', function(){
		var lastStopDefaults = {
			distance: {
				text: '0',
				value: 0
			},
			duration: {
				text: '0',
				value: 0
			},
			totals: {
				distance: {
					text: '0 mi',
					value: 0
				},
				duration: {
					text: '0',
					value: 0
				}
			}
		}

		var mockMappingResultBad = {
			routes: [
				{
					legs: [
						{},
						{
							distance: {
								text: "1,252 mi",
								value: 2014912
							},
							duration: {
								text: "18 hours 9 mins",
								value: 65369
							},
							start_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							},
							end_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							}
						},
						{}
					]
				}
			]
		}

		var mockMappingResultEmpy = {
			routes: [
				{
					legs: [
						{},
						{}
					]
				}
			]
		}

		var mockMappingResult = {
			routes: [
				{
					legs: [
						{
							distance: {
								text: "913 mi",
								value: 1468986
							},
							duration: {
								text: "12 hours 45 mins",
								value: 45889
							},
							start_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							},
							end_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							}
						},
						{
							distance: {
								text: "1,252 mi",
								value: 2014912
							},
							duration: {
								text: "18 hours 9 mins",
								value: 65369
							},
							start_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							},
							end_location: {
								lat: function() {
									return 44.11;
								},
								lng: function() {
									return -118.13;
								}
							}
						}
					]
				}
			]
		}

		it('should set the distance for each stop model', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("distance")).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop2.get("distance")).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop3.get("distance")).to.be.deep.equal({ text: "0 mi", value: 0});

			stops.mergeMapData(mockMappingResult);

			expect(stop1.get("distance")).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop2.get("distance")).to.be.deep.equal({ text: "913 mi", value: 1468986});
			expect(stop3.get("distance")).to.be.deep.equal({ text: "1,252 mi", value: 2014912});
		});

		it('should set the duration for each stop model', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("duration")).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("duration")).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("duration")).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData(mockMappingResult);
			
			expect(stop1.get("duration")).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("duration")).to.be.deep.equal({ text: "12 hours 45 mins", value: 45889});
			expect(stop3.get("duration")).to.be.deep.equal({ text: "18 hours 9 mins", value: 65369});
		});

		it('should set the total distance for each stop model', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("totals").distance).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop2.get("totals").distance).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop3.get("totals").distance).to.be.deep.equal({ text: "0 mi", value: 0});

			stops.mergeMapData(mockMappingResult);
			
			expect(stop1.get("totals").distance).to.be.deep.equal({ text: "0 mi", value: 0});
			expect(stop2.get("totals").distance).to.be.deep.equal({ text: "913 mi", value: 913});
			expect(stop3.get("totals").distance).to.be.deep.equal({ text: "2165 mi", value: 2165});
		});

		it('should set the total duration for each stop model', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData(mockMappingResult);
			
			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "12 hours 44 mins", value: 45889});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "1 days 6 hours 54 mins", value: 111258});
		});

		it('should do nothing if legs length does not match models.length - 1', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				},
				{
					isNew: false, 
					stopNum: {index: 4},
					_id: 4
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];
			stop4 = stops.models[3];

			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop4.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData(mockMappingResult);
			
			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop4.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
		});

		it('should run without error even with no result argument', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData();
			
			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
		});

		it('should run without error even with no routes', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData({});
			
			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
		});

		it('should run without error even with bad map data', function() {
			var stops = new stops_collection();

			stops.mergeMapData(mockMappingResult);
			
			expect(stops.models.length).to.equal(0);
		});

		it('should run without error even with a bad model', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3, stop4;

			stops.add([
				{
					isNew: false, 
					stopNum: {index: 1},
					_id: 1 
				},
				{
					isNew: false, 
					stopNum: {index: 2},
					_id: 2
				},
				{
					isNew: false, 
					stopNum: {index: 3},
					_id: 3
				},
				{
					isNew: false, 
					stopNum: {index: 4},
					_id: 4
				}
			]);

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];
			stop4 = stops.models[3];


			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop4.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});

			stops.mergeMapData(mockMappingResultBad);
			
			expect(stops.models.length).to.be.equal(4);
			expect(stop1.get("totals").duration).to.be.deep.equal({ text: "0", value: 0});
			expect(stop2.get("totals").duration).to.be.deep.equal({ text: "0 mins", value: 0});
			expect(stop3.get("totals").duration).to.be.deep.equal({ text: "18 hours 9 mins", value: 65369});
			expect(stop4.get("totals").duration).to.be.deep.equal({ text: "18 hours 9 mins", value: 65369});

		});

		it('should run without error even with all empty models and not using collection.add()', function() {
			var stops = new stops_collection();
			var stop1, stop2, stop3;
			
			stops.add([{}]);
			stops.models.push({});
			stops.models.push({});

			stop1 = stops.models[0];
			stop2 = stops.models[1];
			stop3 = stops.models[2];

			expect(stop1.get("totals")).to.be.deep.equal(lastStopDefaults.totals);
			//expect(stop2.get("totals")).to.be.deep.equal(lastStopDefaults.totals);
			//expect(stop3).to.be.deep.equal({});

			stops.mergeMapData(mockMappingResultEmpy);
			
			expect(stop1.get("totals")).to.be.deep.equal(lastStopDefaults.totals);
			//expect(stop2.get("totals")).to.be.deep.equal(lastStopDefaults.totals);
			//expect(stop3).to.be.deep.equal({});
		});

	});
})