import React, { Component } from 'react';

import { Spin } from 'antd';

import styles from '../css/Spinner.module.css';

class Spinner extends Component {
	render() {
		return (
			<div className={styles.container}>
				<Spin size='large' className={styles.spinner} />
			</div>
		);
	}
}

export default Spinner;
