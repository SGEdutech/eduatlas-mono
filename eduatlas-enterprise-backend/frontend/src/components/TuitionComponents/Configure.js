import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { deleteCourse } from '../../redux/actions/courseActions';
import { deleteBatch } from '../../redux/actions/batchActions';
import { deleteDiscount } from '../../redux/actions/discountActions';
import { changeTabs } from '../../redux/actions/navigationActions';

import Course from './Configure/Course';
import Batch from './Configure/Batch';
import Discount from './Configure/Discount';
import Navbar from '../Navbar';

import {
	Icon,
	Row
} from 'antd';

class Configure extends Component {
	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { navigation: { secondaryTabsValue } } = this.props;
		return (
			<>
				<Navbar renderBackBtn={true} navText="Configure" />
				<div className="container below-nav">
					<AppBar color="default" className="z101">
						<Tabs
							className="tabBar"
							value={secondaryTabsValue}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							scrollButtons="auto">
							<Tab label={
								<>
									<Row><Icon type="book" /></Row>
									<Row><small>Courses</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="solution" /></Row>
									<Row><small>Batches</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="tags" /></Row>
									<Row><small>Discounts</small></Row>
								</>
							} />
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <Course messageInfo={this.props.messageInfo} coursesInfo={this.props.course} deleteCourse={this.props.deleteCourse} />}
					{secondaryTabsValue === 1 && <Batch messageInfo={this.props.messageInfo} batchesInfo={this.props.batch} deleteBatch={this.props.deleteBatch} />}
					{secondaryTabsValue === 2 && <Discount messageInfo={this.props.messageInfo} discountsInfo={this.props.discount} deleteDiscount={this.props.deleteDiscount} />}
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
		student: state.student,
		discount: state.discount
	};
}

export default connect(mapStateToProps, { changeTabs, deleteCourse, deleteBatch, deleteDiscount })(Configure);

// boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)'
