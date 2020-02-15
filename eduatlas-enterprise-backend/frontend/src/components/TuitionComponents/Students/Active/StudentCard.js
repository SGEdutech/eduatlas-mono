import React from 'react';
import { Link } from 'react-router-relative-link';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';
import getRandomColor from '../../../../scripts/randomColor';

import {
	Avatar,
	Card
} from 'antd';
const { Meta } = Card;

function StudentCard(props) {
	const { id, name, rollNumber, deleteStudent } = props;

	const iconsArray = [
		<Link to={'./' + id}><IconsWithTooltip tooltipMessage="View" iconType="eye" /></Link>,
		<Link to={'./' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
		<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteStudent(id)} />
	];

	return (
		<>
			<Card
				actions={iconsArray}>
				<Meta
					avatar={<Avatar style={{ backgroundColor: getRandomColor(id) }}>{name.slice(0, 1).toUpperCase()}</Avatar>}
					title={name}
					description={'Roll Number: ' + rollNumber}
				/>
			</Card>
		</>
	);
}

export default StudentCard;
