import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Navbar/Navbar.css';

import RightMenu from './Navbar/RightMenu';

import eduatlasLogo from '../favicon.svg';

import {
	Button,
	Col,
	Drawer,
	Icon,
	Row
} from 'antd';

class Navbar extends Component {
	state = {
		visible: false
	};

	showDrawer = () => this.setState({ visible: true });

	onClose = () => this.setState({ visible: false });

	render() {
		const { updateUserInfo, userInfo, activeTab } = this.props;
		return (
			<nav className="menu">
				<div className="menu__logo">
					<Row type="flex" align="middle">
						<Col className="d-none d-md-block" span={6}>
							<img alt="logo" src={eduatlasLogo} style={{ height: '45px' }}></img>
						</Col>
						<Col span={18}>
							<Link to="/">Eduatlas</Link>
						</Col>
					</Row>
				</div>
				<div className="menu__container">
					<div className="menu_rigth">
						<RightMenu mode="horizontal" updateUserInfo={updateUserInfo} userInfo={userInfo} activeTab={activeTab} />
					</div>
					<Button
						className="menu__mobile-button"
						type="primary"
						onClick={this.showDrawer}>
						<Icon type="align-right" />
					</Button>
					<Drawer
						title="Basic Drawer"
						placement="right"
						className="menu_drawer"
						closable={false}
						onClose={this.onClose}
						visible={this.state.visible}>
						<RightMenu mode="inline" updateUserInfo={updateUserInfo} userInfo={userInfo} />
					</Drawer>
				</div>
			</nav>
		);
	}
}

export default Navbar;