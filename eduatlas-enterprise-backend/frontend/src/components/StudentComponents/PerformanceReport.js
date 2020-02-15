import React, { Component } from 'react';

import scrollToTop from '../../scripts/scrollToTop';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PerformanceEvalReport from './PerformanceReport/PerformanceEvalReport';
import Navbar from '../StudentNavbar';
import Score from './PerformanceReport/Score';

class PerformanceReport extends Component {
	state = { value: 0 };

	componentDidMount() {
		scrollToTop();
	}

	handleChange = (e, value) => this.setState({ value });

	render() {
		const { batches, studentInfo, tests } = this.props;
		const { value } = this.state;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Edit Profile" />
				<div className="container below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							indicatorColor="primary"
							onChange={this.handleChange}
							scrollButtons="auto"
							textColor="primary"
							value={value}
							variant="fullWidth">
							<Tab label="Table" />
							<Tab label="Graph" />
						</Tabs>
					</AppBar>
					{value === 0 && <Score batches={batches} studentInfo={studentInfo} tests={tests} />}
					{value === 1 && <PerformanceEvalReport batches={batches} studentInfo={studentInfo} tests={tests} />}
				</div>
			</>
		);
	}
}

export default PerformanceReport;
