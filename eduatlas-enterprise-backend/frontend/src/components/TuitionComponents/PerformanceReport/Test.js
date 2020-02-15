import moment from 'moment';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';

import TestCard from './Test/TestCard';

import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop';
import { inverseMinutesFromMidnight } from '../../../scripts/minutesToMidnight';

import {
	Card,
	Col,
	DatePicker,
	Empty,
	Icon,
	Input,
	Modal,
	Row,
	Skeleton
} from 'antd';

const confirm = Modal.confirm;

const plusIconStyle = {
	fontSize: '2.6rem',
	color: '#00bcd4',
	position: 'fixed',
	bottom: 70,
	right: 10
};

const colLayout = {
	xs: 24,
	sm: 12,
	md: 8,
	xl: 6,
	xxl: 6
};

const filterColLayout = {
	xs: 24,
	sm: 12
};

class Test extends Component {
	state = {
		fromDate: moment(),
		searchQuery: undefined,
		toDate: undefined
	}

	componentDidMount() {
		scrollToTop();
	}

	getFilteredTests = () => {
		let { tests } = this.props;
		const { searchQuery, toDate } = this.state;
		let { fromDate } = this.state;
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, 'i');
			tests = tests.filter(test => searchRegex.test(test.name));
		}
		if (Boolean(fromDate) === false) fromDate = moment(0);
		tests = tests.filter(test => {
			if (moment.isMoment(test.date) === false) test.date = moment(test.date)
			return test.date.startOf('day').diff(fromDate.startOf('day'), 'days') >= 0;
		});
		if (toDate) tests = tests.filter(schedule => schedule.date.startOf('day').diff(toDate.startOf('day'), 'days') <= 0);
		return tests;
	}

	handleFromDateChange = fromDate => this.setState({ fromDate });

	handleSearchChange = ({ currentTarget: { value: searchQuery } }) => this.setState({ searchQuery });

	handleToDateChange = toDate => this.setState({ toDate });

	showDeleteConfirm = testId => {
		const { deleteTest, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteTest(tuitionId, testId);
			}
		});
	};

	render() {
		const { messageInfo } = this.props;
		const filteredTests = this.getFilteredTests();
		const testsJsx = filteredTests.map(({ batchIds, date, fromTime, _id, maxMarks, name, toTime }) => (
			<Col {...colLayout} key={_id}>
				<div className="mb-3">
					<TestCard
						batchIds={batchIds}
						date={date}
						deleteTest={this.showDeleteConfirm}
						fromTime={Boolean(fromTime) === true ? inverseMinutesFromMidnight(fromTime).format('LT') : undefined}
						id={_id}
						maxMarks={maxMarks}
						name={name}
						toTime={Boolean(toTime) === true ? inverseMinutesFromMidnight(toTime).format('LT') : undefined} />
				</div>
			</Col>
		));

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col {...colLayout} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active>
						</Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<>
				<div className="container py-5">
					<Row className="mb-3" type="flex" align="middle" justify="center">
						<Col span={24} className="p-1">
							<Input onChange={this.handleSearchChange} placeholder="Search" />
						</Col>
						<Col {...filterColLayout} className="p-1">
							<DatePicker allowClear className="w-100" defaultValue={moment()} format="DD-MM-YYYY" onChange={this.handleFromDateChange} placeholder="From Date" />
						</Col>
						<Col {...filterColLayout} className="p-1">
							<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToDateChange} placeholder="To Date" />
						</Col>
					</Row>
					<Row gutter={16}>
						{messageInfo.fetching ? skeletonCards : (filteredTests.length === 0 ? emptyJsx : testsJsx)}
					</Row>
				</div>
				<Link to="./add-test">
					<Icon type="plus-circle" theme="filled" style={plusIconStyle} />
				</Link>
			</>
		);
	}
}

export default withRouter(Test);
