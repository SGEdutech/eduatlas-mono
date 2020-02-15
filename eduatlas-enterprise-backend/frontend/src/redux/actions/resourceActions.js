import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';
import convertModelToFormData from '../../scripts/modelToFormdata';

export function addResource(tuitionId, newResource) {
	const config = { headers: { 'Content-Type': 'multipart/form-data' } };
	const form_data = convertModelToFormData(newResource);
	return dispatch => {
		dispatch({
			type: 'ADD_RESOURCE',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/resource`, form_data, config)
		});
	};
}

export function deleteResource(tuitionId, resourceId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_RESOURCE',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/resource/${resourceId}`)
		});
	};
}

export const fakeAddResourceFulfilled = newResource => {
	return { type: 'ADD_RESOURCE_FULFILLED', payload: { data: newResource } };
};

export const fakeAddResourcePending = () => {
	return { type: 'ADD_RESOURCE_PENDING' };
};

export const fakeAddResourceRejected = () => {
	return { type: 'ADD_RESOURCE_REJECTED' };
};
