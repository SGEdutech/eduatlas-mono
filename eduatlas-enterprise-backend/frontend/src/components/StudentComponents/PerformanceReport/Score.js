import moment from 'moment';
import React, { Component } from 'react';

import { inverseMinutesFromMidnight } from '../../../scripts/minutesToMidnight';
import cloneObj from '../../../scripts/cloneObj';

import {
	Col,
	Collapse,
	Divider,
	Empty,
	Row,
	Table,
	Tag
} from 'antd';

const { Panel } = Collapse;

const columnsDef = [{
	title: 'Test Name',
	dataIndex: 'name',
	key: 'name'
}, {
	title: 'Date Time',
	dataIndex: 'dateAndTime',
	key: 'dateAndTime',
	width: '50',
	render: dateAndTime => {
		return <>
			<Row justify="center" type="flex">{dateAndTime.parsedDate}</Row>
			<Row justify="center" type="flex">{dateAndTime.fromTime}-{dateAndTime.toTime}</Row>
		</>;
	}
}, {
	title: 'Score',
	dataIndex: 'marksObtained',
	key: 'marksObtained',
	width: '80'
}];

class Score extends Component {
	render() {
		const { batches, studentInfo } = this.props;
		let { tests } = this.props;
		const studentBatches = batches.filter(batch => Boolean(batch.students.find(student => student === studentInfo._id)));
		// SORT alphabetically
		studentBatches.sort((a, b) => {
			if (a.code < b.code) return -1;
			if (a.code > b.code) return 1;
			return 0;
		});
		tests = cloneObj(tests);

		const panelsJsx = studentBatches.map((batch, index) => {
			let testsOfThisBatch = tests.filter(test => test.batchIds.find(batchId => batchId === batch._id));
			testsOfThisBatch = testsOfThisBatch.sort((a, b) => a.date.startOf('day').diff(b.date.startOf('day'), 'days'));

			testsOfThisBatch.reverse().forEach(test => {
				test.marksObtained = null;
				test.reports.forEach(report => {
					if (report.studentId === studentInfo._id) {
						// check if marks are NEGATIVE MAXVALUE
						if (-report.marksObtained === Number.MAX_VALUE - 1) test.marksObtained = <Tag color="volcano">Absent</Tag>;
						else test.marksObtained = report.marksObtained + '/' + test.maxMarks;
					}
				});
				if (Boolean(test.marksObtained) === false) test.marksObtained = <Tag color="blue">NA</Tag>;
				if (moment().isBefore(test.date)) test.marksObtained = <Tag color="blue">Scheduled</Tag>;
				test.dateAndTime = {
					fromTime: Boolean(test.fromTime) === true ?
						inverseMinutesFromMidnight(test.fromTime).format('LT') :
						<Tag className="mx-0" color={'blue'}>NA</Tag>,
					parsedDate: test.date.format('DD/MM/YY'),
					toTime: Boolean(test.toTime) === true ?
						inverseMinutesFromMidnight(test.toTime).format('LT') :
						<Tag className="mx-0" color={'blue'}>NA</Tag>
				};
			});

			return <Panel
				key={index + 1}
				header={<Row>
					<Col span={12}>
						<Row>
							<Col span={24}>
								Batch
							</Col>
							<Col span={24} className="mt-1">
								<span className="h4 text-uppercase">{batch.code}</span>
							</Col>
						</Row>
					</Col>
					<Col span={2}>
						<Divider type="vertical" />
					</Col>
					<Col span={10}>
						<Row>
							<Col span={24}>
								Total Tests
							</Col>
							<Col span={24} className="mt-1">
								<span className="h4">{testsOfThisBatch.length}</span>
							</Col>
						</Row>
					</Col>
				</Row>}>
				<Table
					rowKey="_id"
					className="mb-3"
					bordered={true}
					pagination={false}
					dataSource={testsOfThisBatch}
					columns={columnsDef} />
			</Panel>;
		});

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		return (
			<div className="container">
				{studentBatches.length === 0 ? emptyJsx : <></>}
				<Collapse bordered={false}>
					{panelsJsx}
				</Collapse>
			</div>
		);
	}
}

export default Score;
