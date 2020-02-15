import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function editReceipt(tuitionId, receiptInfo) {
	return dispatch => {
		dispatch({
			type: 'EDIT_TUITION_INFO',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/receipt`, receiptInfo)
		});
	};
}

export function editTuitionInfo(tuitionId, tuitionInfo) {
	return dispatch => {
		dispatch({
			type: 'EDIT_TUITION_INFO',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}`, tuitionInfo)
		});
	};
}
