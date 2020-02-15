import axios from 'axios';
import React, { Component } from 'react';

import { host } from '../config.json';

import ListingCardV1 from './Search/ListingCardV1';
import ListingCardV3 from './Search/ListingCardV3';

import Navbar from './Navbar';

import {
	Col,
	Empty,
	Icon,
	Row,
	Tabs
} from 'antd';
const TabPane = Tabs.TabPane;

const cardLayout = {
	xs: 24,
	sm: 12,
	md: 8
};

class Bookmark extends Component {
	state = {
		bookmarkedTuitions: [],
		bookmarkedSchools: [],
		bookmarkedEvents: [],
		tabPosition: 'left'
	}

	componentDidMount() {
		this.resize();
	}

	fetchBookmarkedListings = async () => {
		const { userInfo } = this.props;
		if (Boolean(userInfo) === false) return;
		const { bookmarkTuitions, bookmarkSchools, bookmarkEvents } = userInfo;
		try {
			if (userInfo.bookmarkTuitions.length > 0) {
				const { data: bookmarkedTuitions } = await axios.get(`${host}/tuition/multiple`, {
					params: {
						tuitions: bookmarkTuitions
					}
				});
				this.setState({ bookmarkedTuitions });
			}
			if (userInfo.bookmarkSchools.length > 0) {
				const { data: bookmarkedSchools } = await axios.get(`${host}/school/multiple`, {
					params: {
						schools: bookmarkSchools
					}
				});
				this.setState({ bookmarkedSchools });
			}
			if (userInfo.bookmarkEvents.length > 0) {
				const { data: bookmarkedEvents } = await axios.get(`${host}/event/multiple`, {
					params: {
						events: bookmarkEvents
					}
				});
				this.setState({ bookmarkedEvents });
			}
		} catch (error) {
			console.error(error);
		}
	}

	resize() {
		if (window.innerWidth < 768) {
			this.setState({ tabPosition: 'top' });
		}
	}

	render() {
		const { userInfo } = this.props;
		console.log(userInfo);
		const { bookmarkedTuitions, bookmarkedSchools, bookmarkedEvents } = this.state;
		this.fetchBookmarkedListings();

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		return (
			<>
				<Navbar userInfo={userInfo} updateUserInfo={this.props.updateUserInfo} />
				<div className="below-nav container">
					<Tabs className="border p-2" tabPosition={this.state.tabPosition}>
						<TabPane tab={<span><Icon type="read" />Tuitions</span>} key="1">
							{bookmarkedTuitions.length > 0 ?
								<Row gutter={16}>
									{bookmarkedTuitions.map(tuition => {
										return <Col key={tuition._id} {...cardLayout}>
											<ListingCardV1 listingInfo={tuition} listingType='tuition' userInfo={userInfo} />
										</Col>
									})}
								</Row> :
								emptyJsx
							}
						</TabPane>
						<TabPane tab={<span><Icon type="read" />Schools</span>} key="2">
							{bookmarkedSchools.length > 0 ?
								<Row gutter={16}>
									{bookmarkedSchools.map(school => {
										return <Col key={school._id} {...cardLayout}>
											<ListingCardV1 listingInfo={school} listingType='school' userInfo={userInfo} />
										</Col>
									})}
								</Row> :
								emptyJsx
							}
						</TabPane>
						<TabPane tab={<span><Icon type="schedule" />Events</span>} key="3">
							{bookmarkedEvents.length > 0 ?
								<Row gutter={16}>
									{bookmarkedEvents.map(listing => {
										return <Col key={listing._id} {...cardLayout}>
											<ListingCardV3 listingType="event" listingInfo={listing} userInfo={userInfo} />
										</Col>
									})}
								</Row> :
								emptyJsx
							}
						</TabPane>
					</Tabs>
				</div>
			</>
		);
	}
}

export default Bookmark;

