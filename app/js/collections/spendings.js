/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	function Currency(name, usdRatio) {
		this.name = name;
		this.conversion = usdRatio;
	}

	var currencies = [new Currency('USD', 1.0), new Currency('SEK', 0.23)];

	// The collection of spendings is backed by *localStorage* instead of a remote
	// server.
	var Spendings = Backbone.Collection.extend({

		// this collection consists of multiple spending models
		model: app.Spending,

		currency: currencies[0],

		localStorage: new Backbone.LocalStorage('spendings-backbone'),

		getTotalValue: function() {
			var sum = 0;
			var values = this.pluck('value');
			_.each(values, function (value) {
				sum+=value;
			});
			return sum;
		},

		// get the name of the current currency
		getCurrencyName: function () {
			return this.currency.name;
		},
		getCurrencies: function () {
			return currencies;
		}
	});

	// Create our global collection of **Todos**.
	app.spendings = new Spendings();


})();