'use strict';

var Model = require('ampersand-model');
var Transactions = require('../collections/transactions');
var config = require('config');
var statsUtil = require('../util/stats');
var config = require('config');

var Account = Model.extend({
	idAttribute: 'name',
	urlRoot: config.server_url + '/accounts',
	props: {
		name: ['string', true, ''],
		starting_balance: ['number', true, 0],
		type: ['string', true, 'BUDGET'],
		period_length: ['number', true, 7]
	},
	collections: {
		transactions: Transactions
	},
	getStats: function () {
		var stats = {
			averages: []
		};
		var numWeeks = statsUtil.totalWeeks(this.transactions);
		var self = this;
		config.categories.forEach(function (cat) {
			var slug = cat.slug;
			var items = self.transactions.models.filter(function (t) {
				return t.category === slug;
			});
			var itemsTotal = items.reduce(function (total, t) {
				return total += t.amount;
			}, 0);
			console.log(itemsTotal);
			stats.averages.push({
				label: cat.value,
				amount: itemsTotal / numWeeks,
				slug: slug
			});
		});
		return stats;
	}
});

module.exports = Account;
