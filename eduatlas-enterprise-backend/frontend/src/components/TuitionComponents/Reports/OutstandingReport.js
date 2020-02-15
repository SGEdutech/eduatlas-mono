import moment from 'moment';
import React, { Component } from 'react';

import {
	Button,
	Col,
	DatePicker,
	Row,
	Select,
	Table,
} from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const colLayout = {
	xs: 24,
	md: 12
};

const columns = [{
	title: 'Roll No.',
	dataIndex: 'rollNumber',
	key: 'rollNumber'
}, {
	title: 'Name',
	dataIndex: 'name',
	key: 'name'
}, {
	title: 'Due Date',
	dataIndex: 'nextInstallmentDate',
	key: 'nextInstallmentDate'
}, {
	title: 'Pending Balance',
	dataIndex: 'pendingBalance',
	key: 'pendingBalance'
}, {
	title: 'Course',
	dataIndex: 'courseCode',
	key: 'courseCode'
}, {
	title: 'Batch',
	dataIndex: 'batchCodes',
	key: 'batchCodes',
	render: batchCodes => batchCodes.map(batchCode => <Row justify="center" type="flex">{batchCode}</Row>)
}
];

class OutstandingReport extends Component {
	state = {
		batchCodeFilter: null,
		courseCodeFilter: null,
		fromDateFilter: null,
		toDateFilter: null
	}

	getStudentsToRender = () => {
		const { students } = this.props;
		const { toDateFilter } = this.state;
		let { fromDateFilter } = this.state;
		const studentsToRender = [];

		if (Boolean(fromDateFilter) === false) fromDateFilter = moment(0);

		students.forEach(student => {
			student.payments.forEach(payment => {
				const showUnspecifiedDueDate = true;
				const isNextInstallmentDateAvailable = Boolean(payment.nextInstallmentDate);
				let feeCollected = 0;
				payment.installments.forEach(installment => feeCollected += installment.feeCollected)

				if (showUnspecifiedDueDate) {
					const clonedStudent = JSON.parse(JSON.stringify(student));
					clonedStudent._id = student._id + '-' + payment.courseCode;
					clonedStudent.courseCode = payment.courseCode;
					clonedStudent.nextInstallmentDate = 'NA';
					clonedStudent.pendingBalance = payment.courseFee - feeCollected;
					clonedStudent.batchCodes = [];
					studentsToRender.push(clonedStudent);
				} else {
					if (isNextInstallmentDateAvailable && payment.nextInstallmentDate.isBetween(fromDateFilter, toDateFilter, 'days', '[]')) {
						// TODO: students in multiple courses needs to be cloned, moment messes up yet again
						const clonedStudent = JSON.parse(JSON.stringify(student));
						clonedStudent._id = student._id + '-' + payment.courseCode;
						clonedStudent.courseCode = payment.courseCode;
						clonedStudent.courseEnrollmentDate = payment.createdAt.format('DD/MM/YYYY');
						studentsToRender.push(clonedStudent);
					}
				}
			});
		});
		return studentsToRender;
	}

	handleCourseFilterChange = courseCodeFilter => this.setState({ courseCodeFilter })
	handleBatchFilterChange = batchCodeFilter => this.setState({ courseCodeFilter: batchCodeFilter })

	handleFromDateChange = fromDateFilter => this.setState({ fromDateFilter })
	handleToDateChange = toDateFilter => this.setState({ toDateFilter })

	render() {
		const { batches, courses } = this.props;
		const { batchCodeFilter, courseCodeFilter, fromDateFilter, toDateFilter } = this.state;
		let filteredBatches = [];
		let studentsToRender = [];

		if (Boolean(courseCodeFilter) === true) filteredBatches = batches.filter(batch => batch.courseCode === courseCodeFilter);

		if (Boolean(toDateFilter) === true) {
			studentsToRender = this.getStudentsToRender();
		}

		return (
			<div className="container">
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col className="p-1" {...colLayout}>
						<DatePicker className="w-100" format={dateFormat} onChange={this.handleFromDateChange} placeholder="From Date" />
					</Col>
					<Col className="p-1" {...colLayout}>
						<DatePicker className="w-100" format={dateFormat} onChange={this.handleToDateChange} placeholder="To Date" />
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleCourseFilterChange} placeholder="Select Course" allowClear>
							{courses.map(course => <Option key={course._id} value={course.code}>{course.code}</Option>)}
						</Select>
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleBatchFilterChange} placeholder="Select Batch" allowClear>
							{filteredBatches.map(course => <Option key={course._id} value={course.code}>{course.code}</Option>)}
						</Select>
					</Col>
					<Col span={24} className="p-1">
						<Button disabled={Boolean(fromDateFilter) === false || Boolean(toDateFilter) === false} icon="download" type="primary" block >Download Report</Button>
					</Col>
				</Row>
				<Table
					rowKey="_id"
					className="mb-3"
					bordered={true}
					pagination={false}
					dataSource={studentsToRender}
					columns={columns} />
			</div>
		);
	}
}

export default OutstandingReport;

