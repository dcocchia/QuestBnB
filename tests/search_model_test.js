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

console.warning = function(error) {}

describe('search_model', function(){
	describe('initialize', function(){
		var map_api = {}
		var search = new search_model({
			map_api: map_api
		});

		it('should initialize without error', function(){
			expect(search).to.be.an.instanceof(search_model);
		});

		it('should set default values', function(){
			expect(search.attributes).to.be.deep.equal({
				map_api: map_api,
				queryPredictions: [],
				queryStatus: "noResults"
			});
		});
	});

	describe('getQueryPredictions', function(){
		//mock out google map places api
		google = {
			maps: {
				places: {
					PlacesServiceStatus: { 
						OK: "OK",
						ZERO_RESULTS: "ZERO_RESULTS"
					}
				}
			}
		}

		it('should call map_api.getQueryPredictions', function(){
			var map_api = {
				getQueryPredictions: function(options, callback) {
					callback.call(this, [], "OK");
				}
			}
			var search = new search_model({
				map_api: map_api
			});
			var spy = sinon.spy(search.map_api, "getQueryPredictions");

			expect(spy).not.to.have.been.called;
			search.getQueryPredictions();
			expect(spy).to.have.been.called;
		});

		it('should set model with returned predictions', function(){
			var map_api = {
				getQueryPredictions: function(options, callback) {
					callback.call(this, [{id: 1}, {id: 54321}], "OK");
				}
			}
			var search = new search_model({
				map_api: map_api
			});

			expect(search.attributes.queryPredictions).to.deep.equal([]);
			expect(search.attributes.queryStatus).to.equal("noResults");
			search.getQueryPredictions();
			expect(search.attributes.queryPredictions.length).to.equal(2);
			expect(search.attributes.queryPredictions[0].id).to.equal(1);
			expect(search.attributes.queryPredictions[1].id).to.equal(54321);
		});

		it('should set model with queryStatus noResults', function(){
			var map_api = {
				getQueryPredictions: function(options, callback) {
					callback.call(this, [], "ZERO_RESULTS");
				}
			}
			var search = new search_model({
				map_api: map_api
			});

			expect(search.attributes.queryPredictions).to.deep.equal([]);
			expect(search.attributes.queryStatus).to.equal("noResults");
			search.getQueryPredictions();
			expect(search.attributes.queryStatus).to.equal("noResults");
			expect(search.attributes.queryPredictions.length).to.equal(0);
			expect(search.attributes.queryPredictions[0]).to.be.undefined;
		});

		it('should set model with queryStatus error', function(){
			var map_api = {
				getQueryPredictions: function(options, callback) {
					callback.call(this);
				}
			}
			var search = new search_model({
				map_api: map_api
			});

			expect(search.attributes.queryPredictions).to.deep.equal([]);
			expect(search.attributes.queryStatus).to.equal("noResults");
			search.getQueryPredictions();
			expect(search.attributes.queryStatus).to.equal("error");
			expect(search.attributes.queryPredictions.length).to.equal(0);
			expect(search.attributes.queryPredictions[0]).to.be.undefined;
		});
	});

	describe('clear', function(){
		var map_api = {}
		var search = new search_model({
			map_api: map_api
		});

		it('should set model back to defaults', function(){
			search.set({
				queryPredictions: [{id:1},{id:2},{id:3}],
				queryStatus: "OK"
			});

			expect(search.get("queryPredictions").length).to.be.equal(3);
			expect(search.get("queryPredictions")[0].id).to.be.equal(1);
			expect(search.get("queryStatus")).to.be.equal("OK");

			search.clear();

			expect(search.get("queryPredictions").length).to.be.equal(0);
			expect(search.get("queryPredictions")[0]).to.be.undefined;
			expect(search.get("queryStatus")).to.be.equal("noResults");
		});
	});
});