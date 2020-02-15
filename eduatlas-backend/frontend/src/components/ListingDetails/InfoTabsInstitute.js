import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { host } from '../../config.json';

import ContactInfoTab from './InfoTabsInstitute/ContactInfoTab';

import {
	Avatar,
	Button,
	Comment,
	Divider,
	Empty,
	Icon,
	Input,
	List,
	notification,
	Rate,
	Row,
	Tabs,
	Tooltip
} from 'antd';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

class InfoTabsInstitute extends Component {
	state = {
		rating: undefined,
		review: undefined,
		reviews: this.props.listingDetails.reviews ? this.props.listingDetails.reviews : [],
		tabPosition: 'left'
	}

	componentDidMount() {
		this.resize();
	}

	handleRateChange = rating => {
		const { userInfo } = this.props;
		if (Object.keys(userInfo).length === 0) this.showLoginAlert();
		this.setState({ rating });
	}

	handleReviewChange = review => {
		const { userInfo } = this.props;
		if (Object.keys(userInfo).length === 0) this.showLoginAlert();
		this.setState({ review });
	}

	handleReviewSubmit = async () => {
		try {
			const { listingDetails, listingType, userInfo } = this.props;
			const { rating, review } = this.state;
			if (Object.keys(userInfo).length === 0) return;
			const reviewObj = { rating, description: review, owner: userInfo._id };
			const { data: addedReview } = await axios.post(`${host}/${listingType}/add/${listingDetails._id}/reviews`, reviewObj);
			console.log(addedReview);
		} catch (error) {
			console.error(error);
		}
	}

	resize() {
		if (window.innerWidth < 768) {
			this.setState({ tabPosition: 'top' });
		}
	}

	showLoginAlert = () => {
		const { history } = this.props;
		notification.open({
			message: 'Not Logged-In',
			description: 'To add Review/Rating you must be logged-in. Tap this alert to go to login page',
			onClick: () => {
				history.push('/login');
			}
		});
	}

	render() {
		const { listingDetails, listingType, userInfo } = this.props;
		const { rating, reviews } = this.state;
		const isLoggedIn = userInfo && Object.keys(userInfo).length !== 0;

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		return (
			<Tabs className="border p-2" tabPosition={this.state.tabPosition}>
				<TabPane tab={<span><Icon type="profile" />Description</span>} key="1">
					<Divider orientation="left">Facilities</Divider>
					<List
						itemLayout="vertical"
						dataSource={listingDetails.facilities ? listingDetails.facilities.split(',') : []}
						renderItem={item => (<List.Item className="p-0" style={{ borderBottom: '0px' }}><Icon className="mr-1" type="check-circle" />{item}</List.Item>)}
					/>
					<Divider orientation="left">About Us</Divider>
					<div>{listingDetails.description ? listingDetails.description : <small>NA</small>}</div>
				</TabPane>
				<TabPane tab={<span><Icon type="phone" />Contact Info</span>} key="2">
					<ContactInfoTab listingDetails={listingDetails} listingType={listingType} />
				</TabPane>
				{listingType === 'school' && <TabPane tab={<span><Icon type="form" />Admission</span>} key="8">
					<Divider orientation="left">Fee Details</Divider>
					{listingDetails.fee ? listingDetails.fee : <small>NA</small>}
					<Divider orientation="left">Admission Process</Divider>
					{listingDetails.admissionProcess ? listingDetails.admissionProcess : <small>NA</small>}
					<Divider orientation="left">Eligibility Criteria</Divider>
					{listingDetails.eligibilityCriteria ? listingDetails.eligibilityCriteria : <small>NA</small>}
					<Divider orientation="left">Important Dates</Divider>
					<List
						itemLayout="vertical"
						dataSource={listingDetails.importantDates ? listingDetails.importantDates : []}
						renderItem={dateObj => (<List.Item className="p-0" style={{ borderBottom: '0px' }}>{dateObj.title + ' : ' + moment(dateObj.date).format('DD/MM/YY')}</List.Item>)}
					/>
				</TabPane>}
				{listingType === 'school' && <TabPane tab={<span><Icon type="rocket" />Activities</span>} key="9">
					<List
						itemLayout="vertical"
						dataSource={listingDetails.activities ? listingDetails.activities : []}
						renderItem={item => (<List.Item className="p-0" style={{ borderBottom: '0px' }}><Icon className="mr-1" type="check-circle" />{item}</List.Item>)}
					/>
				</TabPane>}
				<TabPane tab={<span><Icon type="profile" />Courses</span>} key="3">
					<small>NA</small>
				</TabPane>
				<TabPane tab={<span><Icon type="trophy" />Results</span>} key="4">
					<small>NA</small>
				</TabPane>
				<TabPane tab={<span><Icon type="user" />Faculty</span>} key="5">
					<small>NA</small>
				</TabPane>
				<TabPane tab={<span><Icon type="picture" />Gallery</span>} key="6">
					<small>NA</small>
				</TabPane>
				<TabPane tab={<span><Icon type="star" />Reviews</span>} key="7">
					<Divider orientation="left">Rate And Review</Divider>
					<Row><small>Your Rating and Review will be visible to all.</small></Row>
					<Row className="mb-2"><Rate onChange={this.handleRateChange} /></Row>
					<Row className="mb-2"><TextArea onChange={this.handleReviewChange} placeholder="Type Review Here" autosize={{ minRows: 4 }} /></Row>
					<Button type="primary" disabled={isLoggedIn === false || rating === undefined} onClick={this.handleReviewSubmit} block>Submit</Button>
					<Divider orientation="left">Reviews</Divider>
					{reviews.length > 0 ? reviews.map(review => {
						return <Comment
							author={review.owner}
							avatar={(
								<Avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									alt={review.owner}
								/>
							)}
							content={(
								<>
									<Rate allowHalf disabled defaultValue={parseFloat(review.rating)} />
									<p>{review.description}</p>
								</>
							)}
							datetime={(
								<Tooltip title={moment(review.createdAt).format('lll')}>
									<span>{moment(review.createdAt).fromNow()}</span>
								</Tooltip>
							)}
							key={review._id}
						/>;
					}) :
						emptyJsx}
				</TabPane>
			</Tabs>
		);
	}
}

export default withRouter(InfoTabsInstitute);

