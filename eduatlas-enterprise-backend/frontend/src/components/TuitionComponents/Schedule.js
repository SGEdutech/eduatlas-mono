// TODO: Deprecated
import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { deleteSchedule } from '../../redux/actions/scheduleActions';
import { changeTabs } from '../../redux/actions/navigationActions';

import AddSchedule from './Schedule/AddSchedule';
import ActiveSchedules from './Schedule/ActiveSchedules';


class Schedule extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { navigation: { secondaryTabsValue } } = this.props;
		return (
			<>
				<AppBar color="default" className="z101">
					<Tabs
						className="tabBar"
						value={secondaryTabsValue}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth">
						<Tab label="Active" />
						<Tab label="Add" />
					</Tabs>
				</AppBar>
				{secondaryTabsValue === 0 && <ActiveSchedules />}
				{secondaryTabsValue === 1 && <AddSchedule />}
			</>
		);
	}
}

function mapStateToProps(state) {
	return { navigation: state.navigation, schedule: state.schedule };
}

export default connect(mapStateToProps, { changeTabs, deleteSchedule })(Schedule);
