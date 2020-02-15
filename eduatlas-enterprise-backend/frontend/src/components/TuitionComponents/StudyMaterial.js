import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { changeTabs } from '../../redux/actions/navigationActions';
import { addResource, deleteResource, fakeAddResourceFulfilled, fakeAddResourcePending, fakeAddResourceRejected } from '../../redux/actions/resourceActions';

import AddStudyMaterial from './StudyMaterial/AddStudyMaterial';
import ViewOrDeleteMaterials from './StudyMaterial/ViewOrDeleteMaterials';

class StudyMaterial extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { navigation: { secondaryTabsValue } } = this.props;
		const { addResource, batches, deleteResource, fakeAddResourceFulfilled, fakeAddResourcePending, fakeAddResourceRejected, messageInfo, resources, students } = this.props;

		return (
			<>
				<AppBar color="default" className="z101">
					<Tabs
						className="tabBar"
						value={secondaryTabsValue}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth">
						<Tab label="View" />
						<Tab label="Add" />
					</Tabs>
				</AppBar>
				{secondaryTabsValue === 0 && <ViewOrDeleteMaterials deleteResource={deleteResource} messageInfo={messageInfo} resources={resources} />}
				{secondaryTabsValue === 1 && <AddStudyMaterial addResource={addResource} batches={batches} fakeAddResourceFulfilled={fakeAddResourceFulfilled} fakeAddResourcePending={fakeAddResourcePending} fakeAddResourceRejected={fakeAddResourceRejected} resources={resources} showDelete={true} students={students} />}
			</>
		);
	}
}


function mapStateToProps(state) {
	return {
		batches: state.batch.batches,
		messageInfo: state.messageInfo,
		navigation: state.navigation,
		resources: state.resource.resources,
		students: state.student.students
	};
}

export default connect(mapStateToProps, { addResource, changeTabs, deleteResource, fakeAddResourceFulfilled, fakeAddResourcePending, fakeAddResourceRejected })(StudyMaterial);
