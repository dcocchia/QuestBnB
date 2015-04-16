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
var map_api = require(appSrc + "util/map_api");
var search_model = require(appSrc + "backbone_models/search_model");

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

describe('search_model', function(){
	describe('initialize', function(){
		var search = new search_model({
			map_api: map_api
		});

		it('should initialize without error', function(){
			expect(search).to.be.an.instanceof(search_model);
			expect(search.map_api).to.be.to.be.deep.equal(map_api);
		});

		it('should set default values', function(){
			expect(search.attributes).to.be.deep.equal({
				map_api: map_api,
				queryPredictions: [],
				queryStatus: "noResults"
			});
		});
	});

	// describe('getQueryPredictions', function(){
	// 	var search = new search_model({
	// 		map_api: map_api
	// 	});

	// 	it('should call map_api.getQueryPredictions', function(){
	// 		var spy = sinon.spy(search.map_api, "getQueryPredictions");

	// 		expect(spy).not.to.have.been.called;
	// 		search.getQueryPredictions();
	// 		expect(spy).to.have.been.called;
	// 	});
	// });
});