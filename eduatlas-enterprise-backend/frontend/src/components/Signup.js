import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';
import { compose } from 'redux';

import { signUp } from '../redux/actions/userActions';

import {
	Avatar,
	Button,
	Col,
	Icon,
	Form,
	Input,
	InputNumber,
	Modal,
	Row
} from 'antd';

import { tuitionName } from '../config.json';
import tuitionLogo from '../tuition-logo.svg';

import getTuitionIdFromUrl from '../scripts/getTuitionIdFromUrl';

const colLayout = {
	xs: {
		span: 24
	},
	sm: {
		span: 12,
		offset: 6
	},
	lg: {
		span: 8,
		offset: 8
	}
};

class Signup extends Component {
	state = {
		confirmDirty: false,
		isModalVisible: false,
		formData: {}
	};

	initSubmit = () => {
		const { form, form: { resetFields }, history: { push }, match: { url }, signUp } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			signUp(values);
			resetFields();
			push(`/app/${tuitionId}/login`);
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form: { validateFieldsAndScroll } } = this.props;
		validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			this.setState({ isModalVisible: true, formData: values });
		});
	}

	handleModalCancel = () => this.setState({ isModalVisible: false });

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Passwords don\'t match!');
		} else {
			callback();
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	}

	handleConfirmBlur = e => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || Boolean(value) });
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { formData } = this.state;
		return (
			<div className="container">
				<Row className="mt-3" type="flex" justify="center">
					<Avatar src={tuitionLogo} size={128} icon="user" />
				</Row>
				<Row className="mb-3" type="flex" justify="center">
					<h2 className="text-capitalize">{tuitionName}</h2>
				</Row>
				<Form onSubmit={this.handleSubmit} className="pt-3">
					<Row gutter={16}>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('firstName', {
									rules: [{ required: true, message: 'Please provide name!' }]
								})(
									<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First Name" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('primaryEmail', {
									rules: [{ type: 'email', message: 'Not a valid E-mail!' },
									{ required: true, message: 'Please provide email!' }]
								})(
									<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email Address" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('phone', {
									rules: [{ required: true, message: 'Please provide phone number!' }]
								})(
									<InputNumber className="w-100" prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Phone Number" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: 'Please input your password!' },
									{ validator: this.validateToNextPassword }]
								})(
									<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('confirm', {
									rules: [{ required: true, message: 'Please input your password again!' },
									{ validator: this.compareToFirstPassword }]
								})(
									<Input onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item>
								<Button type="primary" block htmlType="submit">
									Signup
								</Button>
							</Form.Item>
						</Col>
						<Col {...colLayout} className="mb-3">
							<Row type="flex" justify="center">
								<Link to="../login"> Login!</Link>
							</Row>
						</Col>
					</Row>
				</Form>
				<Modal
					title="Please confirm details"
					visible={this.state.isModalVisible}
					onOk={this.initSubmit}
					onCancel={this.handleModalCancel}>
					{Object.keys(formData).map(key => <p key={key}>{`${key}- ${formData[key]}`}</p>)}
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		discounts: state.discount.discounts
	};
}

export default compose(Form.create({ name: 'login' }), withRouter, connect(mapStateToProps, { signUp }))(Signup);
