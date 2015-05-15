var React 		= require('react');
var Renderer 	= require('../renderer/server_renderer');
var landingView = React.createFactory(require('../views/LandingView.jsx'));
var self 		= this;
this.renderer 	= new Renderer();

exports.index = function(req, res){
	var html = self.renderer.render(landingView, {
		mapStyleClasses: 'map',
		pageName: '/landing',
		title: "QuestBnB - Find your adventure"
	});
	res.send(html);
};