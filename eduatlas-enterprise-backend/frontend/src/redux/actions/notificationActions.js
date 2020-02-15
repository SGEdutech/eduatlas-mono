import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addNotification(newNotification) {
	return dispatch => {
		dispatch({
			type: 'ADD_NOTIFICATION',
			payload: axios.post(`${schemeAndAuthority}/notification`, newNotification)
		});
	};
}

export function readNotification(ids) {
	return dispatch => {
		dispatch({
			type: 'READ_NOTIFICATION',
			payload: axios.put(`${schemeAndAuthority}/notification/user-read`, ids, { withCredentials: true })
		});
	};
}
