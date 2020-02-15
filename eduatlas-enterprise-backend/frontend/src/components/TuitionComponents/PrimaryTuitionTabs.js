import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActiveSchedules from './Schedule/ActiveSchedules';
import ViewOrDeleteMaterials from './StudyMaterial/ViewOrDeleteMaterials';

import { changeTabs } from '../../redux/actions/navigationActions';
import { deleteResource } from '../../redux/actions/resourceActions';

import getTuitionIdFromUrl from '../../scripts/getTuitionIdFromUrl';
import rolesConfig from '../../roles-config.json';

import {
	Icon,
	Row
} from 'antd';

class PrimaryTuitionTabs extends Component {
	getRoleType = () => {
		const { messageInfo: { fetched }, roles, match: { url }, user: { claims = [], primaryEmail } } = this.props;
		if (!fetched) return;
		const tuitionId = getTuitionIdFromUrl(url);
		let roleType = null;
		const roleFromConfig = roles.find(role => role.email === primaryEmail);
		if (claims.some(claim => claim.listingId === tuitionId)) return 'super admin';
		if (roleFromConfig) roleType = roleFromConfig.type;
		return roleType;
	}

	handleChange = (e, value) => this.props.changeTabs(value, 0);

	leftSwipe = () => {
		const { changeTabs, navigation: { primaryTabsValue } } = this.props;
		const minValue = 0;
		const maxValue = 3;
		let newPrimaryTabsValue = primaryTabsValue + 1;
		if (newPrimaryTabsValue < minValue) newPrimaryTabsValue = maxValue;
		if (newPrimaryTabsValue > maxValue) newPrimaryTabsValue = minValue;
		changeTabs(newPrimaryTabsValue, 0);
	}

	rightSwipe = () => {
		const { changeTabs, navigation: { primaryTabsValue } } = this.props;
		const minValue = 0;
		const maxValue = 3;
		let newPrimaryTabsValue = primaryTabsValue - 1;
		if (newPrimaryTabsValue < minValue) newPrimaryTabsValue = maxValue;
		if (newPrimaryTabsValue > maxValue) newPrimaryTabsValue = minValue;
		changeTabs(newPrimaryTabsValue, 0);
	}

	//FIXME: This should be on shared scripts
	isAccessGranted = moduleName => {
		const { messageInfo: { fetched }, user: { primaryEmail } } = this.props;
		if (!fetched || !primaryEmail) return false;
		const roleType = this.getRoleType();
		if (roleType === 'super admin') return true;
		return rolesConfig[roleType].some(accessModules => accessModules === moduleName);
	}

	render() {
		const { navigation: { primaryTabsValue } } = this.props;
		const { deleteResource, messageInfo, resources } = this.props;
		return (
			<>
				<AppBar className="z101">
					<Tabs
						className="tabBar"
						style={{ background: '#f6f6f6' }}
						value={primaryTabsValue}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth">
						{this.isAccessGranted('schedules') && <Tab label={
							<>
								<Row><Icon type="schedule" /></Row>
								<Row><small>Schedule</small></Row>
							</>
						} />}
						{this.isAccessGranted('attendance') && <Tab label={
							<>
								<Row><Icon type="carry-out" /></Row>
								<Row><small>Attendance</small></Row>
							</>
						} />}
						{this.isAccessGranted('study material') && <Tab label={
							<>
								<Row><Icon type="file-text" /></Row>
								<Row><small>Study Material</small></Row>
							</>
						} />}
					</Tabs>
				</AppBar>
				<Swipeable delta={20} onSwipedLeft={this.leftSwipe} onSwipedRight={this.rightSwipe} style={{ minHeight: '80vh' }}>
					<div className="py-3">
						{this.isAccessGranted('schedules') && primaryTabsValue === 0 && <ActiveSchedules />}
						{this.isAccessGranted('attendance') && primaryTabsValue === 1 && <ActiveSchedules isAttendance={true} />}
						{this.isAccessGranted('study material') && primaryTabsValue === 2 && <ViewOrDeleteMaterials deleteResource={deleteResource} messageInfo={messageInfo} resources={resources} showDelete={true} />}
					</div>
				</Swipeable>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		messageInfo: state.messageInfo,
		navigation: state.navigation,
		resources: state.resource.resources,
		roles: state.role.roles,
		user: state.user.userInfo
	};
}

export default compose(connect(mapStateToProps, { changeTabs, deleteResource }), withRouter)(PrimaryTuitionTabs);
