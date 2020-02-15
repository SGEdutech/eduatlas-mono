import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';

import {
	Badge,
	Card,
	Col,
	Comment,
	DatePicker,
	Form,
	Input,
	List,
	message,
	Modal,
	Row,
	Select,
	Divider
} from 'antd';
const { TextArea } = Input;
const Option = Select.Option;

const colLayout = {
	xs: 24
};

const newCardStyle = { background: 'white', color: 'black' };
const hotCardStyle = { background: '#e6615a', color: 'black' };
const warmCardStyle = { background: '#ffe51d', color: 'black' };
const coldCardStyle = { background: '#00afef', color: 'black' };
const enrolledCardStyle = { background: '#00a859', color: 'black' };
const closedCardStyle = { background: 'grey', color: 'black' };

class NewLeadCard extends Component {
	state = {
		showRespondModal: false
	}
	handleFormSubmit = () => {
		const { form } = this.props;
		form.validateFieldsAndScroll(async (err, values) => {
			if (err) {
				console.log(err);
				return err;
			}
			sanatizeFormObj(values);
			if (values.comment) {
				this.initUpdateLeadWithComment(values);
			} else {
				this.initUpdateLead(values);
			}
		});
	}
	handleModalConfirm = () => {
		this.handleFormSubmit();
	}
	handleRespondLeadBtnClick = () => this.setState({ showRespondModal: true });
	handleRespondLeadCancel = () => this.setState({ showRespondModal: false });
	initUpdateLead = async values => {
		const { leadInfo, match: { url }, editLead } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		try {
			editLead(tuitionId, leadInfo._id, values);
			this.handleRespondLeadCancel();
		} catch (error) {
			console.error(error);
		}
	}
	initUpdateLeadWithComment = async values => {
		const { leadInfo, match: { url }, editLeadWithComment } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		try {
			if (values.comment) values.comment = { message: values.comment };
			editLeadWithComment(tuitionId, leadInfo._id, values);
			this.handleRespondLeadCancel();
		} catch (error) {
			console.error(error);
		}
	}

	getCardStyle = () => {
		const cardStyle = { style: newCardStyle, badgeText: 'New' };
		const { leadInfo } = this.props;
		if (leadInfo.status === 'active') {
			switch (leadInfo.leadStrength) {
				case 'hot':
					cardStyle.style = hotCardStyle;
					cardStyle.badgeText = 'Hot';
					break;
				case 'warm':
					cardStyle.style = warmCardStyle;
					cardStyle.badgeText = 'Warm';
					break;
				case 'cold':
					cardStyle.style = coldCardStyle;
					cardStyle.badgeText = 'Cold';
					break;
				default:
					break;
			}
		} else {
			switch (leadInfo.status) {
				case 'closed':
					cardStyle.style = closedCardStyle;
					cardStyle.badgeText = 'Closed';
					break;
				case 'enrolled':
					cardStyle.style = enrolledCardStyle;
					cardStyle.badgeText = 'Enrolled';
					break;
				default:
					break;
			}
		}
		return cardStyle;
	}

	render() {
		const { courses, leadInfo, form } = this.props;
		const courseInfo = courses.find(course => course._id === leadInfo.courseId);
		const { getFieldDecorator } = form;
		const { showRespondModal } = this.state;
		return (
			<>
				<Card
					actions={[<span onClick={this.handleRespondLeadBtnClick}>Respond</span>]}
					extra={<Badge style={this.getCardStyle().style} count={this.getCardStyle().badgeText} />}
					headStyle={this.getCardStyle().style}
					size="small"
					title={<small className="text-dark">Next Follow-up: {leadInfo.nextFollowUp ? moment(leadInfo.nextFollowUp).format('MMM Do YY') : 'NA'}</small>}
				>
					<Row >
						<Col span={8}>Name: </Col>
						<Col className="one-line-ellipsis" span={16}>
							{leadInfo.name}
						</Col>
					</Row>
					<Row className="text-secondary">
						<Col span={8}><small>Phone:</small> </Col>
						<Col className="one-line-ellipsis" span={16}>
							<small>{leadInfo.phone === -1 ? '' : leadInfo.phone}</small>
						</Col>
					</Row>
					<Row className="text-secondary">
						<Col span={8}><small>Course:</small> </Col>
						<Col className="one-line-ellipsis" span={16}>
							{<small>{courseInfo ? courseInfo.code : undefined}</small>}
						</Col>
					</Row>
					<Row>
						<Col span={8}><small>Date:</small> </Col>
						<Col className="one-line-ellipsis" span={16}>
							<small>{moment(leadInfo.createdAt).format('LLL')}</small>
						</Col>
					</Row>
					<Divider className="my-2" />
					<Row>
						<Col span={8}><small>Query:</small> </Col>
						<Col className="one-line-ellipsis" span={16}>
							<small>{leadInfo.message}</small>
						</Col>
					</Row>
				</Card>
				{/* Respond to lead Modal */}
				<Modal
					centered
					okText='Confirm'
					onCancel={this.handleRespondLeadCancel}
					onOk={this.handleModalConfirm}
					title='Respond to lead'
					visible={showRespondModal}>
					<Divider className="mt-0 mb-2" orientation="left">Contact Info</Divider>
					<Row className="text-secondary">
						<small>{leadInfo.name}</small>
					</Row>
					<Row className="text-secondary">
						<small>{leadInfo.phone === -1 ? '' : leadInfo.phone}</small>
					</Row>
					<Row className="text-secondary">
						<small>{leadInfo.email}</small>
					</Row>
					<Row className="text-secondary">
						<small>Lead Date: {moment(leadInfo.createdAt).format('LLL')}</small>
					</Row>
					<Divider className="my-2" orientation="left">Query</Divider>
					<Row>
						<small>{leadInfo.message}</small>
					</Row>
					<Divider className="my-2" orientation="left">Communication Log</Divider>
					<List
						className="comment-list"
						// header={`${leadInfo.comments.length} comments`}
						itemLayout="horizontal"
						dataSource={leadInfo.comments}
						renderItem={comment => (
							<li>
								<Comment
									content={comment.message}
									datetime={moment(comment.createdAt).format('LLL')}
								/>
							</li>
						)}
					/>
					<Divider orientation="left">New Comment</Divider>
					<Form>
						<Row gutter={16}>
							<Col {...colLayout}>
								<Form.Item
									label="Comment"
									hasFeedback={true}>
									{getFieldDecorator('comment')(
										<TextArea rows={4} />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Next Follow-Up Date"
									hasFeedback={true}>
									{getFieldDecorator('nextFollowUp', {
										initialValue: leadInfo.nextFollowUp ? moment(leadInfo.nextFollowUp) : undefined
									})(
										<DatePicker className="w-100" format='LLL' showTime use12Hours />
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Course"
									hasFeedback={true}>
									{getFieldDecorator('courseId', {
										initialValue: leadInfo.courseId
									})(
										<Select>
											{courses.map(course => <Option key={course._id} value={course._id}>{course.code}</Option>)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Lead Source"
									hasFeedback={true}>
									{getFieldDecorator('source', {
										initialValue: leadInfo.source
									})(
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
							<Col {...colLayout}>
								<Form.Item
									label="Lead Strength"
									hasFeedback={true}>
									{getFieldDecorator('leadStrength', {
										initialValue: leadInfo.leadStrength
									})(
										<Select>
											<Option value="hot">Hot</Option>
											<Option value="warm">Warm</Option>
											<Option value="cold">Cold</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...colLayout}>
								<Form.Item
									label="Status"
									hasFeedback={true}>
									{getFieldDecorator('status', {
										initialValue: leadInfo.status
									})(
										<Select className="w-100">
											<Option value="active">Active</Option>
											<Option value="closed">Closed</Option>
											<Option value="enrolled">Enrolled</Option>
										</Select>
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

export default withRouter(Form.create({ name: 'update-lead' })(NewLeadCard));

