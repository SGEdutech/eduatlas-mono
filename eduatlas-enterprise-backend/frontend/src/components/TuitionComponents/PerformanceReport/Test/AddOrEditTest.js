import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { addTest, editTest } from '../../../../redux/actions/testActions';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../../scripts/sanatize-form-obj';
import { minutesFromMidnight } from '../../../../scripts/minutesToMidnight';
import { inverseMinutesFromMidnight } from '../../../../scripts/minutesToMidnight';
import scrollToTop from '../../../../scripts/scrollToTop';

import Navbar from '../../../Navbar';

import { DatePicker as DatePickerM, List } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	TimePicker
} from 'antd';
const { Option } = Select;


const colLayout = {
	xs: 24,
	md: 12
};

class AddOrEditTest extends Component {
	state = {
		testInfo: {}
	}

	componentDidMount() {
		scrollToTop();
	}

	static getDerivedStateFromProps(props, state) {
		if (props.edit === false) return state;
		const { testId } = props.match.params;
		const testInfo = props.tests.find(test => test._id === testId);
		// TODO: Implement loading for condition below
		if (testInfo === undefined) return state;
		if (JSON.stringify(testInfo) === JSON.stringify(state.testInfo)) return state;
		return { ...state, testInfo };
	}

	calibrateFromAndToTime = values => {
		const timeRegex = new RegExp('^fromTime|^toTime');
		const keys = Object.keys(values);
		const timeKeys = keys.filter(key => timeRegex.test(key));
		timeKeys.forEach(timeKey => values[timeKey] = minutesFromMidnight(values[timeKey]));
	}

	handleSubmit = e => {
		e.preventDefault();
		const { addTest, edit, editTest, form, form: { resetFields }, match: { params: { testId }, url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			this.calibrateFromAndToTime(values);
			edit ? editTest(tuitionId, testId, values) : addTest(tuitionId, values);
			resetFields();
		});
	}

	validateTestName = (rule, testName = '', callback) => {
		const { testId } = this.props.match.params;
		const { tests } = this.props;
		testName = testName.trim().toLowerCase();
		if (!testName) callback('invalid!');
		const testInfo = tests.filter(test => test._id !== testId).find(test => test.name === testName);
		const isDuplicate = Boolean(testInfo);
		if (isDuplicate) callback('name already exists');
		callback();
	}

	render() {
		const { batches, form: { getFieldDecorator } } = this.props;
		const { batchIds, date, maxMarks, name } = this.state.testInfo;
		let { fromTime, toTime } = this.state.testInfo;
		fromTime = Boolean(fromTime) === true ? inverseMinutesFromMidnight(fromTime) : undefined;
		toTime = Boolean(toTime) === true ? inverseMinutesFromMidnight(toTime) : undefined;

		return (
			<>
				<Navbar renderBackBtn={true} navText={this.props.edit ? 'Edit Test' : 'Add Test'} />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Test Name"
									hasFeedback={true}>
									{getFieldDecorator('name', {
										initialValue: name,
										rules: [{
											required: true, message: 'Please give some name!'
										}, {
											validator: this.validateTestName
										}]
									})(
										<Input placeholder="Test Name/Code" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Max Score"
									hasFeedback={true}>
									{getFieldDecorator('maxMarks', {
										initialValue: maxMarks,
										rules: [{
											required: true, message: 'Max Score is required!'
										}]
									})(
										<InputNumber className="w-100" step={10} />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Date"
									hasFeedback={true}>
									{getFieldDecorator('date', {
										initialValue: date,
										rules: [{
											required: true, message: 'Date is required!'
										}]
									})(
										<DatePicker className="w-100" format="DD/MM/YYYY" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								{window.cordova ? (
									<Form.Item
										label="From Time"
										hasFeedback={true}>
										{getFieldDecorator('fromTime', {
											initialValue: fromTime && fromTime.toDate()
										})(
											<DatePickerM
												mode="time"
												minuteStep={2}
												use12Hours={true}
												locale={enUs}>
												<List.Item style={{ border: '1px solid #D3D3D3', borderRadius: '5px' }} arrow="horizontal"></List.Item>
											</DatePickerM>
										)}
									</Form.Item>
								) : (
										<Form.Item
											label="From Time"
											hasFeedback={true}>
											{getFieldDecorator('fromTime', {
												initialValue: fromTime
											})(
												<TimePicker className="w-100" use12Hours format="h:mm a" />
											)}
										</Form.Item>
									)}
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="To Time"
									hasFeedback={true}>
									{window.cordova ? (
										getFieldDecorator('toTime', {
											initialValue: toTime && toTime.toDate()
										})(
											<DatePickerM
												mode="time"
												minuteStep={2}
												use12Hours={true}
												locale={enUs}>
												<List.Item style={{ border: '1px solid #D3D3D3', borderRadius: '5px' }} arrow="horizontal"></List.Item>
											</DatePickerM>
										)
									) : (
											getFieldDecorator('toTime', {
												initialValue: toTime && toTime
											})(
												<TimePicker className="w-100" use12Hours format="h:mm a" />
											)
										)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Select Batch(s)"
									hasFeedback={true}>
									{getFieldDecorator('batchIds', {
										initialValue: batchIds,
										rules: [{
											required: true, message: 'Select atleast one batch!'
										}]
									})(
										<Select
											allowClear
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											mode="multiple"
											placeholder="Select"
											showSearch
										>
											{batches.map(batch => <Option key={batch._id} value={batch._id}>{batch.code}</Option>)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											{this.props.edit ? 'Edit Test' : 'Add Test'}
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

function mapStateToProps(state) {
	return {
		batches: state.batch.batches,
		tests: state.test.tests
	};
}

export default compose(Form.create({ name: 'add-edit-test' }), withRouter, connect(mapStateToProps, { addTest, editTest }))(AddOrEditTest);

