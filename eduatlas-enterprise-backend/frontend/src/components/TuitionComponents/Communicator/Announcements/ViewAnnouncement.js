import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
	Avatar,
	Comment,
	Table,
	Tooltip
} from 'antd';

import Navbar from '../../../Navbar';

import getRandomColor from '../../../../scripts/randomColor';
import scrollToTop from '../../../../scripts/scrollToTop';

const columns = [{
	title: 'Name',
	dataIndex: 'name',
	key: 'name'
}, {
	title: 'Roll Number',
	dataIndex: 'rollNumber',
	key: 'rollNumber',
	width: '100'
}];

class ViewAnnouncement extends Component {
	componentDidMount() {
		scrollToTop();
	}
	render() {
		const { match: { params: { announcementId }, url }, notifications, students } = this.props;
		const notificationDetails = notifications.find(notification => notification._id === announcementId);
		const receiverStudents = students.filter(student => notificationDetails.receivers.find(receiver => receiver.userEmail === student.email));
		return (
			<>
				<Navbar renderBackBtn={true} navText="View Announcement" />
				<div className="container below-nav">
					{notificationDetails && <Comment
						author={`Received By: ${notificationDetails.receivers.length}`}
						avatar={
							<Avatar style={{ backgroundColor: getRandomColor(notificationDetails._id) }}>{notificationDetails.message.slice(0, 1).toUpperCase()}</Avatar>
						}
						content={
							<p>{notificationDetails.message}</p>
						}
						datetime={
							<Tooltip title={notificationDetails.createdAt.format('lll')}>
								<span>{notificationDetails.createdAt.format('lll')}</span>
							</Tooltip>
						}
					/>}
					<Table
						bordered={true}
						className="mb-3 pt-3"
						columns={columns}
						dataSource={receiverStudents}
						pagination={false}
						rowKey="_id" />
				</div>
			</>
		);
	}
}

export default withRouter(ViewAnnouncement);
