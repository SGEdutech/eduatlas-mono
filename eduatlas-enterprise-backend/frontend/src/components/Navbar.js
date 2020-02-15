// TODO: Merge student and tuition navbar
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
	Avatar,
	Button,
	Col,
	Drawer,
	Icon,
	List,
	Row
} from 'antd';

import { logOut } from '../redux/actions/userActions';
import fetchAll from '../redux/actions/fetchAllAction';

import getTuitionIdFromUrl from '../scripts/getTuitionIdFromUrl';
import rolesConfig from '../roles-config.json'

import { tuitionName, primaryColor } from '../config.json';

const headerStyle = {
	height: '40px',
	zIndex: 101
};

const cursorStyle = {
	cursor: 'pointer'
};

class Navbar extends Component {
	state = { visible: false };

	showDrawer = () => this.setState({ visible: true });

	onClose = () => this.setState({ visible: false });

	getRoleType = () => {
		const { fetched, roles, match: { url }, user: { claims = [], primaryEmail } } = this.props;
		if (!fetched) return;
		const tuitionId = getTuitionIdFromUrl(url);
		let roleType = null;
		const roleFromConfig = roles.find(role => role.email === primaryEmail);
		if (claims.some(claim => claim.listingId === tuitionId)) return 'super admin';
		if (roleFromConfig) roleType = roleFromConfig.type;
		return roleType;
	}

	handleLogout = () => {
		const { history: { replace }, match: { url }, logOut, user: { primaryEmail } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		logOut(primaryEmail);
		setTimeout(() => replace(`/app/${tuitionId}`), 100);
	}

	handleRefresh = () => {
		const { fetchAll, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		fetchAll(tuitionId);
	}

	//FIXME: This should be on shared scripts
	isAccessGranted = moduleName => {
		const { fetched, user: { primaryEmail } } = this.props;
		if (!fetched || !primaryEmail) return false;
		const roleType = this.getRoleType();
		if (roleType === 'super admin') return true;
		return rolesConfig[roleType].some(accessModules => accessModules === moduleName);
	}

	render() {
		const { navText, renderBackBtn = false, user: { userId } } = this.props;
		const DrawerHeader = (
			<Row>
				<Col className="mb-1" span={24}><Avatar size={64} style={{ backgroundColor: '#00bcd4' }}>{tuitionName.slice(0, 1).toUpperCase()}</Avatar></Col>
				<Col span={24}>{tuitionName}</Col>
				<Col span={24}><small className="text-capitalize">Role: {this.getRoleType()}</small></Col>
			</Row>
		);

		const NavListItem = props => (
			<Row type="flex" align="middle" className="pb-2" style={cursorStyle} onClick={props.onClick}>
				<Icon type={props.iconType} className="mr-3" />
				<span>{props.content}</span>
			</Row>
		);
		return (
			<>
				<nav className="navbar fixed-top mb-0 primary-color" style={headerStyle} ref={el => {
					if (el) el.style.setProperty('background-color', primaryColor, 'important');
				}}>
					<div className="container" style={{ justifyContent: 'start' }}>
						{
							renderBackBtn ? (
								<>
									<Icon style={cursorStyle} type="arrow-left" onClick={this.props.history.goBack} />
									<span className="ml-auto mr-auto text-uppercase text-white">{navText}</span>
									{Boolean(window.cordova) === false ? <Icon onClick={this.handleRefresh} style={cursorStyle} type="sync" /> : undefined}
								</>
							) : (
									<>
										<Icon style={cursorStyle} type="menu-fold" onClick={this.showDrawer} />
										<span className="ml-auto mr-auto"><span className="text-uppercase" style={{ color: '#fff', fontWeight: 700 }}>{tuitionName}</span></span>
										{Boolean(window.cordova) === false ? <Icon onClick={this.handleRefresh} style={cursorStyle} type="sync" /> : undefined}
									</>
								)
						}
					</div>
				</nav>
				{!renderBackBtn && <Drawer
					bodyStyle={{ paddingTop: 8 }}
					title={DrawerHeader}
					placement="left"
					closable={true}
					onClose={this.onClose}
					visible={this.state.visible}>
					<>
						<List split={true} style={{ fontSize: 18 }}>
							{this.isAccessGranted('configure') && <Link to={'./tuition/configure'}><span style={{ color: '#000' }}><NavListItem iconType="setting" content="Configure" /></span></Link>}
							{this.isAccessGranted('students') && <Link to={'./tuition/students'}><span style={{ color: '#000' }}><NavListItem iconType="team" content="Student Register" /></span></Link>}
							{this.isAccessGranted('communicator') && <Link to={'./tuition/communicator'}><span style={{ color: '#000' }}><NavListItem iconType="notification" content="Communicator" /></span></Link>}
							{this.isAccessGranted('test') && <Link to={'./tuition/performance-report'}><span style={{ color: '#000' }}><NavListItem iconType="line-chart" content="Test And Reports" /></span></Link>}
							{this.isAccessGranted('requests') && <Link to={'./tuition/app-downloads'}><span style={{ color: '#000' }}><NavListItem iconType="cloud-download" content="App Downloads" /></span></Link>}
							{this.isAccessGranted('edit user profile') && <Link to={`./edit-profile/${userId}`}><span style={{ color: '#000' }}><NavListItem iconType="edit" content="Edit User Profile" /></span></Link>}
							{this.isAccessGranted('edit institute profile') && <Link to={'./tuition/edit-institute'}><span style={{ color: '#000' }}><NavListItem iconType="edit" content="Edit Institute Profile" /></span></Link>}
							{this.isAccessGranted('reciept config') && <Link to={'./receipt-config'}><span style={{ color: '#000' }}><NavListItem iconType="form" content="Receipt Config" /></span></Link>}
							{this.isAccessGranted('role management') && <Link to={'./tuition/roles-management'}><span style={{ color: '#000' }}><NavListItem iconType="usergroup-add" content="Roles Management" /></span></Link>}
							{this.isAccessGranted('reports') && <Link to={'./tuition/reports'}><span style={{ color: '#000' }}><NavListItem iconType="usergroup-add" content="Reports" /></span></Link>}
							<NavListItem iconType="logout" content="Logout" onClick={this.handleLogout} />
							{this.isAccessGranted('leads') && <Link to={'./tuition/leads'}><Button className="mt-2" type="primary" icon="monitor" block>Leads</Button></Link>}
							{/* <Button className="mt-2" type="primary" icon="share-alt" block>
								Share on Whatsapp
    						</Button> */}
						</List>
						<small style={{ position: 'absolute', bottom: 24 }}>Made with <Icon style={{ color: 'red' }} theme="filled" type="heart" /> at eduatlas</small>
					</>
				</Drawer>}
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.userInfo,
		roles: state.role.roles,
		fetched: state.messageInfo.fetched
	};
}

export default compose(connect(mapStateToProps, { fetchAll, logOut }), withRouter)(Navbar);
