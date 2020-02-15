import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { editProfile, getUserInfo } from '../redux/actions/userActions';

import scrollToTop from '../scripts/scrollToTop';
import sanatizeFormObj from '../scripts/sanatize-form-obj';

import Navbar from './Navbar';

import {
	Button,
	Col,
	Form,
	Input,
	Row,
	InputNumber
} from 'antd';

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

class EditProfile extends Component {
	componentDidMount() {
		scrollToTop();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form, editProfile, match, history } = this.props;
		const { userId } = match.params;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			editProfile(userId, values);
			history.goBack();
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { firstName, middleName, lastName, primaryEmail, phone, secondaryEmail, addressLine1, addressLine2, city } = this.props.userInfo;

		return (
			<>
				<Navbar renderBackBtn={true} navText="Edit Profile" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="First Name"
									hasFeedback={true}>
									{getFieldDecorator('firstName', {
										initialValue: firstName,
										rules: [{
											required: true, message: 'Please provide name!'
										}]
									})(
										<Input placeholder="first name" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Middle Name"
									hasFeedback={true}>
									{getFieldDecorator('middleName', {
										initialValue: middleName
									})(
										<Input placeholder="middle name" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Last Name"
									hasFeedback={true}>
									{getFieldDecorator('lastName', {
										initialValue: lastName
									})(
										<Input placeholder="last name" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Primary Email"
									hasFeedback={true}
									// validateStatus="warning"
									help="can't be changed">
									{getFieldDecorator('primaryEmail', {
										initialValue: primaryEmail,
										rules: [{
											type: 'email', message: 'Not valid E-mail!'
										}]
									})(
										<Input readOnly />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Secondary Email"
									hasFeedback={true}>
									{getFieldDecorator('secondaryEmail', {
										initialValue: secondaryEmail,
										rules: [{
											type: 'email', message: 'Not valid E-mail!',
										}]
									})(
										<Input placeholder="secondary email" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Phone Number"
									hasFeedback={true}>
									{getFieldDecorator('phone', {
										initialValue: phone
									})(
										<InputNumber className="w-100" placeholder="phone number" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Address Line 1"
									hasFeedback={true}>
									{getFieldDecorator('addressLine1', {
										initialValue: addressLine1
									})(
										<Input placeholder="line 1" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Address Line 2"
									hasFeedback={true}>
									{getFieldDecorator('addressLine2', {
										initialValue: addressLine2
									})(
										<Input placeholder="line 2" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="City"
									hasFeedback={true}>
									{getFieldDecorator('city', {
										initialValue: city
									})(
										<Input placeholder="city" />
									)}
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											Save Changes
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
		userInfo: state.user.userInfo
	};
}

export default compose(Form.create({ name: 'edit-profile' }), withRouter, connect(mapStateToProps, { editProfile, getUserInfo }))(EditProfile);
