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
	title: 'Date',
	dataIndex: 'courseEnrollmentDate',
	key: 'courseEnrollmentDate'
}, {
	title: 'Course',
	dataIndex: 'courseCode',
	key: 'courseCode'
}
];

class EnrollmentReport extends Component {
	state = {
		courseCodeFilter: null,
		fromDateFilter: null,
		toDateFilter: null
	}

	componentDidMount() {
		this.resizeTable();
	}

	getStudentsToRender = () => {
		const { students } = this.props;
		const { fromDateFilter, toDateFilter } = this.state;
		const studentsToRender = [];

		students.forEach(student => {
			student.payments.forEach(payment => {
				if (payment.createdAt.isBetween(fromDateFilter, toDateFilter, 'days', '[]')) {
					// TODO: students in multiple courses needs to be cloned, moment messes up yet again
					const clonedStudent = JSON.parse(JSON.stringify(student));
					clonedStudent._id = student._id + '-' + payment.courseCode;
					clonedStudent.courseCode = payment.courseCode;
					clonedStudent.courseEnrollmentDate = payment.createdAt.format('DD/MM/YYYY');
					studentsToRender.push(clonedStudent);
				}
			});
		});
		return studentsToRender;
	}

	handleCourseFilterChange = courseCodeFilter => this.setState({ courseCodeFilter })

	handleFromDateChange = fromDateFilter => this.setState({ fromDateFilter })
	handleToDateChange = toDateFilter => this.setState({ toDateFilter })

	resizeTable = () => {
		if (window.innerWidth <= 375) columns.find(col => col.key === 'rollNumber').className = 'd-none';
	}

	sortStudents = students => students.sort((a, b) => {
		if (a.courseEnrollmentDate.valueOf() >= b.courseEnrollmentDate.valueOf()) return 1;
		return -1;
	});

	render() {
		const { courses } = this.props;
		const { courseCodeFilter, fromDateFilter, toDateFilter } = this.state;
		let studentsToRender = [];

		if (Boolean(fromDateFilter) === true && Boolean(toDateFilter) === true) {
			studentsToRender = this.getStudentsToRender();
		}

		if (Boolean(courseCodeFilter) === true) {
			studentsToRender = studentsToRender.filter(student => student.courseCode === courseCodeFilter);
		}

		// sort students on basis of courseEnrollmentDate
		this.sortStudents(studentsToRender);

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

export default EnrollmentReport;

