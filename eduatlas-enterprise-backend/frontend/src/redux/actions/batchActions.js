import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addBatch(tuitionId, courseId, newBatch) {
	return dispatch => {
		dispatch({
			type: 'ADD_BATCH',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch`, newBatch)
		});
	};
}

export function editBatch(tuitionId, courseId, batchId, editedData) {
	return dispatch => {
		dispatch({
			type: 'EDIT_BATCH',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}`, editedData)
		});
	};
}

export function deleteBatch(tuitionId, courseId, batchId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_BATCH',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}`)
		});
	};
}

export function addStudentInBatch(tuitionId, courseId, batchId, studentId) {
	return dispatch => {
		dispatch({
			type: 'ADD_STUDENT_IN_BATCH',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}/student`, { students: studentId })
		});
	};
}

export function deleteStudentInBatch(tuitionId, courseId, batchId, studentId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_STUDENT_IN_BATCH',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}/student`, { data: { students: studentId } })
		});
	};
}
