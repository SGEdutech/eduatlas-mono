import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export function addStudent(tuitionId, newStudent) {
	return dispatch => {
		dispatch({
			type: 'ADD_STUDENT',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/student`, newStudent)
		});
	};
}

export function editStudent(tuitionId, studentId, editedData) {
	return dispatch => {
		dispatch({
			type: 'EDIT_STUDENT',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}`, editedData)
		});
	};
}

export function deleteStudent(tuitionId, id) {
	return dispatch => {
		dispatch({
			type: 'DELETE_STUDENT',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/student/${id}`)
		});
	};
}

export function addPayment(tuitionId, studentId, newPayment) {
	return dispatch => {
		dispatch({
			type: 'ADD_PAYMENT',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment`, newPayment)
		});
	};
}

export function editPayment(tuitionId, studentId, paymentId, editedPayment) {
	return dispatch => {
		dispatch({
			type: 'EDIT_PAYMENT',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment/${paymentId}`, editedPayment)
		});
	};
}

export function deletePayment(tuitionId, studentId, paymentId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_PAYMENT',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment/${paymentId}`)
		});
	};
}

export function addInstallment(tuitionId, studentId, paymentId, newInstallment) {
	return dispatch => {
		dispatch({
			type: 'ADD_INSTALLMENT',
			payload: axios.post(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment/${paymentId}/installment`, newInstallment)
		});
	};
}

export function editInstallment(tuitionId, studentId, paymentId, installmentId, editedInstallment) {
	return dispatch => {
		dispatch({
			type: 'EDIT_INSTALLMENT',
			payload: axios.put(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment/${paymentId}/installment/${installmentId}`, editedInstallment)
		});
	};
}

export function deleteInstallment(tuitionId, studentId, paymentId, installmentId) {
	return dispatch => {
		dispatch({
			type: 'DELETE_INSTALLMENT',
			payload: axios.delete(`${schemeAndAuthority}/tuition/${tuitionId}/student/${studentId}/payment/${paymentId}/installment/${installmentId}`)
		});
	};
}

export function mailReceipt(docDef, email) {
	return dispatch => {
		dispatch({
			type: 'SEND_RECEIPT',
			payload: axios.post(`${schemeAndAuthority}/tuition/email-receipt`, { docDef: JSON.stringify(docDef), email })
		});
	};
}
