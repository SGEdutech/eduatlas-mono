import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { host } from '../config.json';

import ActionButtonsInstitute from './ListingDetails/ActionButtonsInstitute';
import EventBanner from './ListingDetails/EventBanner';
import InfoTabsEvent from './ListingDetails/InfoTabsEvent';
import InfoTabsInstitute from './ListingDetails/InfoTabsInstitute';
import InstituteBanner from './ListingDetails/InstituteBanner';
import LocationCard from './ListingDetails/LocationCard';
import RelatedListing from './ListingDetails/RelatedListing';
import Spinner from './Spinner';
import SponsoredListing from './ListingDetails/SponsoredListing';

import Navbar from './Navbar';

import {
	Col,
	Row
} from 'antd';

const leftColLayout = {
	xs: 24,
	md: 18
};

const rightColLayout = {
	xs: 24,
	md: 6
};

class ListingDetails extends Component {
	state = {
		listingDetails: {}
	}

	async componentDidMount() {
		try {
			const { listingType, match: { params: { eventId, schoolId, tuitionId } } } = this.props;
			let listingDetails = undefined;
			if (listingType === 'tuition') {
				const { data: listingInfo } = await axios.get(`${host}/tuition`, { params: { _id: tuitionId }, withCredentials: true });
				listingDetails = listingInfo;
			}
			if (listingType === 'school') {
				const { data: listingInfo } = await axios.get(`${host}/school`, { params: { _id: schoolId }, withCredentials: true });
				listingDetails = listingInfo;
			}
			if (listingType === 'event') {
				const { data: listingInfo } = await axios.get(`${host}/event`, { params: { _id: eventId }, withCredentials: true });
				listingDetails = listingInfo;
			}
			this.setState({ listingDetails });
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const { listingType, userInfo } = this.props;
		const { listingDetails } = this.state;
		const isListingDetailsFetched = Object.keys(listingDetails).length !== 0;
		if (isListingDetailsFetched === false) return <Spinner />
		return (
			<>
				<Navbar userInfo={userInfo} updateUserInfo={this.props.updateUserInfo} />
				<div className="below-nav container">
					<Row align="middle" className="mt-5 mb-3" gutter={16} type="flex">
						<Col {...leftColLayout}>
							{listingType === 'event' ? <EventBanner listingDetails={listingDetails} /> : <InstituteBanner listingDetails={listingDetails} />}
						</Col>
						<Col {...rightColLayout}>
							<LocationCard listingDetails={listingDetails} listingType={listingType} userInfo={userInfo} />
						</Col>
					</Row>
					<Row gutter={16}>
						<Col {...leftColLayout}>
							{listingType === 'event' ? <InfoTabsEvent listingDetails={listingDetails} /> : <InfoTabsInstitute listingDetails={listingDetails} listingType={listingType} userInfo={userInfo} />}
							<Row className="d-none d-md-block mt-5" justify="center" type="flex">Related Listing</Row>
							<Row className="d-none d-md-block mb-5" gutter={16}>
								<RelatedListing listingDetails={listingDetails} listingType={listingType} />
							</Row>
						</Col>
						<Col {...rightColLayout}>
							<ActionButtonsInstitute listingDetails={listingDetails} listingType={listingType} />
							<Row className="mt-3" justify="center" type="flex">Sponsored and Popular</Row>
							<Row gutter={16}>
								<SponsoredListing listingDetails={listingDetails} listingType={listingType} />
							</Row>
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default withRouter(ListingDetails);

