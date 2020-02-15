import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
	Icon,
	Row
} from 'antd';

class Loading extends Component {
	render() {
		const loadingJsx = (
			<div>
				<Row style={{ height: '80vh' }} type="flex" justify="center" align="middle">
					<Icon style={{ fontSize: 64 }} type="smile" theme="twoTone" twoToneColor="#00bcd4" spin />
				</Row>
			</div>
		);
		const { userInfo } = this.props;
		if (userInfo === null) return loadingJsx;
		const isLoggedIn = Object.keys(userInfo).length !== 0;
		return isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/home" />;
	}
}

export default Loading;
