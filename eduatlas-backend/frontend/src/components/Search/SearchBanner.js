import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import summerCamp19Cover from '../../images/camp19.png';

import {
	Row
} from 'antd';

const searchCoverStyle = {
	display: 'block',
	maxWidth: '100%',
	maxHeight: '100px',
	width: 'auto',
	height: 'auto'
};

class SearchBanner extends Component {
	render() {
		return (
			<Link to="/search/event">
				<Row align="middle" className="border p-1 pointer" justify="center" type="flex"><img alt="Cover" src={summerCamp19Cover} style={searchCoverStyle} /></Row>
			</Link>
		);
	}
}

export default SearchBanner;

