import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import { host } from '../../config.json';

import {
	Icon,
	Menu,
	message,
	Tag
} from 'antd';
const SubMenu = Menu.SubMenu;

class RightMenu extends Component {
	handleLogoutClick = async () => {
		const { history: { replace }, updateUserInfo } = this.props;
		const hideLoadingMessage = message.loading('Action in progress..', 0);
		try {
			axios.post(`${host}/auth/local/logout`, {}, { withCredentials: true });
			hideLoadingMessage();
			message.success('Log out successful!');
			updateUserInfo({});
			setTimeout(() => replace('/'), 100);
		} catch (error) {
			hideLoadingMessage();
			message.error('Log out unsuccessful!');
		}
	}

	render() {
		const { mode, userInfo, activeTab } = this.props;
		const userMenuItemsJsx = userInfo === null || Object.keys(userInfo).length === 0 ? (
			<SubMenu title={<span><Icon style={{ fontSize: 20 }} type="user" /></span>}>
				<Menu.Item key="setting:1"><Link to="/login">Login</Link></Menu.Item>
			</SubMenu>
		) : (
				<SubMenu title={<span><Icon style={{ fontSize: 20 }} type="user" />{userInfo.firstName.substr(0, 16)}</span>}>
					<Menu.Item key="setting:1"><Link to="/bookmarks">Bookmarks</Link></Menu.Item>
					<Menu.Item key="setting:2"><a href="https://erp.eduatlas.com" target='_blank' rel="noopener noreferrer">Go to StudyMonitor</a></Menu.Item>
					<Menu.Item key="setting:3" onClick={this.handleLogoutClick}>Logout</Menu.Item>
				</SubMenu>
			);

		return (
			<Menu mode={mode} selectedKeys={[activeTab]}>
				<Menu.Item key="home"><Link className="px-1" to="/home">Home</Link></Menu.Item>
				<Menu.Item key="tuition"><Link className="px-1" to="/search/tuition">Tuitions</Link></Menu.Item>
				<Menu.Item key="school"><Link className="px-1" to="/search/school">Schools</Link></Menu.Item>
				<Menu.Item key="event"><Link className="px-1" to="/search/event">Events</Link></Menu.Item>
				<SubMenu title={<><Icon type="plus" />Add Listing</>}>
					<Menu.Item key="add tuition"><a href="https://erp.eduatlas.com" target="_blank" rel="noopener noreferrer">Tuition</a></Menu.Item>
				</SubMenu>
				{userMenuItemsJsx}
			</Menu>
		);
	}
}

export default withRouter(RightMenu);
