import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { host } from '../../config.json';
import copyToClipBoard from '../../scripts/copy-to-clipboard';

import fourGirlsImg from '../../images/fourgirls.jpg';
import LoadingGif from '../../images/loading.gif';

import {
	Button,
	Card,
	Col,
	Icon,
	message,
	Modal,
	Row,
	Tag
} from 'antd';

class ListingCardV1 extends Component {
	state = {
		shareModalVisible: false,
		userInfo: this.props.userInfo
	}
	getAddress = () => {
		const { listingInfo: { addressLine1, addressLine2, city, state, pin } } = this.props;
		let address = '';
		if (addressLine1) address += addressLine1;
		if (addressLine2) address += ', ' + addressLine2;
		if (city) address += ', ' + city;
		if (state) address += ', ' + state;
		if (pin) address += ', ' + pin;
		return address;
	}

	getCoverImageLink = () => {
		const { listingInfo: listingDetails, listingType } = this.props;
		let img_coverPic;
		if (listingDetails) img_coverPic = listingDetails[`img_${listingType}CoverPic`] ? listingDetails[`img_${listingType}CoverPic`] : undefined;
		if (img_coverPic && img_coverPic.includes('http')) return img_coverPic;
		return img_coverPic ? host + '/images/' + img_coverPic : fourGirlsImg;
	}

	getRating = () => {
		const { listingInfo: { reviews } } = this.props;
		if (Boolean(reviews) === false || Boolean(reviews.length) === false) return { numRating: 0, rating: 2.5, color: '#fadb14' };
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

	handleBookmarkBtnClick = async () => {
		const { listingInfo, listingType } = this.props;
		const { userInfo } = this.state;
		if (Boolean(userInfo) === false || Boolean(listingInfo) === false) return;
		if (Object.keys(userInfo).length === 0) this.showLoginAlert();

		const isBookmarked = this.isThisListingBookmarked();
		if (isBookmarked) {
			try {
				const { data } = await axios.delete(`${host}/user/delete/${userInfo._id}/bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`, { data: { string: listingInfo._id } })
				message.success('Bookmark Removed');
				const arrayName = `bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`;
				userInfo[arrayName] = userInfo[arrayName].filter(listingId => listingId !== listingInfo._id);
				this.setState({ userInfo });
				console.log(data)
			} catch (error) {
				message.error('Action Failed');
				console.error(error)
			}
		} else {
			try {
				const { data } = await axios.post(`${host}/user/add/${userInfo._id}/bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`, { string: listingInfo._id });
				message.success('Bookmark Added');
				const arrayName = `bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`;
				userInfo[arrayName].push(listingInfo._id)
				this.setState({ userInfo });
			} catch (error) {
				message.error('Action Failed');
				console.error(error)
			}
		}
	}

	handleCopyToClipboardBtnClick = async () => {
		const { listingInfo: listingDetails, listingType } = this.props;
		try {
			await copyToClipBoard(`${host}/${listingType}/${listingDetails._id}`);
			message.success('Copied To Clipboard');
			this.handleShareModalCancel();
		} catch (error) {
			console.error(error)
			message.error('Action Failed due to: ' + error);
		}
	}

	handleShareBtnClick = () => this.showShareModal();
	handleShareModalCancel = () => this.setState({ shareModalVisible: false })

	isThisListingBookmarked = () => {
		const { listingInfo, listingType } = this.props;
		const { userInfo } = this.state;
		if (Boolean(userInfo) === false || Object.keys(userInfo).length === 0 || Boolean(listingInfo) === false) return false;
		const { _id: listingId } = listingInfo;
		const bookmarkedIds = userInfo[`bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`];
		return bookmarkedIds.indexOf(listingId) > -1;
	}

	showShareModal = () => this.setState({ shareModalVisible: true });

	render() {
		const { listingInfo: listingDetails, listingType, isLoading } = this.props;
		const { shareModalVisible } = this.state;
		const address = this.getAddress();
		const ratingInfo = this.getRating();
		const coverImgLink = this.getCoverImageLink();
		const isBookmarked = this.isThisListingBookmarked();
		return (
			<>
				<Card
					loading={isLoading}
					actions={[<Icon type="book" theme={isBookmarked ? 'twoTone' : undefined} color="#00bcd4" onClick={this.handleBookmarkBtnClick} />, <Icon onClick={this.handleShareBtnClick} type="share-alt" />]}
					className="mb-3"
					cover={
						isLoading ? (
							<div className="p-3 pointer"
								style={{
									backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url("${LoadingGif}")`,
									backgroundRepeat: 'no-repeat',
									backgroundSize: '100% 100%',
									height: '180px'
								}} />
						) : (
						<Link
							className="p-3 pointer"
							style={{
								backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url("${coverImgLink}")`,
								backgroundSize: 'cover',
								height: '180px'
							}}
							to={'/' + listingType + '/' + listingDetails._id}>
							<Row><h4 className="one-line-ellipsis text-white">{listingDetails.name}</h4></Row>
							<Row className="mb-2">
								<Tag color={ratingInfo.color}>{ratingInfo.rating}/5</Tag>
								{listingDetails.claimedBy ? <Tag color="#00bcd4"><Icon type="safety-certificate" /> Verified</Tag> : undefined}
							</Row>
						</Link>
						)
					}>
					<Row>
						<Col span={4}>
							<Icon type="bank" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{address ? address : <small>NA</small>}
						</Col>
					</Row>
					<Row>
						<Col span={4}>
							<Icon type="phone" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{listingDetails.primaryNumber ? listingDetails.primaryNumber : <small>NA</small>}
						</Col>
					</Row>
					<Row>
						<Col span={4}>
							<Icon type="mail" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{listingDetails.email ? listingDetails.email : <small>NA</small>}
						</Col>
					</Row>
				</Card>
				<Modal
					footer={false}
					onCancel={this.handleShareModalCancel}
					title={`Share this listing`}
					visible={shareModalVisible}>
					<Button className="mb-2" onClick={this.handleCopyToClipboardBtnClick} type="primary" block>Copy Link</Button>
					<a className="d-md-none" href={`whatsapp://send?text=${host}/${listingType}/${listingDetails._id}`}>
						<Button className="mb-2" type="primary" block>Share on Whatsapp</Button>
					</a>
				</Modal>
			</>
		);
	}
}

export default ListingCardV1;

