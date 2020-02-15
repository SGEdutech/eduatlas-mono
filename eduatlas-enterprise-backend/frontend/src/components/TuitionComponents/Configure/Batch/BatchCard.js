import React from 'react';
import { Link } from 'react-router-relative-link';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';

import { Card, Col, Row } from 'antd';
const { Meta } = Card;

function BatchCard(props) {
	const { id, code, description, courseId, courseCode, numberOfStudents, deleteBatch } = props;

	const iconsArray = [
		<Link to={'./edit-batch/' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
		<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteBatch(courseId, id)} />
	];

	return (
		<Card className="mb-3"
			size="small"
			style={{ border: '1px solid lightblue' }}
			headStyle={{ backgroundColor: 'lightblue' }}
			title={code}
			actions={iconsArray}>
			<Meta
				// title={<span className="text-uppercase">{code}</span>}
				description={
					<Row>
						<Col>
							<div className="one-line-ellipsis"><span className="font-weight-bold">Description:</span> {description}</div>
						</Col>
						<Col>
							<div><span className="font-weight-bold">Course:</span> <span className="text-uppercase">{courseCode}</span></div>
						</Col>
						<Col>
							<div><span className="font-weight-bold">Number Of Students:</span> {numberOfStudents}</div>
						</Col>
					</Row>
				} />
		</Card>
	);
}

export default BatchCard;
