import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { host } from '../../config.json';

import fourGirlsImg from '../../images/fourgirls.jpg';

import {
	Card,
	Icon,
	Row,
	Tag
} from 'antd';

class ListingCardV2 extends Component {
	getCoverImageLink = () => {
		const { listingDetails, listingType } = this.props;
		let img_coverPic;
		if (listingDetails) img_coverPic = listingDetails[`img_${listingType}CoverPic`] ? listingDetails[`img_${listingType}CoverPic`] : undefined;
		if (img_coverPic && img_coverPic.includes('http')) return img_coverPic;
		return img_coverPic ? host + '/images/' + img_coverPic : fourGirlsImg;
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

	handleCardClick = () => {
		const { listingDetails, listingType } = this.props;
		window.open(`/${listingType}/${listingDetails._id}`, "_blank")
		// history.push(`/${listingType}/${listingDetails._id}`)
	}

	render() {
		const { listingDetails, listingType } = this.props;
		let ratingInfo = undefined;
		if (listingType !== 'event') ratingInfo = this.getRating();
		const coverImgLink = this.getCoverImageLink();

		return (
			<Card
				className="mb-1 pointer"
				onClick={this.handleCardClick}
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url("${coverImgLink}")`,
					backgroundSize: 'cover',
					minHeight: '180px'
				}}
			>
				<Row><h4 className="one-line-ellipsis text-white">{listingDetails.name}</h4></Row>
				<Row className="mb-2">
					{ratingInfo && <Tag color="#fadb14">{ratingInfo.rating}/5</Tag>}
					{listingDetails.claimedBy ? <Tag color="#00bcd4"><Icon type="safety-certificate" /> Verified</Tag> : undefined}
				</Row>
				{listingDetails.category &&
					<Row>
						{listingDetails.category.split(',').map(category => <Tag className="mb-1" color="#87d068" key={category}>{category}</Tag>)}
					</Row>
				}
			</Card>
		);
	}
}

export default withRouter(ListingCardV2);

