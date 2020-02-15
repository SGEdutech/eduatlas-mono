import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import eduatlasLogo from '../favicon.svg';

import { host } from '../config.json';

import {
	Avatar,
	Button,
	Col,
	Icon,
	Form,
	Input,
	InputNumber,
	message,
	Row
} from 'antd';

const colLayout = {
	xs: {
		span: 24
		// offset: 8
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
		confirmDirty: false
	};

	handleSubmit = e => {
		e.preventDefault();
		const hideLoadingMessage = message.loading('Action in progress..', 0);
		const { form, history: { replace } } = this.props;
		form.validateFieldsAndScroll(async (err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			try {
				await this.signUp(values);
				hideLoadingMessage();
				message.success('Sign-Up successful! Please log in now');
				replace('/login');
			} catch (error) {
				hideLoadingMessage();
				message.error('There was a problem signing up!');
			}
		});
	}

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
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	signUp = async values => {
		try {
			await axios.post(host + '/auth/local/signup', values);
			return true;
		} catch (error) {
			console.error(error);
			return new Promise((resolve, reject) => reject(false));
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="container">
				<Row className="mt-3" type="flex" justify="center">
					<Avatar src={eduatlasLogo} size={128} icon="user" />
				</Row>
				<Row className="mb-3" type="flex" justify="center">
					<h2 className="text-capitalize">Eduatlas</h2>
				</Row>
				<Form onSubmit={this.handleSubmit} className="pt-3">
					<Row gutter={16}>
						<Col {...colLayout}>
							<Form.Item
								// {...formItemLayout}
								hasFeedback={true}>
								{getFieldDecorator('firstName', {
									rules: [{
										required: true, message: 'Please provide name!'
									}]
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
									rules: [{
										type: 'email', message: 'Not a valid E-mail!'
									},
									{
										required: true, message: 'Please provide email!'
									}]
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
									rules: [{
										required: true, message: 'Please input your password!',
									},
									{
										validator: this.validateToNextPassword
									}]
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
									rules: [{
										required: true, message: 'Please input your password again!',
									},
									{
										validator: this.compareToFirstPassword
									}]
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
								<Link to="/login"> Login!</Link>
							</Row>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create({ name: 'signup' })(Signup));
