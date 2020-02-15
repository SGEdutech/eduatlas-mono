import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addRole(tuitionId, newRole) {
	return dispatch => {
		dispatch({
			type: 'ADD_ROLE',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/role`, newRole)
		});
	};
}

export function deleteRole(tuitionId, roleId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_ROLE',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/role/${roleId}`)
		});
	};
}
