import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';

import CloneSchedules from './ActiveSchedules/CloneSchedules';
import ScheduleCard from './ActiveSchedules/ScheduleCard';

import { addSchedule, deleteSchedule } from '../../../redux/actions/scheduleActions';
import { getFloatingBtnCss } from '../../../scripts/sharedCss';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import { inverseMinutesFromMidnight } from '../../../scripts/minutesToMidnight';
import getRandomColor from '../../../scripts/randomColor';
import scrollToTop from '../../../scripts/scrollToTop';


import {
	Avatar,
	Button,
	Card,
	Col,
	Collapse,
	DatePicker,
	Divider,
	Empty,
	Icon,
	Input,
	Modal,
	Row,
	Skeleton
} from 'antd';
const Panel = Collapse.Panel;
const { confirm } = Modal;

const colLayout = {
	xs: 24,
	md: 12
};

const cardColLayout = {
	xs: 24,
	sm: 24,
	md: 12,
	xl: 8,
	xxl: 8
};

class ActiveSchedules extends Component {
	state = {
		batchId: undefined,
		fromDate: moment(),
		modalBatchId: null,
		modalVisible: false,
		modalWeekNumber: null,
		searchQuery: undefined,
		toDate: undefined
	}

	componentDidMount() {
		scrollToTop();
	}

	getBatchWiseSchedule = schedules => {
		const { batches } = this.props;
		return batches.map(batch => {
			const schedulesOfThisBatch = schedules.filter(schedule => schedule.batchId === batch._id);
			const schedulesOfThisBatchByWeek = {};
			schedulesOfThisBatch.forEach(schedule => {
				const weekOfSchedule = schedule.date.week();
				if (Boolean(schedulesOfThisBatchByWeek[weekOfSchedule]) === false) schedulesOfThisBatchByWeek[weekOfSchedule] = [];
				schedulesOfThisBatchByWeek[weekOfSchedule].push(schedule);
			});
			return schedulesOfThisBatchByWeek;
		});
	}

	getCardsJsx = (filteredSchedules, emptyJsx, isAttendance) => {
		let cardsJsx = filteredSchedules.map(({ _id, date, faculty, topic, fromTime, toTime, batchCode, courseId, batchId }) => (
			<Col key={_id} {...cardColLayout}>
				<ScheduleCard
					batchCode={batchCode}
					batchId={batchId}
					courseId={courseId}
					date={date}
					deleteSchedule={this.showDeleteConfirm}
					faculty={faculty}
					fromTime={inverseMinutesFromMidnight(fromTime).format('LT')}
					id={_id}
					isAttendance={isAttendance}
					key={_id}
					showBatchCode={true}
					topic={topic}
					toTime={inverseMinutesFromMidnight(toTime).format('LT')} />
			</Col>
		));
		if (filteredSchedules.length === 0) cardsJsx = emptyJsx;
		return <Row gutter={16}>{cardsJsx}</Row>;
	}

	getFilteredSchedules = () => {
		let { schedules } = this.props;
		const { batchId, searchQuery, toDate } = this.state;
		let { fromDate } = this.state;
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, 'i');
			schedules = schedules.filter(schedule => searchRegex.test(schedule.topic) || searchRegex.test(schedule.faculty))
		}
		if (batchId) schedules = schedules.filter(schedule => schedule.batchId === batchId);
		if (Boolean(fromDate) === false) fromDate = moment(0);
		schedules = schedules.filter(schedule => {
			return schedule.date.startOf('day').diff(fromDate.startOf('day'), 'days') >= 0;
		});
		if (toDate) schedules = schedules.filter(schedule => schedule.date.startOf('day').diff(toDate.startOf('day'), 'days') <= 0);
		return schedules;
	}

	getPanelsJsx = (batches, batchWiseSchedulesArr, emptyJsx, isAttendance) => {
		const panelsJsx = batches.map((batch, i) => {
			return (<Panel header={
				<Row>
					<Avatar className="mr-2" size="small" style={{ backgroundColor: getRandomColor(batch._id) }}>{batch.code.slice(0, 1).toUpperCase()}</Avatar>
					{batch.code}
				</Row>
			}
				key={batch._id}>

				{/* Show Empty if there are no schedules for a batch */}
				{Boolean(Object.keys(batchWiseSchedulesArr[i]).length === 0) && emptyJsx}

				{Object.keys(batchWiseSchedulesArr[i]).map(weekNumber => {
					return (
						<div key={weekNumber}>
							<Divider orientation="left">
								<small className="mx-1">Week {weekNumber}</small>
								<Icon type="arrow-down" />
								{Boolean(isAttendance) === false && (
									<Button className="mx-1" dataweeknumber={weekNumber} databatchid={batch._id} onClick={this.openModal} type="primary" size="small" ghost>
										Clone
									</Button>
								)}
							</Divider>
							<Row gutter={16}>
								{batchWiseSchedulesArr[i][weekNumber].map(({ _id, date, faculty, topic, fromTime, toTime, batchCode, courseId, batchId }) => (
									<Col key={_id} {...cardColLayout}>
										<ScheduleCard
											id={_id}
											date={date}
											key={_id}
											faculty={faculty}
											topic={topic}
											fromTime={inverseMinutesFromMidnight(fromTime).format('LT')}
											toTime={inverseMinutesFromMidnight(toTime).format('LT')}
											courseId={courseId}
											batchId={batchId}
											batchCode={batchCode}
											isAttendance={isAttendance}
											deleteSchedule={this.showDeleteConfirm} />
									</Col>
								))}
							</Row>
						</div>
					);
				})}
			</Panel>);
		});

		return <Collapse expandIconPosition="right">{panelsJsx}</Collapse>;
	}

	sortSchedules = schedules => schedules.sort((a, b) => {
		if (a.date.valueOf() > b.date.valueOf()) return 1;
		if (a.date.valueOf() < b.date.valueOf()) return -1;
		return a.fromTime > b.fromTime ? 1 : -1;
	});

	handleBatchChange = batchId => this.setState({ batchId });

	handleFromDateChange = fromDate => this.setState({ fromDate });

	handleSearchChange = ({ currentTarget: { value: searchQuery } }) => this.setState({ searchQuery });

	handleToDateChange = toDate => this.setState({ toDate });

	hideModal = () => this.setState({ modalBatchId: null, modalVisible: false, modalWeekNumber: null });

	openModal = e => {
		const { currentTarget: { attributes: { databatchid: { value: modalBatchId }, dataweeknumber: { value: modalWeekNumber } } } } = e;
		this.setState({ modalBatchId, modalVisible: true, modalWeekNumber });
	};

	showDeleteConfirm = (courseId, batchId, scheduleId) => {
		const { deleteSchedule, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteSchedule(tuitionId, courseId, batchId, scheduleId);
			}
		});
	};

	render() {
		const { modalBatchId, modalVisible, modalWeekNumber, searchQuery } = this.state;
		const { addSchedule, batches, isAttendance, schedules } = this.props;
		// SORT Batches in Alphabatical Order
		batches.sort((a, b) => {
			if (a.code < b.code) return -1;
			if (a.code > b.code) return 1;
			return 0;
		});

		const filteredSchedules = this.getFilteredSchedules();
		this.sortSchedules(filteredSchedules);

		const batchWiseSchedulesArr = this.getBatchWiseSchedule(filteredSchedules);
		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const panelsJsx = Boolean(searchQuery) === false ? this.getPanelsJsx(batches, batchWiseSchedulesArr, emptyJsx, isAttendance) : undefined;
		// On Searching show cards instead of panels
		const cardsJsx = Boolean(searchQuery) === true ? this.getCardsJsx(filteredSchedules, emptyJsx, isAttendance) : undefined;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col {...cardColLayout} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active></Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<div className="container py-5">
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col span={24} className="p-1">
						<Input allowClear onChange={this.handleSearchChange} placeholder="Search" />
					</Col>
					<Col {...colLayout} className="p-1">
						<DatePicker allowClear className="w-100" defaultValue={moment()} format="DD-MM-YYYY" onChange={this.handleFromDateChange} placeholder="From Date" />
					</Col>
					<Col {...colLayout} className="p-1">
						<DatePicker allowClear className="w-100" format="DD-MM-YYYY" onChange={this.handleToDateChange} placeholder="To Date" />
					</Col>
				</Row>
				{Boolean(searchQuery) === false ? panelsJsx : cardsJsx}
				<Modal
					footer={null}
					onCancel={this.hideModal}
					title="Clone Schedule"
					visible={modalVisible}>
					<CloneSchedules addSchedule={addSchedule} batches={batches} batchId={modalBatchId} getBatchWiseSchedule={this.getBatchWiseSchedule} hideModal={this.hideModal} schedules={schedules} weekNumber={modalWeekNumber} />
				</Modal>
				<Link to="./add-schedule">
					<Icon type="plus-circle" theme="filled" style={getFloatingBtnCss()} />
				</Link>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		batches: state.batch.batches,
		schedules: state.schedule.schedules,
		messageInfo: state.messageInfo
	};
}

export default compose(connect(mapStateToProps, { addSchedule, deleteSchedule }), withRouter)(ActiveSchedules);
