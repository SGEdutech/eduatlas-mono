import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { editSchedule } from '../../../redux/actions/scheduleActions';

import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import { inverseMinutesFromMidnight, minutesFromMidnight } from '../../../scripts/minutesToMidnight';
import scrollToTop from '../../../scripts/scrollToTop';

import Navbar from '../../Navbar';

import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	Row,
	TimePicker
} from 'antd';

const format = 'h:mm a';

const formItemLayout = {
	labelCol: {
	},
	wrapperCol: {
	}
};

const colLayout = {
	xs: 24,
	md: 12
};

class EditSchedule extends Component {
	state = { scheduleInfo: {} };

	componentDidMount() {
		scrollToTop();
	}

	calibrateTimeInps = values => {
		if (values.fromTime) values.fromTime = minutesFromMidnight(values.fromTime.toDate());
		if (values.toTime) values.toTime = minutesFromMidnight(values.toTime.toDate());
	}

	handleSubmit = e => {
		e.preventDefault();
		const { editSchedule, form, history, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const { scheduleInfo: { courseId, batchId, _id: scheduleId } } = this.state;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			this.calibrateTimeInps(values);
			editSchedule(tuitionId, courseId, batchId, scheduleId, values);
			history.goBack();
		});
	}

	static getDerivedStateFromProps(props, state) {
		const { scheduleId } = props.match.params;
		const scheduleInfo = props.schedules.find(scheduleObj => scheduleObj._id === scheduleId);
		// TODO: Implement loading for condition below
		if (scheduleInfo === undefined) return state;
		if (JSON.stringify(scheduleInfo) === JSON.stringify(state.scheduleInfo)) return state;
		return { ...state, scheduleInfo };
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { faculty, topic, date } = this.state.scheduleInfo;
		let { fromTime, toTime } = this.state.scheduleInfo;
		fromTime = inverseMinutesFromMidnight(fromTime);
		toTime = inverseMinutesFromMidnight(toTime);
		return (
			<>
				<Navbar renderBackBtn={true} navText="Edit Schedule" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Date"
									hasFeedback={true}>
									{getFieldDecorator('date', {
										initialValue: date,
										rules: [{
											required: true, message: 'Please choose date!'
										}]
									})(
										<DatePicker className="w-100" format="DD/MM/YYYY" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="From Time"
									hasFeedback={true}>
									{getFieldDecorator('fromTime', {
										initialValue: fromTime,
										rules: [{ required: true, message: 'Please enter time!' }]
									})(
										<TimePicker use12Hours={true} format={format} minuteStep={10} className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="To Time"
									hasFeedback={true}>
									{getFieldDecorator('toTime', {
										initialValue: toTime,
										rules: [{ required: true, message: 'Please enter time!' }]
									})(
										<TimePicker use12Hours={true} format={format} minuteStep={10} className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Topic"
									hasFeedback={true}>
									{getFieldDecorator('topic', {
										initialValue: topic,
										rules: [{
											required: true, message: 'Please input topic!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Faculty"
									hasFeedback={true}>
									{getFieldDecorator('facilty', {
										initialValue: faculty,
										rules: [{
											required: true, message: 'Please input faculty!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											Edit Schedule
									</Button>
									</Form.Item>
								</Row>
							</Col>
						</Row>
					</Form>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({ schedules: state.schedule.schedules });

export default compose(Form.create({ name: 'edit-schedule' }), withRouter, connect(mapStateToProps, { editSchedule }))(EditSchedule);
