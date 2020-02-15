import axios from 'axios';
import React, { Component } from 'react';

import { host } from '../../config.json';
import sanatizeFormObj from '../../scripts/sanatize-form-obj';

import {
	Button,
	Col,
	Form,
	Icon,
	Input,
	InputNumber,
	message,
	Modal,
	Row
} from 'antd';
const confirm = Modal.confirm;
const TextArea = Input.TextArea;

const colLayout = {
	xs: 24,
};

class ActionButtonsInstitute extends Component {
	state = {
		claimedBy: this.props.listingDetails.claimedBy,
		confirmLoading: false,
		reportModalVisible: false
	}

	handleClaimBtnClick = () => this.showClaimConfirm();
	handleReportModalCancel = () => this.setState({ reportModalVisible: false });

	handleReportModalOk = async () => {
		this.setState({ confirmLoading: true });
		try {
			await this.handleSubmit();
			// TODO: current achitecture won't be able to difference b/w 404 and successfull request
			message.success('Issue Submitted Successfully');
		} catch (error) {
			this.setState({
				confirmLoading: false,
			});
			message.error('Action Failed');
			console.error(error)
		}
		this.setState({
			reportModalVisible: false,
			confirmLoading: false,
		});
	}

	handleReportBtnClick = () => this.showReportModal();

	handleSubmit = () => {
		const { form, listingDetails, listingType } = this.props;
		const { resetFields } = form;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			values.id = listingDetails._id;
			values.type = listingType;
			resetFields();
			return axios.post(`${host}/issue`, values)
		});
	}

	showClaimConfirm = () => {
		confirm({
			cancelText: 'No',
			content: 'We may contact you to confirm the same.',
			okText: 'Yes',
			title: 'Do you want to claim this page?',
			onOk: async () => {
				const { listingDetails, listingType } = this.props;
				try {
					const { data } = await axios.post(`${host}/user/add-claim`, { listingCategory: listingType, listingId: listingDetails._id }, { withCredentials: true })
					console.log(data)
					this.setState({ claimedBy: true });
					message.success('Page Claimed');
				} catch (error) {
					console.error(error)
					message.error('Action Failed');
				}
			}
		});
	}

	showReportModal = () => this.setState({ reportModalVisible: true });

	render() {
		const { listingDetails, listingType } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { claimedBy, confirmLoading, reportModalVisible } = this.state;
		return (
			<>
				{listingType !== 'event' && (claimedBy ?
					<Button className="mb-1 mt-3 mt-md-0" type="primary" block disabled={true}><Icon type="check" />Claimed</Button> :
					<Button className="mb-1 mt-3 mt-md-0" onClick={this.handleClaimBtnClick} type="primary" block>Claim This Page</Button>)}
				{claimedBy && listingType !== 'event' ?
					<a href={`https://erp.eduatlas.com/app/${listingDetails._id}`} rel="noopener noreferrer" target="_blank"><Button className="mb-1" type="primary" block><Icon type="appstore" />Study Monitor</Button> </a> :
					undefined
				}
				<Button className="mb-1" onClick={this.handleReportBtnClick} type="danger" block><Icon type="warning" />Report</Button>
				<Modal
					title={`Report issue with this page`}
					visible={reportModalVisible}
					onOk={this.handleReportModalOk}
					confirmLoading={confirmLoading}
					onCancel={this.handleReportModalCancel}
				>
					<Form onSubmit={this.handleSubmit}>
						<a href='http://eduatlas.in' target='_blank' rel='noopener noreferrer'><small className="text-info">Customer Support Live Chat</small></a>
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Your Name"
									hasFeedback={true}>
									{getFieldDecorator('name')(
										<Input />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Your Email Address"
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
							<Col {...colLayout}>
								<Form.Item
									label="Your Phone Number"
									hasFeedback={true}>
									{getFieldDecorator('contact')(
										<InputNumber className="w-100" />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Issue"
									hasFeedback={true}>
									{getFieldDecorator('description', {
										rules: [{
											required: true, message: 'Issue is required!'
										}]
									})(
										<TextArea autosize={{ minRows: 4 }} />
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

export default Form.create({ name: 'report-form' })(ActionButtonsInstitute);

