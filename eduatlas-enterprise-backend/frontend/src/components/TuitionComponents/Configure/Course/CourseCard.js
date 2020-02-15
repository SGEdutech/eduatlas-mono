import React from 'react';
import { Link } from 'react-router-relative-link';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';

import { Card, Row, Col } from 'antd';
const { Meta } = Card;

function CourseCard(props) {
	const { id, description, code, numberOfBatches, courseFee, deleteCourse } = props;

	const iconsArray = [
		<Link to={'./edit-course/' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
		<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteCourse(id)} />
	];

	return (
		<Card
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
							<div><span className="font-weight-bold">Number Of Batches:</span> {numberOfBatches}</div>
						</Col>
						<Col>
							<div><span className="font-weight-bold">Course Fee:</span> {courseFee}</div>
						</Col>
					</Row>
				}
			/>
		</Card>
	);
}

export default CourseCard;
