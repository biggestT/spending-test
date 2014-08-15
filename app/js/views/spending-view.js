/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.SpendingView = Backbone.View.extend({

		tagName:  'li',

		template: _.template($('#item-template').html()),

		events: {
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'click .submit-spending': 'submitSpending',
			// 'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		render: function () {
			// Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our TodoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$inputName = this.$('.edit-title');
			this.$inputValue = this.$('.edit-value');
			this.$selectorCurrency = this.$('.edit-currency');
			this.$inputDate = this.$('.edit-time');
			return this;
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function (e) {
			this.$inputName.focus();
			this.$el.addClass('editing');
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {
			var title = this.$inputName.val().trim();
			var value = this.$inputValue.val().trim() * 1; // force this input to be a numerical value
			value = value.toFixed(2);
			var currency = this.$selectorCurrency.val();
			var time = this.$inputDate.val();
			// We don't want to handle blur events from an item that is no
			// longer being edited. Relying on the CSS class here has the
			// benefit of us not having to maintain state in the DOM and the
			// JavaScript logic.
			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (title && value) {
				// if this is a new model we want to add it to our collection
				if (this.model.isNew()) {
					var modelToAdd = this.model.clone();
					app.spendings.add(modelToAdd);
				}
				// or if this is just update we dont need to add any new model
				else {
					modelToAdd = this.model;
				}
				// persist changes to localstorage
				modelToAdd.save({ 
					title: title,
					value: value,
					currency: currency,
					time: time
				});

				modelToAdd.trigger('change');
				this.$el.removeClass('editing');				
			} 
			

		},

		// If you hit `enter`, we're through editing the item.
		submitSpending: function (e) {
			this.close();
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);