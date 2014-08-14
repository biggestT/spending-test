/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Spending model
	// ----------
	app.Spending = Backbone.Model.extend({

		defaults: {
			title: '',
			value: '',
			currency: 'USD',
			time: 'now'
		},

		initialize: function () {
			this.set({
				'currencies': app.spendings.getCurrencies()
			})
		}
		
	});
})();