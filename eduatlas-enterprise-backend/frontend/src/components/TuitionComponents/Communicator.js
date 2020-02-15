import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Announcements from './Communicator/Announcements';
import Navbar from '../Navbar';
import NewAnnouncement from './Communicator/NewAnnouncement';

import { changeTabs } from '../../redux/actions/navigationActions';
import { addNotification } from '../../redux/actions/notificationActions';

class Communicator extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { navigation: { secondaryTabsValue } } = this.props;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Communicator" />
				<div className="container below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							value={secondaryTabsValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth">
							<Tab label="View" />
							<Tab label="Add" />
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <Announcements messageInfo={this.props.messageInfo} announcements={this.props.notifications} />}
					{secondaryTabsValue === 1 && <NewAnnouncement messageInfo={this.props.messageInfo} batches={this.props.batches} students={this.props.students} addNotification={this.props.addNotification} />}
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
		notifications: state.notification.notifications,
		students: state.student.students
	};
}

export default connect(mapStateToProps, { addNotification, changeTabs })(Communicator);
