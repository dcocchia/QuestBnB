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
var stop_model = require(appSrc + "backbone_models/stop_model");

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

var stopModelDefaults = {
	'location': '',
	'stopNum': 1,
	'dayNum': 1,
	'distance': {
		'text': '0 mi',
		'value': 0
	},
	'duration': {
		'text': '0',
		'value': 0
	},
	'cost': {
		'travelCost': 0,
		'lodgingCost': 0,
		'totalCost': 0
	},
	'totals': {
		'distance': {
			'text': '0 mi',
			'value': 0
		},
		'duration': {
			'text': '0',
			'value': 0
		},
		'cost':  {
			'totalTripCost': 0
		}
	},
	'lodging': {}
}

describe('stop_model', function(){
	describe('initialize', function(){
		var stop = new stop_model();

		it('should initialize without error', function(){
			expect(stop).to.be.an.instanceof(stop_model);
		});

		it('should set default values', function(){
			expect(stop.attributes).to.be.deep.equal(stopModelDefaults);
		});

		it('should set url', function(){
			stop = new stop_model({url: "/some/url"});
			expect(stop.url).to.be.equal("/some/url");
		});
	});

	describe('remove', function(){
		var stop = new stop_model();

		it('should trigger removeStop when remove is called', function(){
			var spy = sinon.spy();
			stop.on("removeStop", spy);

			expect(spy).not.to.have.been.called;
			stop.remove(1234);
			expect(spy).to.have.been.calledWith(1234);

		});
	});
});