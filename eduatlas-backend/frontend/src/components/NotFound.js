import React, { Component } from 'react';

import notFoundSVG from '../404.svg';

class NotFound extends Component {
	render() {
		return (
			<img alt="Page Not Found" src={notFoundSVG}></img>
		);
	}
}

export default NotFound;

