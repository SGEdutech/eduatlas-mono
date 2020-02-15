import React from 'react';
import { withRouter } from 'react-router-dom';

import getTuitionIdFromUrl from '../scripts/getTuitionIdFromUrl';

import {
	Icon,
	Row
} from 'antd';

function Loading(props) {
	const { match: { url }, messageInfo: { fetched, kaamChaluHai }, roles, history: { replace }, students, user } = props;
	const tuitionId = getTuitionIdFromUrl(url);
	function redirectToLogin() {
		replace(url + '/login');
	}

	function redirectToTuitionManager() {
		replace(url + '/tuition');
	}

	function redirectToStudentManager() {
		replace(url + '/student');
	}

	function redirectToRequestSentPage() {
		replace(url + '/send-request');
	}

	const loadingJsx = (
		<Row style={{ height: '100vh' }} type="flex" justify="center" align="middle">
			<Icon style={{ fontSize: 64 }} type="smile" theme="twoTone" twoToneColor="#00bcd4" spin />
		</Row>
	);

	if (fetched === false || kaamChaluHai) return loadingJsx;
	if (Object.keys(user).length === 0) {
		redirectToLogin();
		return loadingJsx;
	}
	const claims = user.claims || [];
	const isAuthenticatedUser = claims.some(claim => claim.listingId === tuitionId);
	const isAuthorizedUser = roles.some(role => role.email === user.primaryEmail);
	if (isAuthenticatedUser || isAuthorizedUser) {
		redirectToTuitionManager();
		return loadingJsx;
	}
	const student = students.find(student => student.email === user.primaryEmail);
	if (student) {
		redirectToStudentManager();
		return loadingJsx;
	}
	redirectToRequestSentPage();
	return loadingJsx;
}

export default withRouter(Loading);
