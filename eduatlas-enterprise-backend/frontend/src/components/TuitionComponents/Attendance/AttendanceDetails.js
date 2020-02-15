import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import ExcelAttendanceUpload from './AttendanceDetails/ExcelAttendanceUpload';
import Navbar from '../../Navbar';

import { editSchedule } from '../../../redux/actions/scheduleActions';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import getRandomColor from '../../../scripts/randomColor';
import fallBackDp from '../../../fallback-dp.svg';

import scrollToTop from '../../../scripts/scrollToTop';

import {
	Avatar,
	Button,
	Divider,
	Form,
	Icon,
	List,
	Row,
	Switch
} from 'antd';

class AttendanceDetails extends Component {
	state = { students: [] }

	componentDidMount() {
		scrollToTop();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { editSchedule, form, form: { resetFields }, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const { scheduleId } = this.props.match.params;
		const scheduleInfo = this.props.schedules.find(schedule => schedule._id === scheduleId);
		const { courseId, batchId } = scheduleInfo;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			const studentsAbsent = [];
			const keys = Object.keys(values);
			keys.forEach(key => {
				if (values[key]) return;
				studentsAbsent.push(key);
			});
			editSchedule(tuitionId, courseId, batchId, scheduleId, { studentsAbsent });
			resetFields();
		});
	}

	static getDerivedStateFromProps(props, state) {
		const { scheduleId } = props.match.params;
		const { batches, students } = props;
		const scheduleInfo = props.schedules.find(scheduleObj => scheduleObj._id === scheduleId);
		// TODO: Implement loading for condition below
		if (scheduleInfo === undefined) return state;
		const batchId = scheduleInfo.batchId;
		const batchInfo = batches.find(batch => batch._id === batchId);
		const studentInfoOfThisBatch = students.filter(student => Boolean(batchInfo.students.find(studentId => studentId === student._id)));
		studentInfoOfThisBatch.forEach(student => {
			student.isAbsent = Boolean(scheduleInfo.studentsAbsent.find(studentAbsent => studentAbsent === student._id)) === false;
		});
		if (JSON.stringify(studentInfoOfThisBatch) === JSON.stringify(state.students)) return state;
		return { ...state, students: studentInfoOfThisBatch };
	}

	render() {
		const { batches, editSchedule, schedules } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { students } = this.state;

		return (
			<>
				<Navbar renderBackBtn={true} navText="Attendance" />
				<div className="container below-nav">
					<Row>
						{Boolean(window.cordova) === false && <Divider orientation="left"><small className="mx-1">Excel Upload</small><Icon type="arrow-down" /></Divider>}
						{Boolean(window.cordova) === false && <ExcelAttendanceUpload batches={batches} editSchedule={editSchedule} schedules={schedules} students={students} />}
					</Row>
					<Divider orientation="left"><small className="mx-1">Attendance</small><Icon type="arrow-down" /></Divider>
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<List
							className="mb-3"
							itemLayout="horizontal"
							dataSource={students}
							renderItem={student => (
								<List.Item
									actions={
										[
											<Form.Item style={{ marginBottom: 0 }}>
												{getFieldDecorator(student._id, {
													initialValue: student.isAbsent,
													valuePropName: 'checked'
												})(
													<Switch />
												)}
											</Form.Item>
										]
									}>
									<List.Item.Meta
										avatar={<Avatar style={{ backgroundColor: getRandomColor(student._id) }}>{student.name.slice(0, 1).toUpperCase()}</Avatar>}
										title={student.name}
										description={'Roll Number: ' + student.rollNumber} />
								</List.Item>
							)} />
						<Row type="flex" justify="end">
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Submit Attendance
								</Button>
							</Form.Item>
						</Row>
					</Form>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	schedules: state.schedule.schedules,
	batches: state.batch.batches,
	students: state.student.students
});

export default compose(Form.create({ name: 'add-edit-attendance' }), withRouter, connect(mapStateToProps, { editSchedule }))(AttendanceDetails);
