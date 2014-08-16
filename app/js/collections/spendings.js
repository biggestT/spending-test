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
		'SEK': new Currency('SEK', 0.15),
		'CNY': new Currency('CNY', 0.16)
	};

	var Spendings = Backbone.Collection.extend({

		// this collection consists of multiple spending models
		model: app.Spending,

		currency: currencies['USD'],

		tags: [],

		localStorage: new Backbone.LocalStorage('spendings-backbone'),

		initialize: function () {
			// if any models time is updated we need to sort the array again
			this.on('change:time add', function() {this.sort()}, this);
			this.on('save', function(what) {console.log(what);});
		},

		getValueOfSelected: function() {
			var dollarSum = 0;
			var values = this.pluck('value');
			this.each(function (model) {
				// add the models value in dollars to the total
				if (model.get('selected')) {
					dollarSum+=model.get('value')*currencies[model.get('currency')].conversion;
				}
			});
			// convert the total dollar sum to the currently choosen currency
			var result = dollarSum/this.currency.conversion;
			return result.toFixed(2);
		},

		// filter out spendings tagged with certain tag
		byTag: function (tag) {
			var taggedWithTag = this.filter(function (model) {
				return $.inArray(tag, model.get('tags'));
			})
			return taggedWithTag;
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
		},

		// spendings are ordered by their date, newest first
		comparator: function(a, b) {
			return a.get('time') < b.get('time');
		}


	});

	// Create our global collection of spendings.
	app.spendings = new Spendings();


})();