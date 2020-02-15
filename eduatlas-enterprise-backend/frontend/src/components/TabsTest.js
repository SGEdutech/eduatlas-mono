import React, { Component } from 'react';

import {
	Col,
	Icon,
	Row
} from 'antd';

export default class TabsTest extends Component {
	render() {
		return (
			<Row style={{ height: '100vh' }} type="flex" justify="center" align="middle">
				<Col>
					<Row type="flex" justify="center">
						<Icon style={{ fontSize: 64 }} type="clock-circle" twoToneColor="#00bcd4" />
					</Row>
					<Row type="flex" justify="center">
						<h1>Your request is pending</h1>
					</Row>
				</Col>
			</Row>
		);
	}
}
