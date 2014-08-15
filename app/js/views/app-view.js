/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#spendzapp',

		// Our template for the new spending input box and line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'change #total-currency-select': 'updateCurrency'
		},

		// At initialization we bind to the relevant events on the `spendings`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting spendings that might be saved in *localStorage*.
		initialize: function () {
			this.$newSpending = this.$('#new-spending');
			this.$input = this.$('#new-spending');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$list = this.$('#spendings-list');

			this.listenTo(app.spendings, 'add', this.addOne);
			this.listenTo(app.spendings, 'reset', this.addAll);
			this.listenTo(app.spendings, 'filter', this.filterAll);
			this.listenTo(app.spendings, 'all', this.render);
			this.listenTo(app.spendings, 'change:currency', this.render);

			var viewForAdding = new app.SpendingView({
				model: new app.Spending()
			});
			this.$newSpending.append(viewForAdding.render().el);
			viewForAdding.edit();

			app.spendings.fetch({reset: true});


		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var count = app.spendings.length;
			var total = app.spendings.getTotalValue();
			var currencyName = app.spendings.getCurrencyName();
			var currencies = app.spendings.getCurrencies();

			if (app.spendings.length) {
				this.$main.show();
				this.$footer.show();

				// update the html of the stats footer
				this.$footer.html(this.statsTemplate({
					count: count,
					total: total,
					currency: currencyName,
					currencies: currencies
				}));

				this.$selectorCurrency = this.$('#total-currency-select');

				this.$('#filters li a')
					.filter('[href="#/' + (app.spendingFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

		},

		// when the user have requested to view the total amount in a new currency
		updateCurrency: function () {
			app.spendings.setCurrency(this.$selectorCurrency.val());
			this.render();
		},
		// Add a single spending item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (spending) {
			var view = new app.SpendingView({ model: spending });
			this.$list.append(view.render().el);
			this.resetNewInputView();
		},

		resetNewInputView: function () {
			var viewForAdding = new app.SpendingView({
				model: new app.Spending()
			});
			this.$newSpending.html(viewForAdding.render().el);
			viewForAdding.edit();
		},
		// Add all items in the **spendings** collection at once.
		addAll: function () {
			this.$list.html('');
			app.spendings.each(this.addOne, this);
		},

		filterOne: function (spending) {
			spending.trigger('visible');
		},

		filterAll: function () {
			app.spendings.each(this.filterOne, this);
		},

	});
})(jQuery);