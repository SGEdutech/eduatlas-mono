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
	message,
	Row
} from 'antd';

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

class Login extends Component {
	login = async values => {
		const { updateUserInfo, history: { replace } } = this.props;
		const hideLoadingMessage = message.loading('Action in progress..', 0);
		try {
			const { data: userInfo } = await axios.post(`${host}/auth/local/login`, values, { withCredentials: true });
			hideLoadingMessage();
			message.success('Log-In successful!');
			updateUserInfo(userInfo);
			// FIXME
			setTimeout(() => replace('/'), 100);
		} catch (error) {
			console.error(error)
			hideLoadingMessage();
			message.error('There was a problem Logging-In!');
			return new Promise((__, reject) => reject());
		}
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
				this.login(values);
				push('/');
			} catch (error) {
				console.error(error);
			}
		});
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
								hasFeedback={true}>
								{getFieldDecorator('username', {
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
								hasFeedback={true}>
								{getFieldDecorator('password', {
									rules: [{
										required: true, message: 'Please input your password!'
									}]
								})(
									<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item>
								<Link to='/forgot-password'>Forgot Password</Link>
								<Button type="primary" block htmlType="submit">
									Login
								</Button>
							</Form.Item>
						</Col>
						<Col {...colLayout} className="mb-3">
							<Row type="flex" justify="center">
								<Link to="/signup"> Sign-Up!</Link>
							</Row>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create({ name: 'login' })(Login));
