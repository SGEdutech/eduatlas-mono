import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addTest(tuitionId, newTest) {
	return dispatch => {
		dispatch({
			type: 'ADD_TEST',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/test`, newTest)
		});
	};
}

export function editTest(tuitionId, testId, editedTest) {
	return dispatch => {
		dispatch({
			type: 'EDIT_TEST',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/test/${testId}`, editedTest)
		});
	};
}

export function clearMarks(tuitionId, testId) {
	return dispatch => {
		dispatch({
			type: 'CLEAR_MARKS',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/test/${testId}/marks`)
		});
	};
}

export function deleteTest(tuitionId, testId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_TEST',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/test/${testId}`)
		});
	};
}
