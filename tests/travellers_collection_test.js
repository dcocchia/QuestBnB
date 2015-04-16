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
var travellers_collection = require(appSrc + "backbone_collections/travellers_collection");
var traveller_model = require(appSrc + "backbone_models/traveller_model");

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

describe('travellers_collection', function(){
	describe('initialize', function(){
		var travellers = new travellers_collection();

		it('should initialize without error', function(){
			expect(travellers).to.be.an.instanceof(travellers_collection);
		});

		it('should use traveller_model as its model', function(){
			expect(travellers.model).to.eql(traveller_model);
		});

		it('should call removeTraveller on remove_traveller event', function(){
			var spy = sinon.spy();

			travellers.on("remove_traveller", spy);

			expect(spy).not.to.have.been.called;
			travellers.trigger("remove_traveller", 1);
			expect(spy).to.have.been.calledWith(1);
		});
	});

	describe('removeTraveller', function(){

		it('should call remove Travellers by passed in id', function(){
			var travellers = new travellers_collection();
			var id = _.uniqueId("traveller__");

			travellers.add([
				{
					name: "Test Person",
					_id: id
				},
				{
					name: "Another Test Person",
					_id: 2
				}
			])

			expect(travellers.models.length).to.equal(2);
			expect(travellers.models[0].id === id);

			travellers.removeTraveller(id);

			expect(travellers.models.length).to.equal(1);
			expect(travellers.models[0].id === 2);
			expect(travellers.models[1]).to.be.undefined;
		});

		it('should not remove a traveller if no id matches', function(){
			var travellers = new travellers_collection();
			var id = _.uniqueId("traveller__");

			travellers.add([
				{
					name: "Test Person",
					_id: id
				},
				{
					name: "Another Test Person",
					_id: 2
				}
			])

			expect(travellers.models.length).to.equal(2);
			expect(travellers.models[0].id === id);

			travellers.removeTraveller(12345);

			expect(travellers.models.length).to.equal(2);
			expect(travellers.models[0].id === id);
			expect(travellers.models[1].id === 2);
		});
	});
})