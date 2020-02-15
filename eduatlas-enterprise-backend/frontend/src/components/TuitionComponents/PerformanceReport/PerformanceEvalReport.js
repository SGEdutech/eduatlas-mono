import React, { Component } from 'react';

import ScoreTable from '../../StudentComponents/PerformanceReport/Score';
import Graph from '../../StudentComponents/PerformanceReport/PerformanceEvalReport';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Col,
	Empty,
	Select
} from 'antd';

const { Option } = Select;

class PerformanceEvalReport extends Component {
	state = {
		selectedStudentId: null,
		view: 'table'
	};

	componentDidMount() {
		scrollToTop();
	}

	handleStudentChange = updatedStudent => this.setState({ selectedStudentId: updatedStudent });
	handleViewChange = updatedViewVal => this.setState({ view: updatedViewVal });

	render() {
		const { batches, students, tests } = this.props;
		const { selectedStudentId, view } = this.state;

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		return (
			<div className="container py-5">
				<Col span={24} className="p-1">
					<Select
						allowClear
						className="w-100"
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						onChange={this.handleStudentChange}
						placeholder="Select Student"
						showSearch>
						{students.map(student => <Option key={student._id} value={student._id}>{student.name}</Option>)}
					</Select>
				</Col>
				<Col className="p-1" span={24}>
					<Select className="w-100" defaultValue="table" onChange={this.handleViewChange}>
						<Option value="table">Table</Option>
						<Option value="graph">Graph</Option>
					</Select>
				</Col>
				<Col className="p-1" span={24}>
					{Boolean(selectedStudentId) === true && view === 'table' && <ScoreTable batches={batches} studentInfo={{ _id: selectedStudentId }} tests={tests} />}
					{Boolean(selectedStudentId) === true && view === 'graph' && <Graph batches={batches} studentInfo={{ _id: selectedStudentId }} tests={tests} />}
					{Boolean(selectedStudentId) === false && emptyJsx}
				</Col>
			</div>
		);
	}
}

export default PerformanceEvalReport;
