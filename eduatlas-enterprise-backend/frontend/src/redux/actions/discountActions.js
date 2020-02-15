import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addDiscount(tuitionId, newDiscount) {
	return dispatch => {
		dispatch({
			type: 'ADD_DISCOUNT',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/discount`, newDiscount)
		});
	};
}

export function editDiscount(tuitionId, discountId, editedDiscount) {
	return dispatch => {
		dispatch({
			type: 'EDIT_DISCOUNT',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/discount/${discountId}`, editedDiscount)
		});
	};
}

export function deleteDiscount(tuitionId, discountId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_DISCOUNT',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/discount/${discountId}`)
		});
	};
}
