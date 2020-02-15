import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';
import StudentNavbar from '../StudentNavbar';

import {
	Button,
	Col,
	Empty,
	Icon,
	Row
} from 'antd';

import getTuitionIdFromUrl from '../../scripts/getTuitionIdFromUrl';

class SendRequest extends Component {
	componentWillMount() {
		const { addRequest, match: { url }, requests, userInfo } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		if (Object.keys(userInfo).length === 0) return;
		const request = requests.find(request => request.email === userInfo.primaryEmail);
		if (request) return;
		const studentInfo = { email: userInfo.primaryEmail };
		studentInfo.phone = userInfo.phone;
		studentInfo.name = userInfo.lastName ? userInfo.firstName + ' ' + userInfo.lastName : userInfo.firstName;
		addRequest(tuitionId, studentInfo);
	}

	render() {
		const { requests, userInfo } = this.props;
		const sendingRequestJsx = (
			<>
				<StudentNavbar />
				<Row className="below-nav" style={{ height: '80vh' }} type="flex" justify="center" align="middle">
					<Col>
						<Row type="flex" justify="center">
							<Icon style={{ fontSize: 64 }} type="loading" theme="twoTone" spin />
						</Row>
						<Row type="flex" justify="center">
							<h1>Sending Request</h1>
						</Row>
					</Col>
				</Row>
			</>
		);
		const pendingJsx = (
			<>
				<StudentNavbar />
				<Row className="below-nav" style={{ height: '80vh' }} type="flex" justify="center" align="middle">
					<Empty className="mt-4"
						image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
						description={<span>Your request is pending ...</span>}></Empty>
				</Row>
				<Row type="flex" align="bottom" justify="center">
					<Link to="../student/free-resource"><Button type="primary">View Free Study Materials</Button></Link>
				</Row>
			</>
		);
		const request = requests.find(request => request.email === userInfo.primaryEmail);
		if (request) return pendingJsx;
		return sendingRequestJsx;
	}
}

export default withRouter(SendRequest);
