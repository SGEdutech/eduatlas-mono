import React, { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';
import sanatizeFormObj from '../../../../scripts/sanatize-form-obj';
import getRandomColor from '../../../../scripts/randomColor';


import {
	Avatar,
	Card,
	Form,
	Input,
	Modal,
	Select
} from 'antd';
const { Meta } = Card;
const Option = Select.Option;
const confirm = Modal.confirm;


class PendingCard extends Component {
	handleDeleteBtnClick = () => {
		const { deleteStudent, id, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteStudent(tuitionId, id);
			}
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		const { addStudentInBatch, batches, form, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			const { batchId, studentId } = values;
			const batchInfo = batches.find(batch => batch._id === batchId);
			const courseId = batchInfo.courseId;
			addStudentInBatch(tuitionId, courseId, batchId, studentId);
		});
	}

	render() {
		const { batches, form: { getFieldDecorator }, id, name, email } = this.props;
		return (
			<Form onSubmit={this.handleSubmit}>
				<Card
					size="small"
					className="mb-3"
					actions={[
						<IconsWithTooltip onClick={this.handleSubmit} iconType="check" tooltipMessage="Add To Batch" />,
						<IconsWithTooltip onClick={this.handleDeleteBtnClick} iconType="delete" tooltipMessage="Delete Student" />
					]}
					title={
						<Meta
							avatar={<Avatar style={{ backgroundColor: getRandomColor(id) }}>{name.slice(0, 1).toUpperCase()}</Avatar>}
							title={name} />
					}>
					<Form.Item className="d-none">
						{getFieldDecorator('studentId', {
							initialValue: id
						})(
							<Input />
						)}
					</Form.Item>
					<Form.Item >
						<Input disabled defaultValue={email} />
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
				</Card>
			</Form>
		);
	}
}

export default compose(Form.create({ name: 'accept-student' }), withRouter)(PendingCard);

