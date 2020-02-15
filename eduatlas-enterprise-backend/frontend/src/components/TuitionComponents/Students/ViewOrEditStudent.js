import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';
import { compose } from 'redux';

import {
	editStudent, editPayment, deletePayment,
	editInstallment, deleteInstallment, mailReceipt
} from '../../../redux/actions/studentActions';

// Components
import EditStudentBatch from './ViewOrEditStudent/EditStudentBatch';
import Navbar from '../../Navbar';
import PaymentCard from './ViewOrEditStudent/PaymentCard';

// Scripts
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import getRandomColor from '../../../scripts/randomColor';
import scrollToTop from '../../../scripts/scrollToTop';

// Actions
import { addStudentInBatch, deleteStudentInBatch } from '../../../redux/actions/batchActions';

import fallBackDp from '../../../fallback-dp.svg';

import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Icon,
	Input,
	InputNumber,
	Row,
} from 'antd';
const { Meta } = Card;

const colLayout = {
	xs: 24,
	md: 12
};

class ViewOrEditStudent extends Component {
	state = {
		studentInfo: {},
		editable: false
	}

	componentDidMount() {
		scrollToTop();
	}

	handleEditBtnClick = e => this.setState({ editable: true });

	handleCancelBtnClick = e => {
		const { resetFields } = this.props.form;
		this.setState({ editable: false });
		resetFields();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { editStudent, form, form: { resetFields }, match: { params: { studentId }, url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			editStudent(tuitionId, studentId, values);
			this.setState({ editable: false });
			resetFields();
		});
	}

	static getDerivedStateFromProps(props, state) {
		const { studentId } = props.match.params;
		const studentInfo = props.students.find(studentObj => studentObj._id === studentId);
		// TODO: Implement loading for condition below
		if (studentInfo === undefined) return state;
		if (JSON.stringify(studentInfo) === JSON.stringify(state.studentInfo)) return state;
		return { ...state, studentInfo };
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { _id, name, rollNumber, email, contactNumber, address, payments, parentName, parentPhone } = this.state.studentInfo;
		const { editable } = this.state;

		return (
			<>
				<Navbar renderBackBtn={true} navText={editable ? 'Edit Student' : 'View Student'} />
				<div className="container below-nav">
					<Row gutter={16}>
						<Col className="pt-3">
							<Meta
								avatar={<Avatar style={{ backgroundColor: getRandomColor(_id) }}>{name ? name.slice(0, 1).toUpperCase() : undefined}</Avatar>}
								title={<span className="text-capitalize" style={{ fontWeight: 'bold' }}>{name}</span>}
							// description={<small>EA ID: DWAD2324DAD</small>}
							/>
							<Divider orientation="left"><small>Personal Details<Icon type="arrow-down" /></small></Divider>
						</Col>
						<Col>
							<Form onSubmit={this.handleSubmit} className="pt-3">
								<Col {...colLayout}>
									<Form.Item
										label="Name"
										hasFeedback={editable}>
										{getFieldDecorator('name', {
											initialValue: name,
											rules: [{
												required: editable, message: 'Please give name!'
											}]
										})(
											<Input disabled={!editable} placeholder="name of student" />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Email"
										hasFeedback={editable}>
										{getFieldDecorator('email', {
											initialValue: email,
											rules: [{
												type: 'email', message: 'Not a valid E-mail!'
											}, {
												required: editable, message: 'Please give email!'
											}]
										})(
											<Input disabled={!editable} placeholder="email of student" />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Roll Number"
										hasFeedback={editable}>
										{getFieldDecorator('rollNumber', {
											initialValue: rollNumber,
											rules: [{
												required: editable, message: 'Please give roll-number!'
											}]
										})(
											<Input disabled={!editable} placeholder="roll-number" />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Phone Number"
										hasFeedback={editable}>
										{getFieldDecorator('contactNumber', {
											initialValue: contactNumber
										})(
											<InputNumber disabled={!editable} className="w-100" max={99999999999} />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Address"
										hasFeedback={editable}>
										{getFieldDecorator('address', {
											initialValue: address
										})(
											<Input disabled={!editable} />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Parent Name"
										hasFeedback={editable}>
										{getFieldDecorator('parentName', {
											initialValue: parentName
										})(
											<Input disabled={!editable} />
										)}
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										label="Parent Phone"
										hasFeedback={editable}>
										{getFieldDecorator('parentPhone', {
											initialValue: parentPhone
										})(
											<InputNumber className="w-100" disabled={!editable} />
										)}
									</Form.Item>
								</Col>
								<Col span={24}>
									{!editable ? (<Row type="flex" justify="end">
										<Form.Item>
											<Button type="primary" onClick={this.handleEditBtnClick}>
												Edit
											</Button>
										</Form.Item>
									</Row>) : (<Row type="flex" justify="end">
										<Form.Item>
											<Button className="mx-3" onClick={this.handleCancelBtnClick}>
												Cancel
											</Button>
										</Form.Item>
										<Form.Item>
											<Button type="primary" htmlType="submit">
												Save Changes
											</Button>
										</Form.Item>
									</Row>)}
								</Col>
							</Form>
							<Divider orientation="left"><small>Batch Details<Icon type="arrow-down" /></small></Divider>
						</Col>
						<Col className="px-3">
							<EditStudentBatch addStudentInBatch={this.props.addStudentInBatch} batches={this.props.batches} deleteStudentInBatch={this.props.deleteStudentInBatch} />
							<Divider orientation="left"><small>Course Details<Icon type="arrow-down" /></small></Divider>
						</Col>
						<Col className="mb-3">
							<Link to="./add-payment"><Button className="mb-3" type="dashed" block={true}><Icon type="plus-circle" />Add New Course</Button></Link>
							{payments && payments.map(payment =>
								<PaymentCard
									courses={this.props.courses} payment={payment} editPayment={this.props.editPayment}
									deletePayment={this.props.deletePayment} deleteInstallment={this.props.deleteInstallment}
									editInstallment={this.props.editInstallment} key={payment._id} students={this.props.students}
									mailReceipt={this.props.mailReceipt} tuitionInfo={this.props.tuitionInfo}
								/>
							)}
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	batches: state.batch.batches,
	courses: state.course.courses,
	students: state.student.students,
	tuitionInfo: state.tuitionInfo
});

export default compose(Form.create({ name: 'edit-student' }), withRouter, connect(mapStateToProps,
	{
		addStudentInBatch,
		deleteInstallment,
		deletePayment,
		deleteStudentInBatch,
		editStudent,
		editPayment,
		editInstallment,
		mailReceipt
	}

))(ViewOrEditStudent);
