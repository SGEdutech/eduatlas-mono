import moment from 'moment';
import { unparse } from 'papaparse';
import React, { Component } from 'react';

import NewLeadCard from './NewLeadCard';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Col,
	Button,
	DatePicker,
	Input,
	Row,
	Select
} from 'antd';
const { Option } = Select;

const filterColLayout = {
	xs: 24,
	sm: 12
};

class ExcelLeadDownload extends Component {
	state = {
		fromDate: null,
		fromFollowUpDate: null,
		leadCourse: null,
		leadSource: null,
		leadStatus: null,
		leadStrength: null,
		searchQuery: null,
		toDate: null,
		toFollowUpDate: null
	}

	componentDidMount() {
		scrollToTop();
	}

	getFilteredLeads = () => {
		let { leads } = this.props;
		leads = JSON.parse(JSON.stringify(leads));
		const { searchQuery, toDate, toFollowUpDate, leadCourse, leadSource, leadStatus, leadStrength } = this.state;
		let { fromDate, fromFollowUpDate } = this.state;
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, 'i');
			leads = leads.filter(lead => searchRegex.test(lead.name) || searchRegex.test(lead.message) || searchRegex.test(lead.email) || searchRegex.test(lead.phone));
		}

		if (Boolean(fromDate) === false) fromDate = moment(0);
		leads = leads.filter(lead => {
			return moment(lead.createdAt).startOf('day').diff(fromDate.startOf('day'), 'days') >= 0;
		});

		if (Boolean(fromFollowUpDate) === false) fromFollowUpDate = moment(0);
		leads = leads.filter(lead => {
			return moment(lead.nextFollowUp).startOf('day').diff(fromFollowUpDate.startOf('day'), 'days') >= 0;
		});

		if (toDate) leads = leads.filter(lead => moment(lead.createdAt).startOf('day').diff(toDate.startOf('day'), 'days') <= 0);

		if (toFollowUpDate) leads = leads.filter(lead => moment(lead.nextFollowUp).startOf('day').diff(toFollowUpDate.startOf('day'), 'days') <= 0);

		if (leadSource) leads = leads.filter(lead => leadSource === lead.source);

		if (leadStrength) leads = leads.filter(lead => leadStrength === lead.leadStrength);

		if (leadStatus) leads = leads.filter(lead => leadStatus === lead.status);

		if (leadCourse) leads = leads.filter(lead => leadCourse === lead.courseId);

		return leads;
	}

	handleLeadCourseChange = leadCourse => this.setState({ leadCourse });
	handleFromDateChange = fromDate => this.setState({ fromDate });
	handleFromFollowUpDateChange = fromFollowUpDate => this.setState({ fromFollowUpDate });
	handleLeadSourceChange = leadSource => this.setState({ leadSource });
	handleLeadStatusChange = leadStatus => this.setState({ leadStatus });
	handleLeadStrengthChange = leadStrength => this.setState({ leadStrength });
	handleToDateChange = toDate => this.setState({ toDate });
	handleToFollowUpDateChange = toFollowUpDate => this.setState({ toFollowUpDate });

	unparseCsv = () => {
		const { courses } = this.props;
		let leads = JSON.parse(JSON.stringify(this.getFilteredLeads()));
		leads = leads.map(leadInfo => {
			const courseInfo = courses.find(course => course._id === leadInfo.courseId);
			leadInfo.course = courseInfo ? courseInfo.code : '';
			leadInfo.createdAt = leadInfo.createdAt ? moment(leadInfo.createdAt).format('DD/MM/YY') : '';
			leadInfo.nextFollowUp = leadInfo.nextFollowUp ? moment(leadInfo.nextFollowUp).format('DD/MM/YY') : '';
			delete leadInfo.comments;
			delete leadInfo._id;
			delete leadInfo.courseId;
			return leadInfo;
		});
		const csvFile = unparse(leads);
		const hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:attachment/text,' + encodeURI(csvFile);
		hiddenElement.target = '_blank';
		hiddenElement.download = 'leads.csv';
		hiddenElement.click();
	}

	render() {
		const { colLayout, courses, emptyJsx } = this.props;
		const leads = this.getFilteredLeads();
		return (
			<>
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col span={24} className="p-1">
						<Input onChange={this.handleSearchChange} placeholder="Search" allowClear />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleFromDateChange} placeholder="From Date" />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToDateChange} placeholder="To Date" />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleFromFollowUpDateChange} placeholder="From Follow-Up Date" />
					</Col>
					<Col {...filterColLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToFollowUpDateChange} placeholder="To Follow-Up Date" />
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleLeadStrengthChange} placeholder="Lead Strength" allowClear>
							<Option value="disabled" disabled>
								Lead Strength
      						</Option>
							<Option value="hot">Hot</Option>
							<Option value="warm">Warm</Option>
							<Option value="cold">Cold</Option>
						</Select>
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleLeadCourseChange} placeholder="Course" allowClear>
							<Option value="disabled" disabled>
								Course
      						</Option>
							{courses && courses.map(course => <Option key={course._id} value={course._id}>{course.code}</Option>)}
						</Select>
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleLeadSourceChange} placeholder="Lead Source" allowClear>
							<Option value="disabled" disabled>
								Lead Source
      						</Option>
							<Option value="eduatlas.com">Eduatlas.com</Option>
							<Option value="school campaign">School Campaign</Option>
							<Option value="pamphlets">Pamphlets</Option>
							<Option value="facebook">Facebook</Option>
							<Option value="walkin">Walk-In</Option>
							<Option value="sulekha">Sulekha</Option>
							<Option value="justdial">JustDial</Option>
							<Option value="urbanpro">UrbanPro</Option>
							<Option value="shiksha">Shiksha</Option>
							<Option value="google maps">Google Maps</Option>
							<Option value="other">Other</Option>
						</Select>
					</Col>
					<Col span={24} className="p-1">
						<Select className="w-100" onChange={this.handleLeadStatusChange} placeholder="Lead Status" allowClear>
							<Option value="disabled" disabled>
								Lead Status
      						</Option>
							<Option value="active">Active</Option>
							<Option value="closed">Closed</Option>
							<Option value="enrolled">Enrolled</Option>
						</Select>
					</Col>
				</Row>
				<Row className="mb-3">
					<Button block
						onClick={this.unparseCsv}
						type="primary">
						Download Excel
					</Button>
				</Row>
				<Row gutter={16}>
					{leads.length === 0 ? emptyJsx :
						leads.map(leadInfo => {
							return <Col className="p-2" key={leadInfo._id} {...colLayout}>
								<NewLeadCard courses={courses} leadInfo={leadInfo} />
							</Col>;
						})}
				</Row>
			</>
		);
	}
}

export default ExcelLeadDownload;
