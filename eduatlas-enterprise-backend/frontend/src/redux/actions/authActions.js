import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function signUp(userData) {
	return dispatch => {
		dispatch({
			type: 'USER_SIGNUP',
			payload: axios.post(`${schemeAndAuthority}/auth/local/signup`, userData)
		});
	};
}

export function logIn(credentials) {
	return dispatch => {
		dispatch({
			type: 'USER_SIGNUP',
			payload: axios.post(`${schemeAndAuthority}/auth/local/login`, credentials)
		});
	};
}

export function logoutOut(credentials) {
	return dispatch => {
		dispatch({
			type: 'USER_SIGNUP',
			payload: axios.post(`${schemeAndAuthority}/auth/local/signup`, credentials)
		});
	};
}
