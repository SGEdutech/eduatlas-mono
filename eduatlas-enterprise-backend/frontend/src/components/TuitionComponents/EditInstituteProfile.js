import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { editTuitionInfo } from '../../redux/actions/tuitionInfoActions';

import sanatizeFormObj from '../../scripts/sanatize-form-obj';
import getTuitionIdFromUrl from '../../scripts/getTuitionIdFromUrl';
import convertModelToFormData from '../../scripts/modelToFormdata';
import scrollToTop from '../../scripts/scrollToTop';

import Navbar from '../Navbar';

import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select
} from 'antd';
const { Option } = Select;

const colLayout = {
	xs: 24,
	md: 12
};

const tuitionCategories = [
	<Option key="1" value="Tuition Centers">Tuition Centers</Option>,
	<Option key="2" value="Coaching Centers">Coaching Centers</Option>,
	<Option key="3" value="Enhanced Learning">Enhanced Learning</Option>,
	<Option key="4" value="Hobby Centers">Hobby Centers</Option>,
	<Option key="5" value="Sports Center">Sports Center</Option>,
	<Option key="6" value="Education Companies">Education Companies</Option>,
];

class EditInstituteProfile extends Component {
	componentDidMount() {
		scrollToTop();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form, editTuitionInfo, match, history } = this.props;
		const tuitionId = getTuitionIdFromUrl(match.url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			// FormData required because of arrays
			const formData = convertModelToFormData(values);
			editTuitionInfo(tuitionId, formData);
			history.goBack();
		});
	}

	validateMetaTags = (rule, value, callback) => {
		if (Boolean(value) === false) value = [];
		const letters = /^[A-Za-z]+$/;
		let isValidated = true;
		value.forEach(tag => {
			if (!tag.match(letters)) isValidated = false;
		});
		if (!isValidated) {
			callback('Illegal characters found');
		}
		callback();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { tuitionInfo } = this.props;

		return (
			<>
				<Navbar renderBackBtn={true} navText="Edit Institute Profile" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Institute Name"
									hasFeedback={true}>
									{getFieldDecorator('name', {
										initialValue: tuitionInfo.name,
										rules: [{
											required: true, message: 'Name is required!'
										}, {
											validator: this.validateInstitueName
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="City"
									hasFeedback={true}>
									{getFieldDecorator('city', {
										initialValue: tuitionInfo.city,
										rules: [{
											required: true, message: 'City is required!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="State"
									hasFeedback={true}>
									{getFieldDecorator('state', {
										initialValue: tuitionInfo.state,
										rules: [{
											required: true, message: 'State is required!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Address Line 1"
									hasFeedback={true}>
									{getFieldDecorator('addressLine1', {
										initialValue: tuitionInfo.addressLine1,
										rules: [{
											required: true, message: 'AL1 is required!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Address Line 2"
									hasFeedback={true}>
									{getFieldDecorator('addressLine2', {
										initialValue: tuitionInfo.addressLine2
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Pin Code"
									hasFeedback={true}>
									{getFieldDecorator('pin', {
										initialValue: tuitionInfo.pin
									})(
										<InputNumber className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Primary Number"
									hasFeedback={true}>
									{getFieldDecorator('primaryNumber', {
										initialValue: tuitionInfo.primaryNumber,
										rules: [{
											required: true, message: 'Phone Number is required!'
										}]
									})(
										<InputNumber className="w-100" max={99999999999} />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Secondary Number"
									hasFeedback={true}>
									{getFieldDecorator('secondaryNumber', {
										initialValue: tuitionInfo.secondaryNumber
									})(
										<InputNumber className="w-100" max={99999999999} />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Email"
									hasFeedback={true}>
									{getFieldDecorator('email', {
										initialValue: tuitionInfo.email,
										rules: [{
											type: 'email', message: 'Not a valid email!'
										}, {
											required: true, message: 'Email is required!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									label="Category"
									hasFeedback={true}>
									{getFieldDecorator('category', {
										initialValue: tuitionInfo.category,
										rules: [{
											required: true, message: 'Category is required!'
										}]
									})(
										<Select placeholder="Choose One">
											{tuitionCategories}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									extra="Meta tags will help our search alogrithm find your listing easily. Each tag must be a single word. Example: Guitar"
									label="Meta"
									hasFeedback={true}>
									{getFieldDecorator('meta', {
										initialValue: tuitionInfo.meta,
										rules: [{
											required: true, message: 'Meta is required!'
										},
										{ validator: this.validateMetaTags }]
									})(
										<Select
											maxTagTextLength={35}
											mode="tags">
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Col span={24}>
							<Row type="flex" justify="end">
								<Form.Item>
									<Button type="primary" htmlType="submit">
										Save Changes
									</Button>
								</Form.Item>
							</Row>
						</Col>
					</Form>
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		tuitionInfo: state.tuitionInfo
	};
}

export default compose(Form.create({ name: 'edit-institute-profile' }), withRouter, connect(mapStateToProps, { editTuitionInfo }))(EditInstituteProfile);
