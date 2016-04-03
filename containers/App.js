import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlertMessage from '../containers/AlertMessage';
import NewTransaction from '../containers/NewTransaction';
import AccountStats from '../components/AccountStats';
import Transactions from '../components/Transactions';
import LoadMore from '../components/LoadMore';
import ConfirmDelete from './ConfirmDelete';
import { editTransaction, confirmDelete, loadMore } from '../actions';

function App (props) {
	return (
		<div className="main">
			<AlertMessage/>
			<NewTransaction/>
			<AccountStats transactions={props.account.transactions} />
			<Transactions weeks={props.weeks} transactions={props.account.transactions} onEditClick={props.editTransaction} onDeleteClick={props.confirmDelete}/>
			<LoadMore onClick={props.loadMore}/>
			<ConfirmDelete/>
		</div>
	);
}

App.propTypes = {
	account: PropTypes.object.isRequired,
	weeks: PropTypes.array.isRequired
};

function mapStateToProps (state) {
	return {
		account: state.account,
		weeks: state.weeks
	};
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({editTransaction, confirmDelete, loadMore}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
