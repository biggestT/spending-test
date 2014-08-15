/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// format today's date to be the default for a new spending
	var today = new Date();
	var month = (today.getMonth() < 9) ? '0' + today.getMonth() : today.getMonth();
	var date = (today.getDate() < 9) ? '0' + today.getDate() : today.getDate();
	today = today.getFullYear()+'-'+month+'-'+date;


	app.Spending = Backbone.Model.extend({

		// this is the data that each model will need to persist to a server or localstorage
		defaults: {
			title: '',
			value: '',
			currency: 'USD',
			time: today,
			tags: [],
			selected: true
		}
	});
})();