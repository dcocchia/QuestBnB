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
var header_model = require(appSrc + "backbone_models/header_model");

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

describe('header_model', function(){
	describe('initialize', function(){
		var header = new header_model();

		it('should initialize without error', function(){
			expect(header).to.be.an.instanceof(header_model);
		});

		it('should set default values', function(){
			expect(header.attributes).to.be.deep.equal({"open": false});
		});
	});
});