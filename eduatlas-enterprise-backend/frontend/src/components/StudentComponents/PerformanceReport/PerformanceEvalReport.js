import React, { Component } from 'react';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';

import {
	Col,
	Collapse,
	Divider,
	Empty,
	Row
} from 'antd';

const { Panel } = Collapse;

// TODO: Shove this in constructor
const options = {
	tooltip: { trigger: 'axis' },
	legend: { data: ['average %', 'highest %', 'lowest %', 'your %'] },
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: { type: 'category' },
	yAxis: {
		name: '% Marks',
		nameGap: 30,
		nameLocation: 'middle',
		type: 'value'
	},
	series: [
		{ name: 'average %', type: 'line' },
		{ name: 'highest %', type: 'line' },
		{ name: 'lowest %', type: 'line' },
		{ name: 'your %', type: 'line' }
	]
};

class PerformanceEvalReport extends Component {
	render() {
		const { batches, tests, studentInfo } = this.props;
		const studentBatches = batches.filter(batch => Boolean(batch.students.find(student => student === studentInfo._id)));

		const panelsJsx = studentBatches.map((batch, index) => {
			let testsOfThisBatch = tests.filter(test => test.batchIds.find(batchId => batchId === batch._id));
			testsOfThisBatch = testsOfThisBatch.sort((a, b) => a.date.startOf('day').diff(b.date.startOf('day'), 'days'));
			const averageScores = [],
				highestScores = [],
				lowestScores = [],
				studentScores = [],
				testNames = [];

			testsOfThisBatch.forEach(test => {
				let numAbsents = 0;
				let isTestRelevant = false;
				let averageScore = 0, highestScore = 0;
				let lowestScore = test.maxMarks;
				let studentScore = null;
				const testName = test.name;

				test.reports.forEach(report => {
					const { marksObtained, studentId } = report;
					// check if student absent
					if (-marksObtained === Number.MAX_VALUE - 1) {
						numAbsents++;
					} else {
						if (studentId === studentInfo._id) {
							isTestRelevant = true;
							studentScore = marksObtained;
						}
						averageScore += marksObtained;
						if (marksObtained > highestScore) highestScore = marksObtained;
						if (marksObtained < lowestScore) lowestScore = marksObtained;
					}
				});
				if (isTestRelevant) {
					testNames.push(testName);
					averageScore /= (test.reports.length - numAbsents);
					averageScores.push(parseFloat((averageScore / test.maxMarks) * 100).toFixed(2));
					highestScores.push(parseFloat((highestScore / test.maxMarks) * 100).toFixed(2));
					lowestScores.push(parseFloat((lowestScore / test.maxMarks) * 100).toFixed(2));
					studentScores.push(parseFloat((studentScore / test.maxMarks) * 100).toFixed(2));
				}
				test.parsedDate = test.date.format('DD/MM/YY');
			});

			const graphOptionsOfThisBatch = JSON.parse(JSON.stringify(options));
			graphOptionsOfThisBatch.xAxis.data = testNames;
			graphOptionsOfThisBatch.series.forEach(series => {
				if (series.name === 'average %') series.data = averageScores;
				if (series.name === 'highest %') series.data = highestScores;
				if (series.name === 'lowest %') series.data = lowestScores;
				if (series.name === 'your %') series.data = studentScores;
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
				<ReactEchartsCore
					echarts={echarts}
					option={graphOptionsOfThisBatch}
					notMerge={true}
					lazyUpdate={true} />
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

export default PerformanceEvalReport;
