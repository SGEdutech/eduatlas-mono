import moment from 'moment';
import React, { Component } from 'react';
import Navbar from '../Navbar';

import {
	Col,
	DatePicker,
	Row,
	Select,
	Table
} from 'antd';

const columns = [{
	title: 'Roll Number',
	dataIndex: 'rollNumber',
	key: 'rollNumber',
}, {
	title: 'Name',
	dataIndex: 'name',
	key: 'name',
}, {
	title: 'Contact  Number',
	dataIndex: 'contactNumber',
	key: 'contactNumber',
}, {
	title: 'Email',
	dataIndex: 'email',
	key: 'email',
}, {
	title: 'Batch Code',
	dataIndex: 'batchCode',
	key: 'batchCode',
	render: batchCodes => batchCodes.join(', ')
}, {
	title: 'DOE',
	dataIndex: 'doe',
	key: 'doe'
}, {
	title: 'Course',
	dataIndex: 'courseCode',
	key: 'courseCode'
}, {
	title: 'Fee',
	dataIndex: 'fee',
	key: 'fee'
}, {
	title: 'Discount',
	dataIndex: 'discount',
	key: 'discount'
}, {
	title: 'Received',
	dataIndex: 'received',
	key: 'received'
}, {
	title: 'Balance',
	dataIndex: 'balance',
	key: 'balance'
}];

const datePickerLayout = {
	xs: 24,
	md: 12
};

// WARNING: Don't rename these things else you die
const typesAndNamesOfReports = {
	// enrollmentReport: ['Batchwise Student Report', 'Coursewise Enrollment Report', 'DOEwise Enrollment Report'],
	enrollmentReport: ['Batchwise Student Report'],
	paymentReport: ['Collection Report', 'DOEwise balance outstanding report']
};

class Reports extends Component {
	state = {
		nameOfReport: undefined,
		selectedBatch: undefined,
		selectedCourse: undefined,
		selectedFromDate: undefined,
		selectedToDate: undefined,
		typeOfReport: undefined
	}

	getBatchWiseEnrollmentData = () => {
		const { batches, courses, students } = this.props;
		const { selectedBatch } = this.state;
		if (Boolean(selectedBatch) === false) return [];

		const selectedBatchInfo = batches.find(batch => batch._id === selectedBatch);
		const selectedBatchStudentsInfo = selectedBatchInfo.students.map(studentId => students.find(student => student._id === studentId));

		const dataToReturn = [];
		selectedBatchStudentsInfo.forEach(studentInfo => {
			studentInfo.payments.map(payment => {
				// find all batchCodes children of payment.courseCode and has studentId in their students array
				const batchCodes = [];
				const courseInfo = courses.find(course => course.code === payment.courseCode);
				if (courseInfo) courseInfo.batches.forEach(batch => {
					if (batch.students.find(studentId => studentId === studentInfo._id)) batchCodes.push(batch.code);
				});

				// compute amount received
				let amountReceivedTillDate = 0;
				payment.installments.forEach(installment => amountReceivedTillDate += installment.feeCollected);

				dataToReturn.push({
					rollNumber: studentInfo.rollNumber,
					name: studentInfo.name,
					contactNumber: studentInfo.contactNumber,
					email: studentInfo.email,
					batchCode: batchCodes,
					// FIXME: createdAt should be reurned by every payment
					doe: payment.createdAt ? payment.createdAt.format('DD/MM/YY') : moment().format('DD/MM/YY'),
					courseCode: payment.courseCode,
					fee: payment.courseFee,
					discount: payment.discountAmount,
					received: amountReceivedTillDate,
					balance: payment.courseFee - amountReceivedTillDate
				});
			});
		});
		return dataToReturn;
	}

	getDynamicSelect = () => {
		const { nameOfReport } = this.state;
		const { batches, courses } = this.props;
		if (Boolean(nameOfReport) === false) return undefined;

		if (nameOfReport.includes('Batchwise')) {
			return <Col span={24} className="p-1">
				<Select
					allowClear
					className="w-100"
					onChange={this.handleBatchSelectChange}
					placeholder="Select Batch">
					{batches.map(batch => <Select.Option key={batch._id} value={batch._id}>{batch.code}</Select.Option>)}
				</Select>
			</Col>;
		}
		if (nameOfReport.includes('Coursewise')) {
			return <Col span={24} className="p-1"><Select
				allowClear
				className="w-100"
				onChange={this.handleCourseSelectChange}
				placeholder="Select Course">
				{courses.map(course => <Select.Option key={course._id} value={course._id}>{course.code}</Select.Option>)}
			</Select></Col>;
		}
		if (nameOfReport.includes('DOEwise')) {
			return <>
				<Col className="p-1" {...datePickerLayout}><DatePicker className="w-100" placeholder="From Date" /></Col>
				<Col className="p-1" {...datePickerLayout}><DatePicker className="w-100" placeholder="To Date" /></Col>
			</>;
		}
	}

	getTable = () => {
		const { nameOfReport } = this.state;
		let dataSource = [];
		if (nameOfReport === 'Batchwise Student Report') dataSource = this.getBatchWiseEnrollmentData();
		return <Table
			rowKey="_id"
			className="my-3"
			bordered={true}
			pagination={false}
			dataSource={dataSource}
			columns={columns} />;
	}

	handleBatchSelectChange = selectedBatch => this.setState({ selectedBatch });
	handleNameOfReportSelectChange = nameOfReport => this.setState({ nameOfReport });
	handleTypeOfReportSelectChange = typeOfReport => this.setState({ nameOfReport: undefined, typeOfReport });

	render() {
		const { nameOfReport, typeOfReport } = this.state;
		const nameOfReports = typeOfReport ? typesAndNamesOfReports[typeOfReport] : [];

		const dynamicSelectJsx = this.getDynamicSelect();
		const tableJsx = this.getTable();

		return (
			<>
				<Navbar renderBackBtn={true}/>
				<div className="container mt-5">
					<Row className="mb-3" type="flex" align="middle" justify="center">
						<Col span={24} className="p-1">
							<Select
								allowClear
								className="w-100"
								onChange={this.handleTypeOfReportSelectChange}
								placeholder="Type Of Report">
								<Select.Option value="enrollmentReport">Enrollment Report</Select.Option>
								{/* <Select.Option value="paymentReport">Payment Report</Select.Option> */}
							</Select>
						</Col>
						<Col span={24} className="p-1">
							<Select
								allowClear
								className="w-100"
								onChange={this.handleNameOfReportSelectChange}
								placeholder="Report Name"
								value={nameOfReport}>
								{nameOfReports.map(name => <Select.Option key={name} value={name}>{name}</Select.Option>)}
							</Select>
						</Col>
						{dynamicSelectJsx}
						{tableJsx}
					</Row>
				</div>
			</>
		);
	}
}

export default Reports;

