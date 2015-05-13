//allows requiring in jsx files
require('node-jsx').install({extension: '.jsx'});

//controllers
var controllersPath = './controllers/';
var landingController = require(controllersPath + 'landing');
var tripsController = require(controllersPath + 'trips');
var stopsController = require(controllersPath + 'stops');
var lodgingsController = require(controllersPath + 'lodgings');

var app = module.parent.exports.app;

//landing
app.get('/', landingController.index);

//trips
app.post('/trips', tripsController.create);
app.get('/trips/:id', tripsController.get);
app.put('/trips/:id', tripsController.edit);

//stops
app.get('/trips/:id/stops/:stopId', stopsController.get);
app.put('/trips/:id/stops/:stopId', stopsController.create);

//lodgings
app.get('/lodgings', lodgingsController.get);