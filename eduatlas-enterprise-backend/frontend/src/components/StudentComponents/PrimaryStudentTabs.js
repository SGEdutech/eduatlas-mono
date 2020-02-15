import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Swipeable } from 'react-swipeable';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Attendance from './Attendance';
import Notifications from './Notifications';
import ViewOrDeleteMaterials from './../TuitionComponents/StudyMaterial/ViewOrDeleteMaterials';

import { readNotification } from '../../redux/actions/notificationActions';

import {
	Icon,
	Row
} from 'antd';

class PrimaryTuitionTabs extends Component {
	state = { value: 0 };

	handleChange = (e, value) => this.setState({ value });

	leftSwipe = () => {
		this.setState(prevState => {
			const minValue = 0;
			const maxValue = 2;
			let value = prevState.value + 1;
			if (value < minValue) value = maxValue;
			if (value > maxValue) value = minValue;
			return { value };
		});
	}

	rightSwipe = () => {
		this.setState(prevState => {
			const minValue = 0;
			const maxValue = 2;
			let value = prevState.value - 1;
			if (value < minValue) value = maxValue;
			if (value > maxValue) value = minValue;
			return { value };
		});
	}

	render() {
		const { value } = this.state;
		const { batches, courses, messageInfo, notifications, readNotification, resources, schedules, students, tests, user } = this.props;
		const { primaryEmail } = user;
		const studentInfo = students.find(student => student.email === primaryEmail);
		if (Boolean(studentInfo) === false) return <></>; // TODO: Handle this!!!!

		return (
			<>
				<AppBar position="fixed" style={{ top: 40 }} className="z101">
					<Tabs
						className="tabBar"
						value={value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth">
						<Tab label={
							<>
								<Row><Icon type="notification" /></Row>
								<Row><small>Notifications</small></Row>
							</>
						} />
						<Tab label={
							<>
								<Row><Icon type="schedule" /></Row>
								<Row><small>Attendance and Schedule</small></Row>
							</>
						} />
						<Tab label={
							<>
								<Row><Icon type="file-text" /></Row>
								<Row><small>Study Material</small></Row>
							</>
						} />
					</Tabs>
				</AppBar>
				<Swipeable delta={20} onSwipedLeft={this.leftSwipe} onSwipedRight={this.rightSwipe} style={{ minHeight: '80vh' }}>
					<div className="py-3">
						{value === 0 && <Notifications messageInfo={messageInfo} notifications={notifications} readNotification={readNotification} studentEmail={studentInfo.email} />}
						{value === 1 && <Attendance batches={batches} schedules={schedules} studentInfo={studentInfo} />}
						{value === 2 && <ViewOrDeleteMaterials messageInfo={messageInfo} resources={resources} showDelete={false} />}
					</div>
				</Swipeable>
			</>
		);
	}
}

const mapStateToProps = state => ({
	batches: state.batch.batches,
	courses: state.course.courses,
	messageInfo: state.messageInfo,
	notifications: state.notification.notifications,
	resources: state.resource.resources,
	schedules: state.schedule.schedules,
	students: state.student.students,
	tests: state.test.tests,
	user: state.user.userInfo
});

export default connect(mapStateToProps, { readNotification })(PrimaryTuitionTabs);
