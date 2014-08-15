/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var today = new Date();
	var month = (today.getMonth() < 9) ? '0' + today.getMonth() : today.getMonth();
	var date = (today.getDate() < 9) ? '0' + today.getDate() : today.getDate();
	today = today.getFullYear()+'-'+month+'-'+date;
	// Spending model
	// ----------
	app.Spending = Backbone.Model.extend({


		defaults: {
			title: '',
			value: '',
			currency: 'USD',
			time: today,
			tags: []
		},

		initialize: function () {
			this.set({
				'currencies': app.spendings.getCurrencies()
			})
		}
		
	});
})();