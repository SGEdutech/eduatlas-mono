import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addCourse(tuitionId, newCourse) {
	return dispatch => {
		dispatch({
			type: 'ADD_COURSE',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/course`, newCourse)
		});
	};
}

export function editCourse(tuitionId, courseId, editedData) {
	return dispatch => {
		dispatch({
			type: 'EDIT_COURSE',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}`, editedData)
		});
	};
}

export function deleteCourse(tuitionId, courseId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_COURSE',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}`)
		});
	};
}
