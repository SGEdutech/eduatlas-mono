import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import {
	Avatar,
	Button,
	Col,
	Icon,
	Form,
	Input,
	message,
	Row
} from 'antd';

import eduatlasLogo from '../favicon.svg';

import { host } from '../config.json';

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

class ResetPassword extends Component {
	state = {
		confirmDirty: false
	};

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Passwords don\'t match!');
		} else {
			callback();
		}
	}

	handleConfirmBlur = e => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form, history: { push } } = this.props;
		form.validateFieldsAndScroll(async (err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			try {
				this.resetPassword(values);
			} catch (error) {
				console.error(error);
			}
		});
	}

	resetPassword = async values => {
		const { history: { replace }, match: { params: { token } } } = this.props;
		const hideLoadingMessage = message.loading('Action in progress..', 0);
		try {
			const { password } = values;
			const { data } = await axios.post(`${host}/forgot/change-password`, { password, token }, { withCredentials: true });
			console.log(data)
			hideLoadingMessage();
			if (Boolean(data.done) === true) {
				message.success('Reset Successful!');
				setTimeout(() => replace('/login'), 100);
			}
			// FIXME
		} catch (error) {
			console.error(error);
			hideLoadingMessage();
			message.error('There was a problem Reseting Password!');
			return new Promise((__, reject) => reject());
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
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
									Reset Password
								</Button>
							</Form.Item>
						</Col>
						<Col {...colLayout} className="mb-3">
							<Row type="flex" justify="center">
								<Link to="/login"> Log-In!</Link>
							</Row>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create({ name: 'reset-password' })(ResetPassword));
