import moment from 'moment-timezone';
import config from 'config';
import {
	INPUT_CHANGE,
	SUBMIT_TRANSACTION,
	SUBMIT_TRANSACTION_FAILURE,
	ADD_TRANSACTION_SUCCESS,
	UPDATE_TRANSACTION_SUCCESS,
	RESET_FORM
} from '../actions/form';
import { EDIT_TRANSACTION } from '../actions/account';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const timezone = 'America/New_York';

// abstract this into a function so it can be called again later
// resetting the date and time to the current value when it's called
function createInitialValues() {
	const now = moment.tz(timezone);
	return {
		amount: '',
		merchant: '',
		date: now.format(dateFormat),
		time: now.format(timeFormat),
		category: config.categories[0].slug,
		source: config.sources[0].slug,
		description: '',
		status: 'POSTED'
	};
}
const initialState = {
	action: 'add',
	focus: true,
	values: createInitialValues(),
	fields: [
		{
			type: 'number',
			attributes: {
				min: 0,
				step: 'any',
				required: true,
				autoFocus: true
			},
			label: 'Amount',
			name: 'amount'
		},
		{
			type: 'text',
			label: 'Merchant',
			name: 'merchant',
			attributes: {
				required: true,
				list: 'merchants-list'
			}
		},
		{
			type: 'date',
			label: 'Date',
			name: 'date',
			attributes: {
				required: true
			}
		},
		{
			type: 'time',
			label: 'Time',
			name: 'time',
			attributes: {
				required: true
			}
		},
		{
			type: 'select',
			label: 'Category',
			name: 'category',
			placeholder: 'Select a category',
			options: config.categories
		},
		{
			type: 'select',
			label: 'Source',
			name: 'source',
			options: config.sources
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description'
		},
		{
			type: 'select',
			label: 'Status',
			name: 'status',
			options: [
				{
					slug: 'POSTED',
					value: 'POSTED'
				}
			]
		},
		{
			type: 'hidden',
			name: 'id'
		}
	]
};

export default function form(state = initialState, action) {
	switch (action.type) {
		case SUBMIT_TRANSACTION:
			return {
				...state,
				focus: false,
				pending: true,
				action: state.action === 'add' ? 'adding...' : 'updating...'
			};
		case SUBMIT_TRANSACTION_FAILURE:
			return {
				...state,
				focus: false,
				pending: false,
				action: state.action === 'adding...' ? 'add' : 'update'
			};
		case ADD_TRANSACTION_SUCCESS:
		case UPDATE_TRANSACTION_SUCCESS:
			// after successful save to the server, reset to initial values
			return {
				...state,
				pending: false,
				values: createInitialValues(),
				action: 'add'
			};
		case RESET_FORM:
			return {
				...state,
				focus: true,
				pending: false,
				values: createInitialValues(),
				action: 'add'
			};
		case INPUT_CHANGE:
			return {
				...state,
				focus: false,
				values: {
					...state.values,
					[action.data.name]: action.data.value
				}
			};
		case EDIT_TRANSACTION:
			const date = moment.tz(action.data.date, timezone);
			return {
				...state,
				action: 'update',
				focus: true,
				values: {
					...action.data,
					amount: action.data.amount / 100,
					date: date.format(dateFormat),
					time: date.format(timeFormat)
				}
			};
		default:
			return state;
	}
}