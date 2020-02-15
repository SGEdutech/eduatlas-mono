import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import '../../core/css/tabBar.css';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
	Col,
	Icon,
	Empty,
	Row
} from 'antd';

import { addLead, addMultipleLeads, editLead, editLeadWithComment } from '../../redux/actions/leadActions';
import { changeTabs } from '../../redux/actions/navigationActions';

import ExcelLeadDownload from './Leads/ExcelLeadDownload';
import ExcelLeadUpload from './Leads/ExcelLeadUpload';
import FollowUpLeads from './Leads/FollowUpLeads';
import Navbar from '../Navbar';
import NewLeads from './Leads/NewLeads';
import NewLeadCard from './Leads/NewLeadCard';
import scrollToTop from '../../scripts/scrollToTop';

const colLayout = {
	xs: 24, md: 12, lg: 8
};

class Leads extends Component {
	componentDidMount() {
		scrollToTop();
	}

	handleChange = (e, value) => {
		const { navigation: { primaryTabsValue } } = this.props;
		this.props.changeTabs(primaryTabsValue, value);
	};

	render() {
		const { addLead, addMultipleLeads, courses, editLead, editLeadWithComment, leads, navigation: { secondaryTabsValue } } = this.props;

		const newLeads = [];
		const followUpLeads = [];
		const closedLeads = [];
		if (leads) {
			leads.forEach(leadInfo => {
				if (leadInfo.comments.length === 0 && leadInfo.status === 'active') {
					newLeads.push(leadInfo);
				} else if (leadInfo.status === 'closed' || leadInfo.status === 'enrolled') {
					closedLeads.push(leadInfo);
				} else if (leadInfo.comments.length >= 0 && leadInfo.status === 'active') {
					followUpLeads.push(leadInfo);
				}
			});
		}

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		return (
			<>
				<Navbar renderBackBtn={true} navText="Leads" />
				<div className="container below-nav my-5">
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
									<Row><Icon type="info-circle" /></Row>
									<Row><small>New</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="question-circle" /></Row>
									<Row><small>Followup</small></Row>
								</>
							} />
							<Tab label={
								<>
									<Row><Icon type="issues-close" /></Row>
									<Row><small>Closed</small></Row>
								</>
							} />
							{Boolean(window.cordova) === false &&
								<Tab label={
									<>
										<Row><Icon type="upload" /></Row>
										<Row><small>Upload</small></Row>
									</>
								} />
							}
							{Boolean(window.cordova) === false &&
								<Tab label={
									<>
										<Row><Icon type="download" /></Row>
										<Row><small>Reports</small></Row>
									</>
								} />
							}
						</Tabs>
					</AppBar>
					{secondaryTabsValue === 0 && <NewLeads addLead={addLead} colLayout={colLayout} courses={courses} editLead={editLead} editLeadWithComment={editLeadWithComment} emptyJsx={emptyJsx} newLeads={newLeads} />}
					{secondaryTabsValue === 1 && <FollowUpLeads addLead={addLead} colLayout={colLayout} courses={courses} editLead={editLead} editLeadWithComment={editLeadWithComment} emptyJsx={emptyJsx} followUpLeads={followUpLeads} />}
					{secondaryTabsValue === 2 && (
						closedLeads.length === 0 ? emptyJsx :
							closedLeads.map(leadInfo => {
								return <Col className="p-2" key={leadInfo._id} {...colLayout}>
									<NewLeadCard courses={courses} editLead={editLead} editLeadWithComment={editLeadWithComment} leadInfo={leadInfo} updateLeads={this.updateLeads} />
								</Col>;
							})
					)}
					{Boolean(window.cordova) === false && secondaryTabsValue === 3 && <ExcelLeadUpload addMultipleLeads={addMultipleLeads} />}
					{Boolean(window.cordova) === false && secondaryTabsValue === 4 && <ExcelLeadDownload colLayout={colLayout} courses={courses} emptyJsx={emptyJsx} leads={leads ? leads : []} />}
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		courses: state.course.courses,
		leads: state.lead.leads,
		messageInfo: state.messageInfo,
		navigation: state.navigation
	};
}

export default compose(connect(mapStateToProps, { addLead, addMultipleLeads, changeTabs, editLead, editLeadWithComment }), withRouter)(Leads);
