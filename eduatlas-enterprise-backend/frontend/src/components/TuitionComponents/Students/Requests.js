import React, { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import Navbar from '../../Navbar';

// Scripts
import getRandomColor from '../../../scripts/randomColor';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Avatar,
	Button,
	Dropdown,
	Empty,
	Form,
	Icon,
	Input,
	List,
	Menu,
	message,
	Modal,
	Row,
	Select,
	Pagination
} from 'antd';

const { confirm } = Modal;
const { Option } = Select;
const pageSize = 12;

const ifMobile = window.screen.width ? window.screen.width <= 320 : true;

class Requests extends Component {
	state = {
		search: '',
		currentPage: 1,
		itemsPerPage: pageSize,
		requestInfo: null,
		showAddStudentModal: false
	};

	componentDidMount() {
		scrollToTop();
	}

	handleMenuClick = requestInfo => this.setState({ requestInfo });

	handleRequestDelete = () => {
		const { deleteRequest, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const { requestInfo } = this.state;
		const reqId = requestInfo._id;
		deleteRequest(tuitionId, reqId);
	}

	handleRequestClick = () => this.setState({ showAddStudentModal: true });

	handleRequestModalCancel = () => this.setState({ showAddStudentModal: false })

	handlePaginationChange = (currentPage, itemsPerPage) => this.setState({ currentPage, itemsPerPage });

	handleSearchInpChange = e => this.setState({ search: e.currentTarget.value, currentPage: 1 });

	handleSubmit = e => {
		e.preventDefault();
		const { addStudent, batches, courses, form, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			const batchInfo = batches.find(batch => batch._id === values.batchId);
			if (Boolean(batchInfo) === false) return;
			const courseInfo = courses.find(course => course._id === batchInfo.courseId);
			if (Boolean(courseInfo) === false) return;
			// TODO: Throw error
			values.batchInfo = { batchId: batchInfo._id, courseId: batchInfo.courseId };
			values.payments = [{ courseCode: courseInfo.code, courseFee: courseInfo.fees }];
			delete values.batchId;
			addStudent(tuitionId, values);
		});
		// close modal
		this.handleRequestModalCancel();
	}

	initAddToLeads = async () => {
		const { requestInfo: request } = this.state;
		const { addLead, deleteRequest, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const { _id, name, email, phone = -1 } = request;
		try {
			if (Boolean(phone) === false) message.warning('No phone number found');
			await addLead(tuitionId, { name, phone, email });
			await deleteRequest(tuitionId, _id);
		} catch (err) {
			console.log(err);
		}
	}

	showDeleteConfirm = () => {
		confirm({
			title: 'Are you sure delete this request?',
			content: 'This action is permanent',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk: this.handleRequestDelete
		});
	}

	showAddToLeadConfirm = () => {
		confirm({
			title: 'Are you sure move this request?',
			content: 'This action is permanent',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk: this.initAddToLeads
		});
	}

	validateRollNumber = (rule, rollNumber = '', callback) => {
		const { students } = this.props;

		rollNumber = rollNumber.trim().toLowerCase();
		if (!rollNumber) callback('invalid!');
		const isDuplicate = students.find(student => student.rollNumber === rollNumber);
		if (isDuplicate) callback('Roll Number already exists');
		callback();
	}

	render() {
		const { batches, form: { getFieldDecorator }, requests } = this.props;
		const { currentPage, itemsPerPage, requestInfo, showAddStudentModal } = this.state;

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const requestsToRender = requests.filter(({ name, email }) => {
			const { search } = this.state;
			const searchRegex = new RegExp(search, 'i');
			return searchRegex.test(name) || searchRegex.test(email);
		});

		const requestsToRenderOnThisPage = requestsToRender.slice(itemsPerPage * (currentPage - 1), currentPage * itemsPerPage);

		const requestListJsx = (
			<List
				itemLayout="horizontal"
				dataSource={requestsToRenderOnThisPage}
				renderItem={request => (
					<List.Item actions={[
						<Dropdown trigger={['hover', 'click']} overlay={
							<Menu onClick={() => this.handleMenuClick(request)}>
								<Menu.Item className="pb-2" key="1" onClick={() => this.handleRequestClick(request)}>
									<Icon type="solution" />
									Add to Batch
			  					</Menu.Item>
								<Menu.Item className="pb-2" key="2" onClick={() => this.showAddToLeadConfirm(request)}>
									<Icon type="monitor" />
									Add to Leads
			  					</Menu.Item>
								<Menu.Item className="pb-2" key="3" onClick={this.showDeleteConfirm}>
									<Icon type="delete" />
									Delete
			  					</Menu.Item>
							</Menu>
						}>
							<Button shape="circle" icon="caret-down"></Button>
						</Dropdown>
					]}>
						<List.Item.Meta
							avatar={<Avatar style={{ backgroundColor: getRandomColor(request._id) }}>{request.name.slice(0, 1).toUpperCase()}</Avatar>}
							title={ifMobile && request.name.length > 18 ? request.name.slice(0, 15) + '...' : request.name}
							description={ifMobile && request.email.length > 18 ? request.email.slice(0, 15) + '...' : request.email}
						// title={request.name}
						// description={request.email}
						/>
					</List.Item>
				)}
			/>
		);

		return (
			<>
				<Navbar renderBackBtn={true} navText="App Downloads" />
				<div className="container below-nav py-5">
					<Row className="mb-3">
						<Input allowClear addonAfter={<Icon type="search" />} onChange={this.handleSearchInpChange} placeholder="Search Students" />
					</Row>
					{requestsToRender.length === 0 ? emptyJsx : requestListJsx}
					<Pagination current={currentPage} hideOnSinglePage={true} onChange={this.handlePaginationChange} pageSize={pageSize} total={requestsToRender.length} />
				</div>
				{/* Request Modal */}
				<Modal
					centered
					okText='Add'
					onCancel={this.handleRequestModalCancel}
					onOk={this.handleSubmit}
					title={requestInfo ? requestInfo.name : ''}
					visible={showAddStudentModal}>
					<div className="text-center">
						<Form>
							<Form.Item className="d-none">
								{getFieldDecorator('name', {
									initialValue: requestInfo ? requestInfo.name : undefined
								})(
									<Input />
								)}
							</Form.Item>
							<Form.Item >
								{getFieldDecorator('email', {
									initialValue: requestInfo ? requestInfo.email : undefined
								})(
									<Input readOnly addonAfter={<Icon type="mail" />} />
								)}
							</Form.Item>
							<Form.Item >
								{getFieldDecorator('rollNumber', {
									rules: [
										{ required: true, message: 'Please input roll number!' },
										{ validator: this.validateRollNumber }
									]
								})(
									<Input addonAfter="Roll No." />
								)}
							</Form.Item>
							<Form.Item >
								{getFieldDecorator('batchId', {
									rules: [{ required: true, message: 'Please select batch!' }]
								})(
									<Select placeholder="Select a batch">
										{batches.map(batch => <Option key={batch._id} value={batch._id}>{batch.code}</Option>)}
									</Select>
								)}
							</Form.Item>
						</Form>
					</div>
				</Modal>
			</>
		);
	}
}

export default compose(Form.create({ name: 'accept-student' }), withRouter)(Requests);
