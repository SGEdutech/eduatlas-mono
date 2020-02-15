import React, { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import Navbar from '../../Navbar';
import StudentSelector from './NewAnnouncement/StudentSelector';

import {
	Button,
	Col,
	Form,
	Input,
	Row
} from 'antd';

import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import sanatizeForm from '../../../scripts/sanatize-form-obj';

const { TextArea } = Input;

const colLayout = {
	xs: 24,
	md: 12
};

class NewAnnouncement extends Component {
	filterOptions = (input, option) => {
		if (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) return true;
	}

	handleBatchChange = selectedBatches => {
		const { batches, form: { setFieldsValue }, students } = this.props;
		let studentsIdsOfSelectedBatches = [];
		selectedBatches.forEach(selectedBatch => {
			const studentOfThisBatch = batches.find(batch => batch._id === selectedBatch).students;
			studentsIdsOfSelectedBatches = [...new Set([...studentsIdsOfSelectedBatches, ...studentOfThisBatch])];
		});
		const studentEmailsOfSelectedBatch = studentsIdsOfSelectedBatches.map(studentId => students.find(student => student._id === studentId).email);
		setFieldsValue({ receivers: studentEmailsOfSelectedBatch });
	}

	handleStudentChange = selectedStudents => this.setState({ selectedStudents });

	handleSelectAll = isChecked => {
		const { setFieldsValue } = this.props.form;
		const { students } = this.props;
		const allStudents = students.map(student => student.email);
		isChecked ? setFieldsValue({ receivers: allStudents }) : setFieldsValue({ receivers: [] });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { addNotification, form, form: { resetFields }, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			values.senderId = tuitionId;
			sanatizeForm(values);
			addNotification(values);
			resetFields();
		});
	}

	render() {
		const { batches, students, form: { getFieldDecorator } } = this.props;

		return (
			<>
				<Navbar renderBackBtn={true} navText="New Announcement" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							<StudentSelector
								fieldName='receivers'
								colLayout={colLayout}
								filterOptions={this.filterOptions}
								students={students}
								handleBatchChange={this.handleBatchChange}
								batches={batches}
								handleSelectAll={this.handleSelectAll}
								getFieldDecorator={getFieldDecorator} />
							<Col span={24}>
								<Form.Item
									label="Announcement Text"
									hasFeedback={true}>
									{getFieldDecorator('message', {
										rules: [{
											required: true, message: 'Please provide text!'
										}]
									})(
										<TextArea autosize={{ minRows: 4 }} />
									)}
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											Send Announcement
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

export default compose(Form.create({ name: 'new-announcement' }), withRouter)(NewAnnouncement);
