import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { addDiscount, editDiscount } from '../../../redux/actions/discountActions';

import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import scrollToTop from '../../../scripts/scrollToTop';

import Navbar from '../../Navbar';

import {
	Button,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	Row
} from 'antd';

const colLayout = {
	xs: 24,
	md: 12
};

class AddDiscount extends Component {
	state = {
		saveAsPercentage: false,
		step: 500,
		min: 0,
		max: 9999999999,
		discountInfo: {}
	};

	componentDidMount() {
		scrollToTop();
	}

	conditionalFormatter = value => {
		if (this.state.saveAsPercentage) return `${value}%`
		return value;
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form, addDiscount, editDiscount, history, edit, match: { url, params: { discountId } } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			values.isPercent = this.state.saveAsPercentage;
			edit ? editDiscount(tuitionId, discountId, values) : addDiscount(tuitionId, values);
			history.goBack();
		});
	}

	handleSaveAsPercentageChange = e => {
		const isChecked = e.target.checked;
		// How the fuck is this working
		if (isChecked) this.setState({ saveAsPercentage: isChecked, step: 1, min: 0, max: 100 });
		else this.setState({ saveAsPercentage: isChecked, step: 500, min: 0, max: 10000000 });
	}

	validateDiscountCode = (rule, code = '', callback) => {
		const { discountId } = this.props.match.params;
		// This case will be taken care of required validator
		if (Boolean(code) === false) callback();
		code = code.trim().toLowerCase();
		if (Boolean(code) === false) callback('Discount code is required!');
		const discountInfo = this.props.discounts.filter(discount => discount._id !== discountId)
			.find(discount => discount.code === code);
		const isDuplicate = Boolean(discountInfo);
		if (isDuplicate) callback('code already exists');
		callback();
	}

	static getDerivedStateFromProps(props, state) {
		if (props.edit === false) return state;
		const { discountId } = props.match.params;
		const discountInfo = props.discounts.find(discountObj => discountObj._id === discountId);
		// TODO: Implement loading for condition below
		if (discountInfo === undefined) return state;
		if (JSON.stringify(discountInfo) === JSON.stringify(state.discountInfo)) return state;
		return { ...state, discountInfo, saveAsPercentage: discountInfo.isPercent };
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { code, amount } = this.state.discountInfo;
		return (
			<>
				<Navbar renderBackBtn={true} navText={this.props.edit ? 'Edit Discount' : 'Add Discount'} />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Discount Code"
									hasFeedback={true}>
									{getFieldDecorator('code', {
										initialValue: code,
										rules: [{
											required: true, message: 'Discount code is required!'
										}, {
											validator: this.validateDiscountCode
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Discount Amount"
									hasFeedback={true}>
									{getFieldDecorator('amount', {
										initialValue: amount,
										rules: [{
											required: true, message: 'Discount amount is required!'
										}]
									})(
										// TODO: Step and min should not be in state
										<InputNumber className="w-100" step={this.state.step} min={this.state.min} max={this.state.max} formatter={this.conditionalFormatter} />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item>
									<Checkbox checked={this.state.saveAsPercentage} onChange={this.handleSaveAsPercentageChange}>Save Discount as Percentage</Checkbox>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											{this.props.edit ? 'Edit Discount' : 'Add Discount'}
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
		discounts: state.discount.discounts
	};
}

export default compose(Form.create({ name: 'add-discount' }), withRouter, connect(mapStateToProps, { addDiscount, editDiscount }))(AddDiscount);
