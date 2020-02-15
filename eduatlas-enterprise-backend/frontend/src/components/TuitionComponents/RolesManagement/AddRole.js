import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Button,
	Col,
	Form,
	Input,
	Row,
	Select
} from 'antd';
const { Option } = Select;

const colLayout = {
	xs: 24,
	md: 12
};

class AddRole extends Component {
	componentDidMount() {
		scrollToTop();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { addRole, form, form: { resetFields }, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			addRole(tuitionId, values);
			resetFields();
		});
	}

	render() {
		const { form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<>
				<Form onSubmit={this.handleSubmit} className="pt-3">
					<Row gutter={16}>
						<Col {...colLayout}>
							<Form.Item
								label="Email"
								hasFeedback={true}>
								{getFieldDecorator('email', {
									rules: [{
										type: 'email', message: 'Not a valid E-mail!'
									},
									{
										required: true, message: 'Please provide email!'
									}]
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								label="Type"
								hasFeedback={true}>
								{getFieldDecorator('type', {
									rules: [{
										required: true, message: 'Role type is required!'
									}]
								})(
									<Select>
										<Option value="teacher">Teacher</Option>
										<Option value="centre manager">Centre Manager</Option>
										<Option value="counselor">Counselor/Sales</Option>
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={24}>
							<Row type="flex" justify="end">
								<Form.Item>
									<Button type="primary" htmlType="submit">
										{'Add Role'}
									</Button>
								</Form.Item>
							</Row>
						</Col>
					</Row>
				</Form>
			</>
		);
	}
}

export default compose(Form.create({ name: 'add-role' }), withRouter)(AddRole);

