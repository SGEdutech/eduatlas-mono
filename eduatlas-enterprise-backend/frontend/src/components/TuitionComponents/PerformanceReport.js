import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addTest, clearMarks, deleteTest, editTest } from '../../redux/actions/testActions';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AddScore from './PerformanceReport/AddScore';
import Navbar from '../Navbar';
import PerformanceEvalReport from './PerformanceReport/PerformanceEvalReport';
import Test from './PerformanceReport/Test';

import { changeTabs } from '../../redux/actions/navigationActions';

import {
	Icon,
	Row
} from 'antd';

class PerformanceReport extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { addTest, batches, clearMarks, deleteTest, editTest, messageInfo, students, tests } = this.props;
		const { navigation: { secondaryTabsValue } } = this.props;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Test And Reports" />
				<div className="container below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							value={secondaryTabsValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth">
							<Tab label={
								<>
									<Row><Icon type="form" /></Row>
									<Row><small>Tests</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="plus-square" /></Row>
									<Row><small>Add Score</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="line-chart" /></Row>
									<Row><small>Reports</small></Row>
								</>
							} />
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <Test addTest={addTest} batches={batches} deleteTest={deleteTest} editTest={editTest} messageInfo={messageInfo} tests={tests} />}
					{secondaryTabsValue === 1 && <AddScore batches={batches} clearMarks={clearMarks} editTest={editTest} students={students} tests={tests} />}
					{secondaryTabsValue === 2 && <PerformanceEvalReport batches={batches} students={students} tests={tests} />}
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		batches: state.batch.batches,
		messageInfo: state.messageInfo,
		navigation: state.navigation,
		schedule: state.schedule,
		students: state.student.students,
		tests: state.test.tests
	};
}

export default connect(mapStateToProps, { addTest, changeTabs, clearMarks, deleteTest, editTest })(PerformanceReport);


