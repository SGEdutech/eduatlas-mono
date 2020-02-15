import axios from 'axios'
import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import copyToClipBoard from '../../scripts/copy-to-clipboard';
import sanatizeFormObj from '../../scripts/sanatize-form-obj';
import { host } from '../../config.json';

import worldSvg from '../../world.svg';

import {
	Button,
	Card,
	Col,
	Form,
	Icon,
	Input,
	InputNumber,
	message,
	notification,
	Modal,
	Row
} from 'antd';
const { Meta } = Card;
const { TextArea } = Input;

const colLayout = {
	xs: 24,
};

class LocationCard extends Component {
	state = {
		confirmLoading: false,
		googleMapsData: undefined,
		leadModalVisible: false,
		shareModalVisible: false,
		userInfo: this.props.userInfo
	}

	async componentDidMount() {
		setTimeout(this.showLeadModal, 10000)
		try {
			const address = this.getAddress();
			const { data: { results } } = await this.getGeoCodeData(address);
			const locationData = results[0].geometry.location
			this.setState({ googleMapsData: locationData })
		} catch (error) {
			console.error(error)
		}
	}

	getAddress = () => {
		const { listingDetails: { addressLine1, addressLine2, city, state, pin } } = this.props;
		let address = '';
		if (addressLine1) address += addressLine1;
		if (addressLine2) address += ', ' + addressLine2;
		if (city) address += ', ' + city;
		if (state) address += ', ' + state;
		if (pin) address += ', ' + pin;
		return address;
	}

	getGeoCodeData = address => {
		return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC8fHii6yy5NABpk8Isz-FRkYEdQHYvLg4`)
	}

	handleBookmarkBtnClick = async () => {
		const { listingDetails, listingType } = this.props;
		const { userInfo } = this.state;
		if (Boolean(userInfo) === false || Boolean(listingDetails) === false) return;
		if (Object.keys(userInfo).length === 0) this.showLoginAlert();

		const isBookmarked = this.isThisListingBookmarked();
		if (isBookmarked) {
			try {
				const { data } = await axios.delete(`${host}/user/delete/${userInfo._id}/bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`, { data: { string: listingDetails._id } })
				message.success('Bookmark Removed');
				const arrayName = `bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`;
				userInfo[arrayName] = userInfo[arrayName].filter(listingId => listingId !== listingDetails._id);
				this.setState({ userInfo });
				console.log(data)
			} catch (error) {
				message.error('Action Failed');
				console.error(error)
			}
		} else {
			try {
				const { data } = await axios.post(`${host}/user/add/${userInfo._id}/bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`, { string: listingDetails._id });
				message.success('Bookmark Added');
				const arrayName = `bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`;
				userInfo[arrayName].push(listingDetails._id)
				this.setState({ userInfo });
				console.log(data)
			} catch (error) {
				message.error('Action Failed');
				console.error(error)
			}
		}
	}

	handleLeadModalCancel = () => this.setState({ leadModalVisible: false });

	handleContactUsBtnClick = () => {
		this.showLeadModal();
	}

	handleCopyToClipboardBtnClick = async () => {
		const { listingDetails, listingType } = this.props;
		try {
			await copyToClipBoard(`${host}/${listingType}/${listingDetails._id}`);
			message.success('Copied To Clipboard');
			this.handleShareModalCancel();
		} catch (error) {
			console.error(error)
			message.error('Action Failed');
		}
	}

	handleLeadModalOk = async () => {
		this.setState({ confirmLoading: true });
		try {
			await this.handleSubmit();
			// TODO: current achitecture won't be able to difference b/w 404 and successfull request
			message.success('Message Sent Successfully');
		} catch (error) {
			this.setState({
				confirmLoading: false,
			});
			message.error('Action Failed');
			console.error(error)
		}
		this.setState({
			leadModalVisible: false,
			confirmLoading: false,
		});
	}

	handleShareBtnClick = () => this.showShareModal();

	handleShareModalCancel = () => this.setState({ shareModalVisible: false });

	handleSubmit = () => {
		const { form, listingDetails, listingType } = this.props;
		const { resetFields } = form;
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			values.source = 'eduatlas.com'
			resetFields();
			return axios.post(`${host}/${listingType}/${listingDetails._id}/lead`, values)
		});
	}

	isThisListingBookmarked = () => {
		const { listingDetails, listingType } = this.props;
		const { userInfo } = this.state;
		if (Boolean(userInfo) === false || Object.keys(userInfo).length === 0 || Boolean(listingDetails) === false) return false;
		const { _id: listingId } = listingDetails;
		const bookmarkedIds = userInfo[`bookmark${listingType.charAt(0).toUpperCase() + listingType.slice(1)}s`];
		return bookmarkedIds.indexOf(listingId) > -1;
	}

	renderMarkers = (map, maps, latlngData) => {
		new maps.Marker({
			position: latlngData,
			map,
			title: 'Tuition'
		});
	}

	showLoginAlert = () => {
		const { history } = this.props;
		notification.open({
			message: 'Not Logged-In',
			description: 'To save Bookmarks you must be logged-in. Tap this alert to go to login page',
			onClick: () => {
				history.push('/login');
			}
		});
	}

	showLeadModal = () => this.setState({ leadModalVisible: true });
	showShareModal = () => this.setState({ shareModalVisible: true });

	render() {
		const { listingDetails, listingType } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { confirmLoading, googleMapsData, leadModalVisible, shareModalVisible } = this.state;
		const isBookmarked = this.isThisListingBookmarked();
		const address = this.getAddress();
		return (
			<Card
				cover={
					<div className="w-100" style={{ height: '150px' }}>
						{googleMapsData ? <GoogleMapReact
							bootstrapURLKeys={{ key: 'AIzaSyC8fHii6yy5NABpk8Isz-FRkYEdQHYvLg4' }}
							defaultCenter={googleMapsData}
							defaultZoom={15}
							onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps, googleMapsData)}
						>
						</GoogleMapReact> : <img alt="map" className="h-100 w-100" src={worldSvg} />}
					</div>
				}>
				<Meta
					description={
						<>
							<Row className="my-2">
								<Button className="mb-1" onClick={this.handleContactUsBtnClick} block>Contact Us</Button>
								<Button className="mb-1" onClick={this.handleBookmarkBtnClick} block>
									<Icon type="book" theme={isBookmarked ? 'twoTone' : undefined} />
									{isBookmarked ? 'Bookmarked' : 'Bookmark'}
								</Button>
								<Button onClick={this.handleShareBtnClick} block><Icon type="share-alt" />Share</Button>
							</Row>
							<Row>
								<Col span={4}>
									<Icon type="bank" />
								</Col>
								<Col span={20}>
									{address ? address : <small>NA</small>}
								</Col>
							</Row>
							<Row>
								<Col span={4}>
									<Icon type="phone" />
								</Col>
								<Col span={20}>
									{listingType !== 'event' && (listingDetails.primaryNumber ? listingDetails.primaryNumber : <small>NA</small>)}
									{listingType === 'event' && (listingDetails.organiserPhone ? listingDetails.organiserPhone : <small>NA</small>)}
								</Col>
							</Row>
							<Row>
								<Col span={4}>
									<Icon type="mail" />
								</Col>
								<Col span={20}>
									{listingType !== 'event' && (listingDetails.email ? listingDetails.email : <small>NA</small>)}
									{listingType === 'event' && (listingDetails.organiserEmail ? listingDetails.organiserEmail : <small>NA</small>)}
								</Col>
							</Row>
							<Modal
								title={`Help ${listingDetails.name} reach you`}
								visible={leadModalVisible}
								onOk={this.handleLeadModalOk}
								confirmLoading={confirmLoading}
								onCancel={this.handleLeadModalCancel}
							>
								<Form onSubmit={this.handleSubmit}>
									<Row gutter={16}>
										<Col {...colLayout}>
											<Form.Item
												label="Your Name"
												hasFeedback={true}>
												{getFieldDecorator('name', {
													rules: [{
														required: true, message: 'Name is required!'
													}]
												})(
													<Input />
												)}
											</Form.Item>
										</Col>
										<Col {...colLayout}>
											<Form.Item
												label="Your Email Address"
												hasFeedback={true}>
												{getFieldDecorator('email', {
													rules: [{
														type: 'email', message: 'Not a valid E-mail!'
													}]
												})(
													<Input />
												)}
											</Form.Item>
										</Col>
										<Col {...colLayout}>
											<Form.Item
												label="Your Phone Number"
												hasFeedback={true}>
												{getFieldDecorator('phone', {
													rules: [{
														required: true, message: 'Phone Number is required!'
													}]
												})(
													<InputNumber className="w-100" />
												)}
											</Form.Item>
										</Col>
										<Col {...colLayout}>
											<Form.Item
												label="Message/Enquiry"
												hasFeedback={true}>
												{getFieldDecorator('message')(
													<TextArea autosize={{ minRows: 4 }} />
												)}
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Modal>
							<Modal
								confirmLoading={confirmLoading}
								footer={false}
								onCancel={this.handleShareModalCancel}
								title={`Share this page`}
								visible={shareModalVisible}>
								<Button className="mb-2" onClick={this.handleCopyToClipboardBtnClick} type="primary" block>Copy Link</Button>
								<a className="d-md-none" href={`whatsapp://send?text=${host}/${listingType}/${listingDetails._id}`}>
									<Button className="mb-2" type="primary" block>Share on Whatsapp</Button>
								</a>
							</Modal>
						</>
					}
				/>
			</Card>
		);
	}
}

// FIXME: memory leak in this component
export default withRouter(Form.create({ name: 'lead-form' })(LocationCard));

