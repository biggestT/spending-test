/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.NewSpendingView = Backbone.View.extend({

		el:  '#new-spending',

		template: _.template($('#new-item-template').html()),

		events: {
			'keypress input': 'updateOnEnter',
			'click #new-spending-submit': 'createOnSubmit'
		},

		initialize: function () {
			this.render();
		},

		render: function () {
			this.$el.html(this.template({'currency': app.spendings.getCurrencyName() }));
			this.$nameInput = this.$('#new-spending-name');
			this.$valueInput = this.$('#new-spending-value');
			return this;
		},

		// Generate the attributes for a new spending item.
		newAttributes: function () {
			// make sure value is number
			var vIn = this.$valueInput.val().trim();
			vIn = vIn * 1;
			return {
				title: this.$nameInput.val().trim(),
				value: vIn
			};
		},

		updateOnEnter: function (what) {
			console.log(what);
		},
		createOnSubmit: function () {
			app.spendings.create(this.newAttributes());
			this.$valueInput.val('');
			this.$nameInput.val('');
		}

	});
})(jQuery);