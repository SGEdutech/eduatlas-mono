import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addLead(tuitionId, newLead) {
	return dispatch => {
		dispatch({
			type: 'ADD_LEAD',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/lead`, newLead)
		});
	};
}

export function editLead(tuitionId, leadId, editedLead) {
	return dispatch => {
		dispatch({
			type: 'EDIT_LEAD',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/lead/${leadId}`, editedLead)
		});
	};
}

export function editLeadWithComment(tuitionId, leadId, editedLead) {
	return dispatch => {
		dispatch({
			type: 'EDIT_LEAD',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/lead/${leadId}/comment`, editedLead)
		});
	};
}

export function addMultipleLeads(tuitionId, leads) {
	return dispatch => {
		dispatch({
			type: 'ADD_MULTIPLE_LEAD',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/lead/multiple`, { leads })
		});
	};
}

/* export function deleteDiscount(tuitionId, discountId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_DISCOUNT',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/discount/${discountId}`)
		});
	};
} */
