import React from 'react';
import { Link } from 'react-router-relative-link';
import moment from 'moment';

import { Row, Col, Card } from 'antd';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';

function ScheduleCard(props) {
	const { id, batchCode, date, faculty, topic, fromTime, toTime, courseId, batchId, deleteSchedule, isAttendance, showBatchCode } = props;
	let iconsArray = [
		<Link to={'./edit-schedule/' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
		<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteSchedule(courseId, batchId, id)} />
	];
	if (isAttendance) {
		iconsArray = [
			<Link to={'./attendance/' + id}><IconsWithTooltip tooltipMessage="View" iconType="eye" /></Link>,
		];
	}

	return (
		<Card
			actions={iconsArray}
			headStyle={{ backgroundColor: 'lightblue' }}
			className="mb-3"
			size="small"
			style={{ border: '1px solid lightblue' }}
			title={<div className="text-capitalize"><span className="font-weight-bold">Topic: </span> {topic}</div>}
		>
			<Row>
				{showBatchCode ?
					<Col><div><span className="font-weight-bold">Batch: </span> {batchCode}</div></Col> :
					undefined}
				<Col>
					<div><span className="font-weight-bold">Date: </span> {moment(date).format('MMM Do YYYY')}</div>
				</Col>
				<Col>
					<div><span className="font-weight-bold">From Time: </span> {fromTime}</div>
				</Col>
				<Col>
					<div><span className="font-weight-bold">To Time: </span> {toTime}</div>
				</Col>
				<Col>
					<div></div>
				</Col>
				<Col>
					<div className="text-capitalize"><span className="font-weight-bold">Faculty: </span> {faculty}</div>
				</Col>
			</Row>
		</Card>
	);
}

export default ScheduleCard;
