import React, { PropTypes } from 'react';
import { money } from '../util/helpers';
import { Table } from 'react-bootstrap';
import slug from 'slug';

export default function Stats (props) {
	const { stats, label } = props;

	return (
		<div className="stats">
			<h3>{label}</h3>
			<Table>
				<tbody>
					{stats.map(function (stat) {
						const id = slug(stat.slug + ' ' + label);
						return (
							<tr className="stat" key={stat.slug} data-cat={stat.slug}>
								<td id={id}><span className="legend">&nbsp;</span>{stat.label}</td>
								<td aria-labelledby={id}>{money(stat.amount)}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
}

Stats.propTypes = {
	stats: PropTypes.array.isRequired,
	label: PropTypes.string
};
