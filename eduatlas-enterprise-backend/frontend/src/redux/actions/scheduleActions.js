import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addSchedule(tuitionId, scheduleInfo) {
	return dispatch => {
		dispatch({
			type: 'ADD_SCHEDULE',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/schedule`, scheduleInfo)
		});
	};
}

export function editSchedule(tuitionId, courseId, batchId, scheduleId, editedSchedule) {
	return dispatch => {
		dispatch({
			type: 'EDIT_SCHEDULE',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}/schedule/${scheduleId}`, editedSchedule)
		});
	};
}

export function deleteSchedule(tuitionId, courseId, batchId, scheduleId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_SCHEDULE',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/course/${courseId}/batch/${batchId}/schedule/${scheduleId}`)
		});
	};
}
