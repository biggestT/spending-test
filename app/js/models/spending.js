/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Spending model
	// ----------
	var categories = { 
		HOUSING: 0, 
		TRAVELS: 1 
	};

	app.Spending = Backbone.Model.extend({

		defaults: {
			title: '',
			value: 0,
			category: categories.HOUSING
		},

		initialize: function () {

		}
		
	});
})();