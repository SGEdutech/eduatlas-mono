/* global FCMPlugin */
import axios from 'axios';
import { tuitionId, schemeAndAuthority } from '../../config.json';

export function getUserInfo() {
	return dispatch => {
		dispatch({
			type: 'FETCH_USER',
			payload: axios.post(`${schemeAndAuthority}/user/info`)
		});
	};
}

export function editProfile(userId, editedUser) {
	return dispatch => {
		dispatch({
			type: 'EDIT_PROFILE',
			payload: axios.put(`${schemeAndAuthority}/user/${userId}`, editedUser)
		});
	};
}

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
		if (window.cordova) {
			FCMPlugin.getToken(registrationToken => {
				credentials.registrationDetails = { registrationToken, tuitionId };
				dispatch({
					type: 'USER_LOGIN',
					payload: axios.post(`${schemeAndAuthority}/auth/local/login`, credentials)
				});
			});
		} else {
			dispatch({
				type: 'USER_LOGIN',
				payload: axios.post(`${schemeAndAuthority}/auth/local/login`, credentials, { withCredentials: true })
			});
		}
	};
}

// Email is only needed in case of cordova to remove registration id from firebase
export function logOut(email) {
	return dispatch => {
		if (window.cordova) {
			FCMPlugin.getToken(registrationToken => {
				const data = { email, registrationDetails: { registrationToken, tuitionId } };
				dispatch({
					type: 'USER_LOGOUT',
					payload: axios.post(`${schemeAndAuthority}/auth/local/logout`, data)
				});
			});
		} else {
			dispatch({
				type: 'USER_LOGOUT',
				payload: axios.post(`${schemeAndAuthority}/auth/local/logout`, {}, { withCredentials: true })
			});
		}
	};
}

