import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
	Avatar,
	Col,
	Drawer,
	Icon,
	List,
	Row
} from 'antd';

import { logOut } from '../redux/actions/userActions';
import fetchAll from '../redux/actions/fetchAllAction';

import getTuitionIdFromUrl from '../scripts/getTuitionIdFromUrl';

import { tuitionName, primaryColor } from '../config.json';

const headerStyle = {
	height: '40px',
	zIndex: 101
};

const cursorStyle = {
	cursor: 'pointer'
};

const NavListItem = props => (
	<Row type="flex" align="middle" className="my-3" style={cursorStyle} onClick={props.onClick}>
		<Icon type={props.iconType} className="mr-3" />
		<span>{props.content}</span>
	</Row>
);

class Navbar extends Component {
	state = { visible: false };

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

	onClose = () => this.setState({ visible: false });
	showDrawer = () => this.setState({ visible: true });

	render() {
		const { match: { url }, navText, renderBackBtn = false, user } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const DrawerHeader = (
			<Row>
				<Col className="mb-1" span={24}><Avatar size={64} style={{ backgroundColor: '#00bcd4' }}>{user.firstName ? user.firstName.slice(0, 1).toUpperCase() : ''}</Avatar></Col>
				<Col span={24}>{user.firstName ? user.firstName : ''}</Col>
				<Col span={24}><small className="text-capitalize">Role: Student</small></Col>
			</Row>
		);

		return (
			<>
				<nav className="navbar fixed-top bg-info mb-0" style={headerStyle} ref={el => {
					if (el) el.style.setProperty('background-color', primaryColor, 'important');
				}}>
					<div className="container" style={{ justifyContent: 'start' }}>
						{
							renderBackBtn ? (
								<>
									<Icon style={cursorStyle} type="arrow-left" onClick={this.props.history.goBack} />
									<span className="ml-auto mr-auto">{navText}</span>
									{Boolean(window.cordova) === false ? <Icon onClick={this.handleRefresh} style={cursorStyle} type="sync" /> : undefined}
								</>
							) : (
									<>
										<Icon style={cursorStyle} type="menu-fold" onClick={this.showDrawer} />
										<span className="ml-auto mr-auto"><Link to={`/${tuitionId}`}><span className="text-uppercase" style={{ color: '#fff', fontWeight: 700 }}>{tuitionName}</span></Link></span>
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
							<Link to={`/app/${tuitionId}/edit-profile/${user._id}`}><span style={{ color: '#000' }}><NavListItem iconType="edit" content="Edit Profile" /></span></Link>
							<Link to={`/app/${tuitionId}/student/enrollment-fee`}><span style={{ color: '#000' }}><NavListItem iconType="dollar" content="Enrollment And Fee" /></span></Link>
							<Link to={`/app/${tuitionId}/student/test-report`}><span style={{ color: '#000' }}><NavListItem iconType="line-chart" content="Test Reports" /></span></Link>
							<NavListItem iconType="logout" content="Logout" onClick={this.handleLogout} />
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
		user: state.user.userInfo
	};
}

export default compose(connect(mapStateToProps, { fetchAll, logOut }), withRouter)(Navbar);


