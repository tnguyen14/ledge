'use strict';

var moment = require('moment-timezone');

function weeksInBetween(beginning, end) {
	if (!beginning || !end) {
		throw new Error('Beginning and end dates are needed to calculate the number of weeks.');
	}
	var beginningWeek = moment(beginning).week();
	var beginningYear = moment(beginning).year();
	var endWeek = moment(end).week();
	var endYear = moment(end).year();
	return (52 - beginningWeek) + endWeek + (endYear - beginningYear -1) * 52;
}

/**
 * calculate the number of weeks a transactions collection span
 * @param transactions {collection} the collection of transactions
 */
function totalWeeks(transactions) {
	var beginning = transactions.models[transactions.length - 1].date;
	var end = transactions.models[0].date;
	return weeksInBetween(beginning, end);
}

module.exports.totalWeeks = totalWeeks;