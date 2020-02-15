import moment from 'moment';
import React, { Component } from 'react';

import NewLeadCard from './NewLeadCard';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Col,
	DatePicker,
	Input,
	Row
} from 'antd';

const filterColLayout = {
	xs: 24,
	sm: 12
};

class FollowUpLeads extends Component {
	state = {
		fromDate: null,
		searchQuery: null,
		toDate: null
	}
	componentDidMount() {
		scrollToTop();
	}
	getFilteredLeads = () => {
		let { followUpLeads } = this.props;
		const { searchQuery, toDate } = this.state;
		let { fromDate } = this.state;
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, 'i');
			followUpLeads = followUpLeads.filter(lead => searchRegex.test(lead.name) || searchRegex.test(lead.message) || searchRegex.test(lead.email) || searchRegex.test(lead.phone));
		}
		if (Boolean(fromDate) === false) fromDate = moment(0);
		followUpLeads = followUpLeads.filter(lead => {
			return moment(lead.nextFollowUp).startOf('day').diff(fromDate.startOf('day'), 'days') >= 0;
		});
		if (toDate) followUpLeads = followUpLeads.filter(lead => moment(lead.nextFollowUp).startOf('day').diff(toDate.startOf('day'), 'days') <= 0);
		return followUpLeads;
	}
	handleFromDateChange = fromDate => this.setState({ fromDate });
	handleSearchChange = ({ currentTarget: { value: searchQuery } }) => this.setState({ searchQuery });
	handleToDateChange = toDate => this.setState({ toDate });
	render() {
		const { colLayout, courses, editLead, editLeadWithComment, emptyJsx, updateLeads } = this.props;
		const followUpLeads = this.getFilteredLeads();
		return (
			<>
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col span={24} className="p-1">
						<Input onChange={this.handleSearchChange} placeholder="Search" allowClear />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleFromDateChange} placeholder="From Follow-Up Date" />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToDateChange} placeholder="To Follow-Up Date" />
					</Col>
				</Row>
				<Row gutter={16}>
					{followUpLeads.length === 0 ? emptyJsx :
						followUpLeads.map(leadInfo => {
							return <Col className="p-2" key={leadInfo._id} {...colLayout}>
								<NewLeadCard courses={courses} editLead={editLead} editLeadWithComment={editLeadWithComment} leadInfo={leadInfo} updateLeads={updateLeads} />
							</Col>;
						})}
				</Row>
			</>
		);
	}
}

export default FollowUpLeads;
