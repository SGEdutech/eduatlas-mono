import moment from 'moment';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import InstallmentCollapse from './PaymentCard/InstallmentCollapse';

import {
	Card,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row
} from 'antd';
const { Panel } = Collapse;

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

class PaymentCard extends Component {
	state = {
	}

	getTotalFeeCollected = installments => {
		let totalFeeCollected = 0;
		installments.forEach(({ feeCollected }) => totalFeeCollected += feeCollected);
		return totalFeeCollected;
	}

	render() {
		const { _id: paymentId, courseCode, courseFee, taxAmount = 0, discountAmount = 0, discountReason, installments } = this.props.payment;
		const nextInstallmentDate = moment(this.props.payment.nextInstallmentDate);
		const totalFeeCollected = this.getTotalFeeCollected(installments);

		return (
			<>
				<Card className="mb-3">
					<Form onSubmit={this.handleSubmit}>
						<Row gutter={16}>
							<Col {...colLayout} className={this.state.editable ? 'd-none' : undefined}>
								<Form.Item
									{...formItemLayout}
									label="Course Code"
								>
									<Input disabled={true} value={courseCode} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Course Fee"
								>
									<InputNumber value={courseFee} className="w-100" disabled={true} step={500} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Discount Amount">
									<InputNumber value={discountAmount} className="w-100" disabled={true} step={100} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Discount Reason">
									<Input value={discountReason} disabled={true} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Net Fee">
									<InputNumber className="w-100" disabled={true} value={courseFee - discountAmount} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Tax">
									<InputNumber value={taxAmount} className="w-100" disabled={true} step={50} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Gross Fee">
									<InputNumber className="w-100" disabled={true} value={courseFee - discountAmount + taxAmount} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Pending Balance">
									<Input disabled={true} placeholder="pending balance" value={(courseFee - discountAmount + taxAmount) - totalFeeCollected} />
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									{...formItemLayout}
									label="Next Installment Date">
									<DatePicker value={nextInstallmentDate} className="w-100" disabled={true} format="DD/MM/YYYY" />
								</Form.Item>
							</Col>
						</Row>
					</Form>
					<Col span={24}>
						<Collapse>
							{installments && installments.map((installment, index) => (
								<Panel key={installment._id} header={'Installment ' + (index + 1)}>
									<InstallmentCollapse index={index} paymentId={paymentId} installment={installment} editInstallment={this.props.editInstallment} key={installment._id} />
								</Panel>
							))}
						</Collapse>
					</Col>
				</Card>
			</>
		);
	}
}

export default compose(Form.create({ name: 'add-course' }), withRouter)(PaymentCard);
