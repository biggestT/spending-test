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

			// from the backbone:todo example:
			// ----
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
			var outJSON = this.model.toJSON();
			// add variables necessary for the display of the model but that 
			// should not be stored in the model
			outJSON.currencies = app.spendings.getCurrencies();
			outJSON.tagsString = this.model.get('tags').toString().replace(/,/g,' ');;
			outJSON.filteredTag = app.TagFilter;

			this.$el.html(this.template(outJSON));

			// update the views jquery components after the rendering
			this.$inputName = this.$('.edit-title');
			this.$inputTags = this.$('.edit-tags');
			this.$inputValue = this.$('.edit-value');
			this.$selectorCurrency = this.$('.edit-currency');
			this.$inputDate = this.$('.edit-time');

			// returning the result allows for chained function calls
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

			// split tag input into separate strings and put in an array
			var tagsString = this.$inputTags.val().trim().replace(/,/g, ' ');
			var tags = [];
			tags = tagsString.split(' ');

			var value = this.$inputValue.val().trim() * 1; // force this input to be a numerical value
			value = value.toFixed(2);
			var currency = this.$selectorCurrency.val();
			var time = this.$inputDate.val();

			// from the backbone>todo example>
			// ----
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
					time: time,
					tags: tags
				});

				app.spendings.trigger('sort');
				this.$el.removeClass('editing');				
			} 
			

		},

		toggleVisible: function () {
			var hidden = this.isHidden();
			this.$el.toggleClass('faded', hidden);
			this.model.set({
					'selected': !hidden
			});

			// make the currently filtered tag stand out among the others
			this.$('.tag').css('background-color', 'grey');
			this.$('.tag-'+app.TagFilter).css('background-color', 'lightskyblue');
		},

		isHidden: function () {
			if (app.TagFilter.trim().length == 0) { return false; }
			return !($.inArray(app.TagFilter, this.model.get('tags')) > -1);
		},

		submitSpending: function (e) {
			this.close();
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);