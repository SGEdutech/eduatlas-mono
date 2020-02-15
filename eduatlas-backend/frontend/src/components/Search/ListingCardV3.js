import axios from 'axios';
import moment from 'moment';
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

const dateStyle = {
	width: '40px',
	position: 'absolute',
	bottom: '0',
	right: '0',
	backgroundColor: '#00bcd4'
}

class ListingCardV3 extends Component {
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
		const { listingInfo: listingDetails } = this.props;
		let img_eventCoverPic;
		if (listingDetails) img_eventCoverPic = listingDetails.img_eventCoverPic ? listingDetails.img_eventCoverPic : undefined;
		if (img_eventCoverPic && img_eventCoverPic.includes('http')) return img_eventCoverPic;
		return img_eventCoverPic ? host + '/images/' + img_eventCoverPic : fourGirlsImg;
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
										{listingDetails.claimedBy ? <Tag color="#00bcd4"><Icon type="safety-certificate" /> Verified</Tag> : undefined}
									</Row>
									<Row className="w-100 h-75">
										<div style={dateStyle}>
											<Row className="my-1" justify="center" type="flex">
												<span className="text-white" style={{ fontSize: '1.17em', fontWeight: '600' }}>
													{listingDetails.fromDate ? moment(listingDetails.fromDate).format("MMM Do YY").split(' ')[1] : 'NA'}
												</span>
											</Row>
											<Row className="my-1" justify="center" type="flex">
												<small className="text-dark">
													{listingDetails.fromDate ? moment(listingDetails.fromDate).format("MMM Do YY").split(' ')[0] : 'NA'}
												</small>
											</Row>
										</div>
									</Row>
								</Link>
							)
					}>
					<Row>
						<Col span={4}>
							<Icon type="calendar" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{listingDetails.fromDate ? moment(listingDetails.fromDate).format('DD/MM/YY') + ' - ' : <small>NA</small>}
							{listingDetails.toDate ? moment(listingDetails.toDate).format('DD/MM/YY') : <small>NA</small>}
						</Col>
					</Row>
					<Row>
						<Col span={4}>
							<Icon type="clock-circle" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{listingDetails.fromTime ? moment(listingDetails.fromTime, ["hh:mm"]).format('LT') + ' - ' : <small>NA-</small>}
							{listingDetails.toTime ? moment(listingDetails.toTime, ["hh:mm"]).format('LT') : <small>NA</small>}
						</Col>
					</Row>
					<Row>
						<Col span={4}>
							<Icon type="bank" />
						</Col>
						<Col className="one-line-ellipsis" span={20}>
							{address ? address : <small>NA</small>}
						</Col>
					</Row>
				</Card >
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

export default ListingCardV3;

