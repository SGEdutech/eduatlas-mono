import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addRequest(tuitionId, newRequest) {
	return dispatch => {
		dispatch({
			type: 'ADD_REQUEST',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/request`, newRequest)
		});
	};
}

export function deleteRequest(tuitionId, reqId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_REQUEST',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/request/${reqId}`)
		});
	};
}
