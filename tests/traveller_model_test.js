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

describe('traveller_model', function(){
	describe('initialize', function(){
		var traveller = new traveller_model();

		it('should initialize without error', function(){
			expect(traveller).to.be.an.instanceof(traveller_model);
		});

		it('should set default values', function(){
			expect(traveller.attributes).to.be.deep.equal({name: "", img: { src: "/app/img/default-icon.png"}});
		});
	});

	describe('removeTraveller', function(){
		var traveller = new traveller_model({
			_id: 12345
		});

		it('should trigger remove_traveller event when removeTraveller is called', function(){
			var spy = sinon.spy();

			traveller.on("remove_traveller", spy);
			expect(spy).to.not.have.been.called;

			traveller.removeTraveller();

			expect(spy).to.have.been.calledWith(12345);
		});

	});
});