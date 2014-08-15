/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	function Currency(name, usdRatio) {
		this.name = name;
		this.conversion = usdRatio;
	}

	var currencies = {
		'USD': new Currency('USD', 1.0), 
		'SEK': new Currency('SEK', 0.23)
	};

	var Spendings = Backbone.Collection.extend({

		// this collection consists of multiple spending models
		model: app.Spending,

		currency: currencies['USD'],

		localStorage: new Backbone.LocalStorage('spendings-backbone'),

		getTotalValue: function() {
			var dollarSum = 0;
			var values = this.pluck('value');
			this.each(function (model) {
				// add the models value in dollars to the total
				dollarSum+=model.get('value')*currencies[model.get('currency')].conversion;
			});
			// convert the total dollar sum to the currently choosen currency
			var result = dollarSum/this.currency.conversion;
			return result.toFixed(2);
		},

		// get the name of the current currency
		getCurrencyName: function () {
			return this.currency.name;
		},
		getCurrencies: function () {
			return currencies;
		},
		setCurrency: function(currency) {
			this.currency = currencies[currency];
		}
	});

	// Create our global collection of **Todos**.
	app.spendings = new Spendings();


})();