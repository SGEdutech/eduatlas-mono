import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Icon, Row } from 'antd';

import { addStudentInBatch } from '../../redux/actions/batchActions';
import { changeTabs } from '../../redux/actions/navigationActions';
import { deleteRequest } from '../../redux/actions/requestActions';
import { addStudent, deleteStudent } from '../../redux/actions/studentActions';

import Active from './Students/Active';
import AddStudent from './Students/AddStudent';
import Navbar from '../Navbar';
import Pending from './Students/Pending';

class Students extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { navigation: { secondaryTabsValue } } = this.props;
		const { students, batch, deleteStudent, messageInfo, addStudentInBatch } = this.props;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Students" />
				<div className="below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							value={secondaryTabsValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth">
							<Tab label={
								<>
									<Row><Icon type="check-circle" /></Row>
									<Row><small>Active</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="exclamation-circle" /></Row>
									<Row><small>Pending</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="user-add" /></Row>
									<Row><small>Add</small></Row>
								</>
							} />
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <Active batches={batch.batches} messageInfo={messageInfo} students={students} deleteStudent={deleteStudent} />}
					{secondaryTabsValue === 1 && <Pending addStudentInBatch={addStudentInBatch} batches={batch.batches} deleteStudent={deleteStudent} messageInfo={messageInfo} students={students} />}
					{secondaryTabsValue === 2 && <AddStudent students={students} />}
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		batch: state.batch,
		course: state.course,
		messageInfo: state.messageInfo,
		navigation: state.navigation,
		students: state.student.students,
		discount: state.discount,
		request: state.request
	};
}

export default compose(connect(mapStateToProps, { addStudent, changeTabs, deleteStudent, deleteRequest, addStudentInBatch }), withRouter)(Students);
