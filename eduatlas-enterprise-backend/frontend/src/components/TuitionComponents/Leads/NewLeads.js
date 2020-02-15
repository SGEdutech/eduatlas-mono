import moment from 'moment';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import NewLeadCard from './NewLeadCard';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select
} from 'antd';
const Meta = Card.Meta;
const { TextArea } = Input;
const { Option } = Select;

const modalColLayout = {
	xs: 24
};
const filterColLayout = {
	xs: 24,
	sm: 12
};

class NewLeads extends Component {
	state = {
		fromDate: null,
		searchQuery: null,
		showRespondModal: false,
		toDate: null
	}

	componentDidMount() {
		scrollToTop();
	}

	getFilteredLeads = () => {
		let { newLeads = [] } = this.props;
		const { searchQuery, toDate } = this.state;
		let { fromDate } = this.state;
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, 'i');
			newLeads = newLeads.filter(lead => searchRegex.test(lead.name) || searchRegex.test(lead.message) || searchRegex.test(lead.email) || searchRegex.test(lead.phone));
		}
		if (Boolean(fromDate) === false) fromDate = moment(0);
		newLeads = newLeads.filter(lead => {
			return moment(lead.createdAt).startOf('day').diff(fromDate.startOf('day'), 'days') >= 0;
		});
		if (toDate) newLeads = newLeads.filter(lead => moment(lead.createdAt).startOf('day').diff(toDate.startOf('day'), 'days') <= 0);
		return newLeads;
	}
	handleAddLeadBtnClick = () => this.setState({ showRespondModal: true });
	handleAddLeadCancel = () => this.setState({ showRespondModal: false });
	handleFormSubmit = () => {
		const { form } = this.props;
		form.validateFieldsAndScroll(async (err, values) => {
			if (err) {
				console.log(err);
				return err;
			}
			sanatizeFormObj(values);
			this.initAddLead(values);
		});
	}
	handleFromDateChange = fromDate => this.setState({ fromDate });
	handleModalConfirm = () => this.handleFormSubmit();
	handleSearchChange = ({ currentTarget: { value: searchQuery } }) => this.setState({ searchQuery });
	handleToDateChange = toDate => this.setState({ toDate });
	initAddLead = values => {
		const { addLead, match: { url } } = this.props;

		// add comment in array
		if (values.comment) {
			const commentObj = { message: values.comment };
			delete values.comment;
			values.comments = [commentObj];
		}
		try {
			const tuitionId = getTuitionIdFromUrl(url);
			addLead(tuitionId, values);
			this.handleAddLeadCancel();
		} catch (error) {
			console.error(error);
		}
	}
	render() {
		const { colLayout, courses = [], editLead, editLeadWithComment, emptyJsx, form } = this.props;
		const { showRespondModal } = this.state;
		const { getFieldDecorator } = form;
		const newLeads = this.getFilteredLeads();
		return (
			<>
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col span={24} className="p-1">
						<Input onChange={this.handleSearchChange} placeholder="Search" allowClear />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleFromDateChange} placeholder="From Date" />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToDateChange} placeholder="To Date" />
					</Col>
				</Row>
				<Card
					className="w-100 mb-3"
					hoverable
					onClick={this.handleAddLeadBtnClick}
				>
					<Meta
						description={
							<Row align="middle" justify="center" type="flex">Add Lead</Row>
						}
					/>
				</Card>
				<Row gutter={16}>
					{newLeads.length === 0 ? emptyJsx :
						newLeads.map(leadInfo => {
							return <Col className="p-2" key={leadInfo._id} {...colLayout}>
								<NewLeadCard courses={courses} editLead={editLead} editLeadWithComment={editLeadWithComment} leadInfo={leadInfo} />
							</Col>;
						})}
				</Row>

				<Modal
					centered
					okText='Add'
					onCancel={this.handleAddLeadCancel}
					onOk={this.handleModalConfirm}
					title='Add lead'
					visible={showRespondModal}>
					<Form>
						<Row gutter={16}>
							<Col {...modalColLayout}>
								<Form.Item
									label="Student/Parent Name"
									hasFeedback={true}>
									{getFieldDecorator('name', {
										rules: [{
											required: true, message: 'Name is required!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Email"
									hasFeedback={true}>
									{getFieldDecorator('email', {
										rules: [{
											type: 'email', message: 'Not a valid E-mail!'
										}]
									})(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Phone Number"
									hasFeedback={true}>
									{getFieldDecorator('phone', {
										rules: [{
											required: true, message: 'Phone is required!'
										}]
									})(
										<InputNumber className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Query from Student/Parent"
									hasFeedback={true}>
									{getFieldDecorator('message', {
										rules: [{
											required: true, message: 'Query is required!'
										}]
									})(
										<TextArea rows={4} />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Comment"
									hasFeedback={true}>
									{getFieldDecorator('comment')(
										<TextArea rows={4} />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Course"
									hasFeedback={true}>
									{getFieldDecorator('courseId')(
										<Select>
											{courses.map(course => <Option key={course._id} value={course._id}>{course.code}</Option>)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Lead Source"
									hasFeedback={true}>
									{getFieldDecorator('source')(
										<Select>
											<Option value="eduatlas.com">Eduatlas.com</Option>
											<Option value="school campaign">School Campaign</Option>
											<Option value="pamphlets">Pamphlets</Option>
											<Option value="facebook">Facebook</Option>
											<Option value="walkin">Walk-In</Option>
											<Option value="sulekha">Sulekha</Option>
											<Option value="justdial">JustDial</Option>
											<Option value="urbanpro">UrbanPro</Option>
											<Option value="shiksha">Shiksha</Option>
											<Option value="google maps">Google Maps</Option>
											<Option value="other">Other</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Lead Strength"
									hasFeedback={true}>
									{getFieldDecorator('leadStrength')(
										<Select>
											<Option value="hot">Hot</Option>
											<Option value="warm">Warm</Option>
											<Option value="cold">Cold</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Status"
									hasFeedback={true}>
									{getFieldDecorator('status', {
										initialValue: 'active'
									})(
										<Select className="w-100">
											<Option value="active">Active</Option>
											<Option value="closed">Closed</Option>
											<Option value="enrolled">Enrolled</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Date"
									hasFeedback={true}>
									{getFieldDecorator('createdAt', {
										initialValue: moment()
									})(
										<DatePicker format="DD/MM/YY" className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...modalColLayout}>
								<Form.Item
									label="Next Follow-Up Date"
									hasFeedback={true}>
									{getFieldDecorator('nextFollowUp')(
										<DatePicker format="DD/MM/YY" className="w-100" />
									)}
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</>
		);
	}
}

export default withRouter(Form.create({ name: 'add-new-lead' })(NewLeads));
