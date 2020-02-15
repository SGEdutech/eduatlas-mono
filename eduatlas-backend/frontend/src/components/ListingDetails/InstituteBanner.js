import React, { Component } from 'react';

import { host } from '../../config.json';

import fourGirlsImg from '../../images/fourgirls.jpg';

import {
	Card,
	Col,
	Icon,
	Rate,
	Tag
} from 'antd';
const { Meta } = Card;

const titleLayout = {
	xs: 20
};

const verfiedLayout = {
	xs: 4
};

const tagsLayout = {
	xs: 24,
	md: 18
};
const ratingLayout = {
	xs: 24,
	md: 6
};

class InstituteBanner extends Component {
	getCoverImageLink = () => {
		const { listingDetails } = this.props;
		let img_tuitionCoverPic;
		if (listingDetails) img_tuitionCoverPic = listingDetails.img_tuitionCoverPic ? listingDetails.img_tuitionCoverPic : undefined;
		if (img_tuitionCoverPic && img_tuitionCoverPic.includes('http')) return img_tuitionCoverPic;
		return img_tuitionCoverPic ? host + '/images/' + img_tuitionCoverPic : fourGirlsImg;
	}

	getRating = () => {
		const { listingDetails: { reviews } } = this.props;
		if (reviews.length === 0) return { numRating: 0, rating: 2.5, color: '#fadb14' };
		const ratingInfo = { numRating: 0, rating: 0, color: null };
		reviews.forEach(review => {
			ratingInfo.rating += review.rating;
			ratingInfo.numRating++;
		});
		ratingInfo.rating = parseFloat(ratingInfo.rating / ratingInfo.numRating).toFixed(2);
		if (ratingInfo.rating >= 4) ratingInfo.color = '#87d068';
		if (ratingInfo.rating >= 2.5 && ratingInfo.rating < 4) ratingInfo.color = '#fadb14';
		if (ratingInfo.rating >= 0 && ratingInfo.rating < 2.5) ratingInfo.color = '#FF2323';
		return ratingInfo;
	}

	render() {
		const { listingDetails } = this.props;
		const coverImageLink = this.getCoverImageLink();
		const categoryTagsJsx = listingDetails.category ? listingDetails.category.split(',').map(category => <Tag className="mb-1" color="#87d068" key={category}>{category}</Tag>) : undefined;
		const ratingInfo = this.getRating();

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
							<Col {...tagsLayout}>
								{categoryTagsJsx}
							</Col>
							<Col className="text-md-right" {...ratingLayout}><Rate allowHalf disabled defaultValue={parseFloat(ratingInfo.rating)} /></Col>
						</>
					}
				/>
			</Card>
		);
	}
}

export default InstituteBanner;

