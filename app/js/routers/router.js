var app = app || {};

(function () {
	'use strict';


	var SpendingsRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.TagFilter = param || '';


			// if (app.TagFilter != ' ') {
				app.spendings.trigger('filter');
			// }

		}
	});

	app.SpendingsRouter = new SpendingsRouter();
	Backbone.history.start(); 
})();