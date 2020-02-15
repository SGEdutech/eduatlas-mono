import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { changeTabs } from '../../redux/actions/navigationActions';
import { addRole, deleteRole } from '../../redux/actions/rolesActions';

import Navbar from '../Navbar';
import ActiveRoles from './RolesManagement/ActiveRoles';
import AddRole from './RolesManagement/AddRole';

import {
	Icon,
	Row
} from 'antd';

class RolesManagement extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { addRole, deleteRole, navigation: { secondaryTabsValue }, roles } = this.props;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Roles Management" />
				<div className="container below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							value={secondaryTabsValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							scrollButtons="auto">
							<Tab label={
								<>
									<Row><Icon type="book" /></Row>
									<Row><small>Active</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="tags" /></Row>
									<Row><small>Add</small></Row>
								</>
							} />
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <ActiveRoles deleteRole={deleteRole} roles={roles} />}
					{secondaryTabsValue === 1 && <AddRole addRole={addRole} />}
				</div>
			</>
		);
	}
}


function mapStateToProps(state) {
	return {
		messageInfo: state.messageInfo,
		navigation: state.navigation,
		roles: state.role.roles
	};
}

export default connect(mapStateToProps, { addRole, changeTabs, deleteRole })(RolesManagement);
