import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import ExcelStudentUpload from './AddStudent/ExcelStudentUpload';
import Navbar from '../../Navbar';

import { addStudent, addPayment, addInstallment } from '../../../redux/actions/studentActions';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';

import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Icon,
	Input,
	InputNumber,
	Row,
	Select
} from 'antd';

const { Option } = Select;

const colLayout = {
	xs: 24,
	lg: 12
};

const initialState = {
	selectedCourseIndex: -1,
	modeOfPayment: 'cash',
	courseCode: '',
	baseFee: 0,
	discountInfo: {
		code: '',
		amount: 0,
		isPercent: false
	},
	additionalDiscount: 0,
	gstPercentage: 0,
	feeCollected: 0
};

class AddStudent extends Component {
	state = initialState;

	componentDidMount() {
		scrollToTop();
	}

	validateRollNumber = (rule, rollNumber = '', callback) => {
		const { students } = this.props;

		rollNumber = rollNumber.trim().toLowerCase();
		if (!rollNumber) callback('invalid!');
		const isDuplicate = students.find(student => student.rollNumber === rollNumber);
		if (isDuplicate) callback('Roll Number already exists');
		callback();
	}

	validateEmail = (rule, email = '', callback) => {
		const { students } = this.props;

		email = email.trim().toLowerCase();
		if (!email) callback('invalid!');
		const isDuplicate = students.find(student => student.email === email);
		if (isDuplicate) callback('Email already exists');
		callback();
	}

	getBaseFee = courseId => {
		// TODO: Handle this error
		const courseInfo = this.props.courses.find(course => course._id === courseId);
		if (Boolean(courseInfo) === false) return 0;
		return courseInfo.fees;
	}

	calcDiscountAmount = (baseFee, discountAmount, isPercent) => {
		if (isPercent) return baseFee * (discountAmount / 100);
		return discountAmount;
	}

	calcNetFee = (baseFee, discountAmount, additionalDiscount) => {
		return baseFee - (discountAmount + additionalDiscount);
	}

	getTotalDiscountAmount = () => {
		const { baseFee, discountInfo } = this.state;
		let { additionalDiscount } = this.state;
		let discountAmount = this.calcDiscountAmount(baseFee, discountInfo.amount, discountInfo.isPercent);
		discountAmount = parseInt(discountAmount, 10) || 0;
		additionalDiscount = parseInt(additionalDiscount, 10) || 0;
		return discountAmount + additionalDiscount;
	}

	getDiscountReason = () => {
		const { additionalDiscount, baseFee, discountInfo } = this.state;
		let amountReason = '';
		let additionalReason = '';
		const code = discountInfo.code.toUpperCase();
		const discountAmount = this.calcDiscountAmount(baseFee, discountInfo.amount, discountInfo.isPercent);
		if (discountAmount) amountReason = `${code}(${discountAmount})`;
		if (additionalDiscount) additionalReason = `ADDITIONAL(${additionalDiscount})`;
		if (amountReason && additionalReason) return amountReason + ' + ' + additionalReason;
		if (amountReason) return amountReason;
		if (additionalReason) return additionalReason;
		return '';
	}

	getNetFee = () => {
		const { additionalDiscount, baseFee, discountInfo } = this.state;
		const discountAmount = this.calcDiscountAmount(baseFee, discountInfo.amount, discountInfo.isPercent);
		return this.calcNetFee(baseFee, discountAmount, additionalDiscount);
	}

	getTaxAmount = () => {
		const { additionalDiscount, baseFee, discountInfo, gstPercentage } = this.state;
		const discountAmount = this.calcDiscountAmount(baseFee, discountInfo.amount, discountInfo.isPercent);
		const netFee = this.calcNetFee(baseFee, discountAmount, additionalDiscount);
		let tax = netFee * (gstPercentage / 100);
		if (Boolean(tax) === false || tax < 0) tax = 0;
		return tax;
	}

	handleModeOfPaymentChange = value => this.setState({ modeOfPayment: value });

	handleCourseChange = courseId => {
		if (Boolean(courseId) === false) {
			this.setState({ baseFee: 0, gstPercentage: 0 });
			return;
		}
		const courseInfo = this.props.courses.find(course => course._id === courseId);
		const courseIndex = this.props.courses.findIndex(course => course._id === courseId);
		if (Boolean(courseInfo) === false) throw new Error('Course with this id could not be found');
		const { code, fees, gstPercentage } = courseInfo;
		this.setState({ baseFee: fees, gstPercentage, courseCode: code, selectedCourseIndex: courseIndex });
	}

	handleDiscountCodeChange = discountId => {
		if (Boolean(discountId) === false) {
			this.setState({ discountInfo: { code: '', amount: 0, isPercent: false } });
			return;
		}
		const discountInfo = this.props.discounts.find(discount => discount._id === discountId);
		if (Boolean(discountInfo) === false) throw new Error('Discount with this id could not be found');
		const { amount, code, isPercent } = discountInfo;
		this.setState({ discountInfo: { amount, code, isPercent } });
	}

	handleAdditionalDiscountChange = additionalDiscount => {
		additionalDiscount = additionalDiscount || 0;
		this.setState({ additionalDiscount });
	}

	handleFeeCollectedChange = feeCollected => {
		feeCollected = feeCollected || 0;
		this.setState({ feeCollected });
	}

	injectBatchInfo = values => {
		const { courseId, batchId } = values;
		if (Boolean(batchId) === false) return;
		values.batchInfo = { courseId, batchId };
	}

	injectInstallmentInfo = values => {
		if (values.payments === undefined) throw new Error('Payment not initiated');
		const installmentRegex = new RegExp('^feeCollected$|^modeOfPayment$|^bank$|^dateOfCheque$|^chequeNumber$|^cardNumber$|^transactionId$');
		const installments = values.payments[0].installments;
		const installmentObj = {};
		const keys = Object.keys(values);
		keys.forEach(key => {
			if (installmentRegex.test(key) === false) return;
			installmentObj[key] = values[key];
			delete values[key];
		});
		if (Object.keys(installmentObj).length === 0) return false;
		installments.push(installmentObj);
		return true;
	}

	// Destructive- removes courses and batches field
	injectPaymentInfo = values => {
		const paymentRegex = new RegExp('^courseCode$|^courseFee$|^taxAmount$|^discountAmount$|^discountReason$|^nextInstallmentDate$|^$|^$');
		const keys = Object.keys(values);
		const paymentObj = { installments: [] };
		keys.forEach(key => {
			if (paymentRegex.test(key) === false) return;
			paymentObj[key] = values[key];
			delete values[key];
		});
		if (values.courseId) paymentObj.courseId = values.courseId;
		values.payments = [paymentObj];
	}

	initAddInstallment = values => {
		const { addInstallment, match: { params: { studentId, paymentId }, url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const installment = values.payments[0].installments[0];
		addInstallment(tuitionId, studentId, paymentId, installment);
	}

	initAddPayment = values => {
		const { addPayment, match: { params: { studentId }, url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const payment = values.payments[0];
		addPayment(tuitionId, studentId, payment);
	}

	initAddStudent = values => {
		const { addStudent, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		addStudent(tuitionId, values);
	}

	handleSubmit = e => {
		e.preventDefault();
		const { form, form: { resetFields }, task, history } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			this.injectBatchInfo(values);
			this.injectPaymentInfo(values);
			this.injectInstallmentInfo(values);
			if (task === 'add-installment') {
				this.initAddInstallment(values);
				history.goBack();
			} else if (task === 'add-payment') {
				this.initAddPayment(values);
				history.goBack();
			} else {
				this.initAddStudent(values);
			}
			this.setState(initialState);
			resetFields();
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { addStudent, batches, courses, discounts, students, task } = this.props;
		const { selectedCourseIndex } = this.state;

		const coursesAndBatchesOpts = courses.map(course => (
			{
				value: course._id,
				label: course.code,
				children: batches.filter(batch => batch.courseId === course._id).map(batch => (
					{
						value: batch._id,
						label: batch.code
					}
				))
			}
		));

		const studentInputs = (
			task !== 'add-payment' && task !== 'add-installment' &&
			<>
				{Boolean(window.cordova) === false && <Divider orientation="left"><small className="mx-1">Bulk Upload Students</small><Icon type="arrow-down" /></Divider>}
				{Boolean(window.cordova) === false && <ExcelStudentUpload addStudent={addStudent} batches={batches} courses={courses} students={students} />}
				<Divider orientation="left"><small className="mx-1">Compulsory Fields</small><Icon type="arrow-down" /></Divider>
				<Col {...colLayout}>
					<Form.Item
						label="Roll No"
						hasFeedback={true}>
						{getFieldDecorator('rollNumber', {
							rules: [{
								required: true, message: 'Please give some Roll-number!'
							}, {
								validator: this.validateRollNumber
							}]
						})(
							<Input />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Student Name"
						hasFeedback={true}>
						{getFieldDecorator('name', {
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
						label="Student Email"
						hasFeedback={true}>
						{getFieldDecorator('email', {
							rules: [{
								type: 'email', message: 'The input is not valid E-mail!'
							},
							{
								required: true, message: 'Please provide email!'
							},
							{
								validator: this.validateEmail
							}]
						})(
							<Input />
						)}
					</Form.Item>
				</Col>
				<Divider orientation="left"><small className="mx-1">Additional Fields</small><Icon type="arrow-down" /></Divider>
				<Col {...colLayout}>
					<Form.Item
						label="Address"
						hasFeedback={true}>
						{getFieldDecorator('address', {
						})(
							<Input />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Contact Number"
						hasFeedback={true}>
						{getFieldDecorator('contactNumber', {
						})(
							<InputNumber className="w-100" />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Parent Name"
						hasFeedback={true}>
						{getFieldDecorator('parantName', {
						})(
							<Input className="w-100" />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Parent Number"
						hasFeedback={true}>
						{getFieldDecorator('parentPhone', {
						})(
							<InputNumber className="w-100" />
						)}
					</Form.Item>
				</Col>
			</>
		);

		const paymentInputs = (
			task !== 'add-installment' &&
			<>
				<Divider orientation="left"><small className="mx-1">Course Details</small><Icon type="arrow-down" /></Divider>
				<Col {...colLayout}>
					<Form.Item
						label="Select Course"
						hasFeedback={true}>
						{getFieldDecorator('courseId', {
							rules: [{
								required: true, message: 'Please select course!'
							}]
						})(
							<Select
								onChange={this.handleCourseChange}>
								{coursesAndBatchesOpts.map(course => <Option key={course.value}>{course.label}</Option>)}
							</Select>
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Select Batch"
						hasFeedback={true}>
						{getFieldDecorator('batchId', {
						})(
							<Select>
								{selectedCourseIndex !== -1 && coursesAndBatchesOpts[selectedCourseIndex].children.map(batch => <Option key={batch.value}>{batch.label}</Option>)}
							</Select>
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Discount Code"
						hasFeedback={true}>
						<Select allowClear={true} onChange={this.handleDiscountCodeChange}>
							{discounts.map(discount => <Option key={discount._id} value={discount._id}>{discount.code}</Option>)}
						</Select>
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Additional Discount"
						hasFeedback={true}>
						<InputNumber className="w-100" step={100} min={0} onChange={this.handleAdditionalDiscountChange} />
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Next Installment Date"
						hasFeedback={true}>
						{getFieldDecorator('nextInstallmentDate', {
						})(
							<DatePicker className="w-100" format="DD/MM/YYYY" />
						)}
					</Form.Item>
				</Col>
			</>
		);

		const installmentInputs = (
			<>
				<Divider orientation="left"><small className="mx-1">Installment Details</small><Icon type="arrow-down" /></Divider>
				<Col {...colLayout}>
					<Form.Item
						label="Fee Collected"
						hasFeedback={true}>
						{getFieldDecorator('feeCollected', {
							rules: [{
								required: task === 'add-installment', message: 'Please input amount!'
							}]
						})(
							<InputNumber className="w-100" step={500} min={0} onChange={this.handleFeeCollectedChange} formatter={value => `₹${value}`} />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Mode Of Payment"
						hasFeedback={true}>
						{getFieldDecorator('modeOfPayment', {
							rules: [{
								required: task === 'add-installment', message: 'Please select mode!'
							}]
						})(
							<Select onChange={this.handleModeOfPaymentChange}>
								<Option value="cash">Cash</Option>
								<Option value="card">Card</Option>
								<Option value="cheque">Cheque</Option>
								<Option value="other">Others</Option>
							</Select>
						)}
					</Form.Item>
				</Col>
				{this.state.modeOfPayment === 'cheque' &&
					<>
						<Col {...colLayout}>
							<Form.Item
								label="Date"
								hasFeedback={true}>
								{getFieldDecorator('dateOfCheque', {
								})(
									<DatePicker className="w-100" format="DD/MM/YYYY" />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								label="Bank Name"
								hasFeedback={true}>
								{getFieldDecorator('bank', {
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								label="Cheque Number"
								hasFeedback={true}>
								{getFieldDecorator('chequeNumber', {
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
					</>
				}
				{this.state.modeOfPayment === 'card' &&
					<>
						<Col {...colLayout}>
							<Form.Item
								label="Bank Name"
								hasFeedback={true}>
								{getFieldDecorator('bank', {
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
						<Col {...colLayout}>
							<Form.Item
								label="Transaction Id"
								hasFeedback={true}>
								{getFieldDecorator('transactionId', {
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
					</>
				}
				{this.state.modeOfPayment === 'other' &&
					<>
						<Col {...colLayout}>
							<Form.Item
								label="Transaction Id"
								hasFeedback={true}>
								{getFieldDecorator('transactionId', {
								})(
									<Input />
								)}
							</Form.Item>
						</Col>
					</>
				}
			</>
		);

		const dynamicInputs = (
			task !== 'add-installment' &&
			<>
				<Divider orientation="left"><small className="mx-1">Course Summary</small><Icon type="arrow-down" /></Divider>
				<Row className="p-1" style={{ border: 'thick double #b2993d', backgroundColor: '#ffdb58' }}>
					<Col span={24}>
						<Form.Item
							label="Course Code">
							{getFieldDecorator('courseCode', { initialValue: this.state.courseCode })(
								<Input readOnly />
							)}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Base Fee">
							{getFieldDecorator('courseFee', { initialValue: this.state.baseFee })(
								<Input readOnly />
							)}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Total Discount Amount">
							{getFieldDecorator('discountAmount', { initialValue: this.getTotalDiscountAmount() })(
								<Input readOnly />
							)}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Discount Reason">
							{getFieldDecorator('discountReason', { initialValue: this.getDiscountReason() })(
								<Input readOnly />
							)}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Net Fee">
							<Input readOnly value={this.getNetFee()} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label="Tax/GST">
							{getFieldDecorator('taxAmount', { initialValue: this.getTaxAmount() })(
								<Input readOnly />
							)}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Gross Fee">
							<Input readOnly value={this.getNetFee() + this.getTaxAmount()} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Pending Balance">
							<Input readOnly value={(this.getNetFee() + this.getTaxAmount()) - this.state.feeCollected} />
						</Form.Item>
					</Col>
				</Row>
			</>
		);

		return (
			<>
				{task === 'add-payment' && <Navbar renderBackBtn={true} navText="Add Course" />}
				{task === 'add-installment' && <Navbar renderBackBtn={true} navText="Add Installment" />}
				<div className={'container py-5' + (task === 'add-payment' || task === 'add-installment' ? ' below-nav' : '')}>
					<Form onSubmit={this.handleSubmit}>
						<Row gutter={16}>
							<Col xs={24} md={17}>
								{/* TODO: */}
								{/* Static Inputs */}
								{studentInputs}
								{paymentInputs}
								{installmentInputs}
							</Col>
							<Col xs={24} md={{ offset: 1, span: 6 }}>
								{/* Dynamic Inputs */}
								{dynamicInputs}
							</Col>
							<Col xs={24}>
								<Divider />
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											{task === 'add-payment' && 'Add Course'}
											{task === 'add-installment' && 'Add Installment'}
											{Boolean(task) === false && 'Add Student'}
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
		batches: state.batch.batches,
		courses: state.course.courses,
		discounts: state.discount.discounts,
		students: state.student.students
	};
}

export default compose(Form.create({ name: 'add-student' }), withRouter, connect(mapStateToProps, { addStudent, addPayment, addInstallment }))(AddStudent);
