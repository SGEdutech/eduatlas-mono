import axios from 'axios';
import React, { Component } from 'react';

import ListingCardV2 from './ListingCardV2';

import { host } from '../../config.json';

import {
	Col
} from 'antd';

const relatedCardLayout = {
	xs: 24,
	md: 8
};

const demands = {
	institute: 'name addressLine1 addressLine2 city state pin reviews primaryNumber email claimedBy img_tuitionCoverPic img_schoolCoverPic category',
	event: 'name addressLine1 addressLine2 city state pin primaryNumber email claimedBy fromDate fromTime toDate toTime img_eventCoverPic'
};

const totalNumberOfSponsoredAllowed = 3;

class RelatedListing extends Component {
	state = {
		sponsoredListing: []
	}

	async componentDidMount() {
		const { listingDetails, listingType } = this.props;
		try {
			const { data: { docs: searchResults } } = await axios.get(`${host}/${listingType}/search`, {
				params: {
					location: listingDetails.city,
					// search: displaySearch,
					opts: JSON.stringify({
						demands: listingType === 'event' ? demands.event : demands.institute,
						limit: totalNumberOfSponsoredAllowed + 1,
						page: 1
					})
				}
			});
			this.setState({ sponsoredListing: searchResults.filter(listing => listing._id !== listingDetails._id) });
		} catch (error) {
			console.error(error)
		}
	}

	render() {
		const { sponsoredListing } = this.state;
		const { listingType } = this.props;
		return (
			<>
				{sponsoredListing.map((listing, index) => {
					if (index + 1 > totalNumberOfSponsoredAllowed) return undefined;
					return <Col key={listing._id} {...relatedCardLayout}>
						<ListingCardV2 listingDetails={listing} listingType={listingType} />
					</Col>
				})}
			</>
		);
	}
}

export default RelatedListing;