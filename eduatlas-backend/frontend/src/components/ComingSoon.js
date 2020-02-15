import React, { Component } from 'react';

import {
	Col,
	Icon,
	Row
} from 'antd';

import Navbar from './Navbar';

export default class ComingSoon extends Component {
	render() {
		const { userInfo } = this.props;
		return (
			<>
				<Navbar userInfo={userInfo} updateUserInfo={this.props.updateUserInfo} />
				<Row className="below-nav" style={{ height: '100vh' }} type="flex" justify="center" align="middle">
					<Col>
						<Row justify="center" type="flex">
							<Icon style={{ fontSize: 64 }} type="clock-circle" theme="twoTone" twoToneColor="#00bcd4" spin />
						</Row>
						<Row justify="center" type="flex">
							<h1 className="text-center">Coming Soon</h1>
						</Row>
					</Col>
				</Row>
			</>
		);
	}
}
