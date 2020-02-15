import moment from 'moment';
import React, { Component } from 'react';

import { host } from '../../config.json';

import fourGirlsImg from '../../images/fourgirls.jpg';

import {
	Card,
	Col,
	Icon,
	List,
	Row,
	Tag
} from 'antd';
const { Meta } = Card;

const titleLayout = {
	xs: 20
};

const verfiedLayout = {
	xs: 4
};

class EventBanner extends Component {
	getCoverImageLink = () => {
		const { listingDetails } = this.props;
		let img_eventCoverPic;
		if (listingDetails) img_eventCoverPic = listingDetails.img_eventCoverPic ? listingDetails.img_eventCoverPic : undefined;
		if (img_eventCoverPic && img_eventCoverPic.includes('http')) return img_eventCoverPic;
		return img_eventCoverPic ? host + '/images/' + img_eventCoverPic : fourGirlsImg;
	}

	render() {
		const { listingDetails } = this.props;
		const bannerData = [
			{
				title: 'Type',
				// content: <Tag className="m-0" color="#87d068">Cultural</Tag>
				content: listingDetails.category
			},
			{
				title: 'Age Group',
				content: <>{listingDetails.fromAge ? listingDetails.fromAge : <small>NA</small>} - {listingDetails.toAge ? listingDetails.toAge : <small>NA</small>}</>
			},
			{
				title: 'Last Date Registration',
				content: moment(listingDetails.lastDateRegistration).format('DD/MM/YY')
			},
			{
				title: 'Start Date',
				content: moment(listingDetails.fromDate).format('DD/MM/YY')
			},
		];
		const coverImageLink = this.getCoverImageLink();

		return (
			<Card cover={<img style={{ height: '45vh', minHeight: '45vh' }} alt="Cover" src={coverImageLink} />}>
				<Meta
					title={
						<>
							<Col {...titleLayout}>
								<h3 className="font-weight-bold one-line-ellipsis m-0">{listingDetails.name}</h3>
							</Col>
							<Col className="text-right" {...verfiedLayout}>
								{listingDetails.claimedBy ? <Tag color="#00bcd4"><Icon type="safety-certificate" /> <span className="d-none d-md-inline">Verified</span></Tag> : undefined}
							</Col>
						</>
					}
					description={
						<>
							<List
								grid={{ gutter: 16, column: 4 }}
								dataSource={bannerData}
								renderItem={item => (
									<List.Item>
										<Row align="middle" className="text-center" justify="center" type="flex">
											<Col span={24}><small>{item.title}</small></Col>
											<Col span={24}>
												{item.content}
											</Col>
										</Row>
									</List.Item>
								)}
							/>
						</>
					}
				/>
			</Card>
		);
	}
}

export default EventBanner;

