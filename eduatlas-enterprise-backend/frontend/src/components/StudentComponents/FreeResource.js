import React, { Component } from 'react';

import Navbar from '../StudentNavbar';
import ViewOrDeleteMaterials from '../TuitionComponents/StudyMaterial/ViewOrDeleteMaterials';

class FreeResource extends Component {
	render() {
		return (
			<>
				<Navbar renderBackBtn={true} navText="Free Study Materials" />
				<div className="container below-nav my-5">
					<ViewOrDeleteMaterials messageInfo={this.props.messageInfo} resources={this.props.resources} showDelete={false} showFreeOnly={true} />
				</div>
			</>
		);
	}
}

export default FreeResource;

