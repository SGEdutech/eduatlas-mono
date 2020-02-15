import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import sanatizeFormObj from '../scripts/sanatize-form-obj';

import { editReceipt } from '../redux/actions/tuitionInfoActions';

import Navbar from './Navbar';

import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Row
} from 'antd';
import getTuitionIdFromUrl from '../scripts/getTuitionIdFromUrl';
import scrollToTop from '../scripts/scrollToTop';

const colLayout = {
	xs: 24,
	md: 12
};

class ReceiptConfig extends Component {
	componentDidMount() {
		scrollToTop();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { editReceipt, form, history, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			editReceipt(tuitionId, values);
			history.goBack();
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		// TODO: add terms and conditions Arr
		const {
			receiptConfigBusinessName,
			receiptConfigAddressLine1,
			receiptConfigAddressLine2,
			receiptConfigCity,
			receiptConfigState,
			receiptConfigPinCode,
			receiptConfigGstNumber
		} = this.props.tuitionInfo;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Receipt Config" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Business Name"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigBusinessName', {
										initialValue: receiptConfigBusinessName,
										rules: [{
											required: true, message: 'Please provide name!'
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
									{getFieldDecorator('receiptConfigAddressLine1', {
										initialValue: receiptConfigAddressLine1
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Address Line 2"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigAddressLine2', {
										initialValue: receiptConfigAddressLine2
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="City"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigCity', {
										initialValue: receiptConfigCity
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="State"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigState', {
										initialValue: receiptConfigState
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Pin Code"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigPinCode', {
										initialValue: receiptConfigPinCode
									})(
										<InputNumber className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Tax ID/GST"
									hasFeedback={true}>
									{getFieldDecorator('receiptConfigGstNumber', {
										initialValue: receiptConfigGstNumber
									})(
										<Input />
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
		tuitionInfo: state.tuitionInfo,
		userInfo: state.user.userInfo
	};
}

export default compose(Form.create({ name: 'receipt-config' }), withRouter, connect(mapStateToProps, { editReceipt }))(ReceiptConfig);


