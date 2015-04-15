var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var assert = require("assert");
var expect = chai.expect;

//usually found in libraries.js, but for testing we require in directly
_ = require("lodash");
Backbone = require("backbone");

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
})