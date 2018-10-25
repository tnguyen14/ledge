import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyAverage(props) {
	const { numWeeks, weeks, weeklyAverage } = props;
	let duration;
	switch (numWeeks) {
		case 4:
			duration = 'month';
			break;
		case 12:
			duration = 'quarter';
			break;
		case 24:
			duration = '6 months';
			break;
		default:
			duration = `${numWeeks} weeks`;
	}
	const label = `Last ${duration}`;
	const value = weeks.length ? money(weeklyAverage) : 'Calculating...';
	return (
		<tr className="stat">
			<td>{label}</td>
			<td>{value}</td>
		</tr>
	);
}

WeeklyAverage.propTypes = {
	numWeeks: PropTypes.number,
	weeks: PropTypes.array,
	weeklyAverage: PropTypes.number
};

export default WeeklyAverage;
