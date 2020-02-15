import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';

import {
	Button,
	Col,
	DatePicker,
	Form,
	Row,
	Select
} from 'antd';
const { WeekPicker } = DatePicker;
const { Option } = Select;

const colLayout = {
	xs: 24,
	md: 12
};

function CloneSchedules(props) {
	const { batches, form: { getFieldDecorator }, getBatchWiseSchedule } = props;

	const handleSubmit = e => {
		e.preventDefault();
		const { addSchedule, batchId, form, form: { resetFields }, hideModal, match: { url }, schedules, weekNumber } = props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			const schedulesOfThisBatch = schedules.filter(schedule => schedule.batchId === batchId);
			let schedulesToClone = getBatchWiseSchedule(schedulesOfThisBatch).find(schedulesObj => Object.keys(schedulesObj).length !== 0)[weekNumber];
			const weekDiffrence = values.week.week() - weekNumber;
			schedulesToClone = schedulesToClone.map(schedule => {
				return {
					date: schedule.date.clone(),
					faculty: schedule.faculty,
					fromTime: schedule.fromTime,
					topic: schedule.topic,
					toTime: schedule.toTime
				};
			});
			schedulesToClone.forEach(schedule => schedule.date.add(weekDiffrence, 'w'));
			addSchedule(tuitionId, { batches: values.batches, schedules: schedulesToClone });
			hideModal();
			resetFields();
		});
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Row gutter={16}>
				<Col {...colLayout}>
					<Form.Item
						label="Select Week"
						hasFeedback={true}>
						{getFieldDecorator('week', {
							rules: [{
								required: true, message: 'Week is required!'
							}]
						})(
							<WeekPicker className="w-100" />
						)}
					</Form.Item>
				</Col>
				<Col {...colLayout}>
					<Form.Item
						label="Select Batch"
						hasFeedback={true}>
						{getFieldDecorator('batches', {
							rules: [{
								required: true, message: 'Batch is required!'
							}]
						})(
							<Select
								allowClear={true}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								mode="multiple"
								showSearch>
								{batches.map(batch => <Option key={batch._id} value={batch._id}>{batch.code}</Option>)}
							</Select>
						)}
					</Form.Item>
				</Col>
				<Col span={24}>
					<Row type="flex" justify="end">
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save
							</Button>
						</Form.Item>
					</Row>
				</Col>
			</Row>
		</Form>
	);
}

export default compose(Form.create({ name: 'clone-schedules' }), withRouter)(CloneSchedules);
