import React from 'react';
import { Link } from 'react-router-relative-link';

import IconsWithTooltip from '../../../SharedComponents/IconsWithTooltip';

import { Card, Col, Row } from 'antd';
const { Meta } = Card;

function DiscountCard(props) {
	const { id, code, amount, isPercent, deleteDiscount } = props;

	const iconsArray = [
		<Link to={'./edit-discount/' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
		<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteDiscount(id)} />
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
							<div><span className="font-weight-bold">Discount {isPercent ? 'Percentage(%)' : 'Amount'}:</span> {amount}</div>
						</Col>
					</Row>
				}
			/>
		</Card>
	);
}

export default DiscountCard;
