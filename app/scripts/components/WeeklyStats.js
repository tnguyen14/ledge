import React, { PropTypes } from 'react';
import Stats from './Stats';
import config from 'config';
import { getTotal, getCategoryTotal } from '../util/total';

export default function WeeklyStats (props) {
	let stats = [];
	config.categories.forEach(function (cat) {
		const catTotal = getCategoryTotal(props.transactions, cat);
		if (catTotal === 0) {
			return;
		}
		stats.push({
			amount: catTotal,
			label: cat.value,
			slug: cat.slug
		});
	});

	stats.push({
		amount: getTotal(props.transactions),
		label: 'Total',
		slug: 'total'
	});

	return (
		<div className="summary">
			<Stats stats={stats} />
		</div>
	);
}

WeeklyStats.propTypes = {
	transactions: PropTypes.array.isRequired
};
