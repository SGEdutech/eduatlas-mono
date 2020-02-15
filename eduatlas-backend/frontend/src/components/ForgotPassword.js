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

class ForgotPassword extends Component {
	handleSubmit = e => {
		e.preventDefault();
		const { form, history: { push } } = this.props;
		form.validateFieldsAndScroll(async (err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			try {
				this.sendMail(values);
			} catch (error) {
				console.error(error);
			}
		});
	}

	sendMail = async values => {
		const { history: { replace } } = this.props;
		const hideLoadingMessage = message.loading('Action in progress..', 0);
		try {
			const { data } = await axios.post(`${host}/forgot/request-email`, values, { withCredentials: true });
			console.log(data)
			hideLoadingMessage();
			if (Boolean(data.done) === true) {
				message.success('Mail Sent!');
				setTimeout(() => replace('/login'), 100);
			} else {
				message.error('This Email-ID is not registered!');
			}
			// FIXME
		} catch (error) {
			console.error(error);
			hideLoadingMessage();
			message.error('There was a problem Sending Mail!');
			return new Promise((__, reject) => reject());
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
								hasFeedback={true}>
								{getFieldDecorator('email', {
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
							<Form.Item>
								<Button type="primary" block htmlType="submit">
									Send Mail
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

export default withRouter(Form.create({ name: 'forgot-password' })(ForgotPassword));
