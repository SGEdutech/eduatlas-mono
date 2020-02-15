import axios from 'axios';
import React, { Component } from 'react';

import ListingCardV2 from './ListingCardV2';

import { host } from '../../config.json';

import {
	Col
} from 'antd';

const sponsoredCardLayout = {
	xs: 24
};

const sponsoredIds = ['5b2a129a35d37428c37f4039', '5c9a27ef708d67210e8532d0'];

class SponsoredListing extends Component {
	state = {
		sponsoredListing: []
	}

	async componentDidMount() {
		const { listingDetails } = this.props;
		try {
			const { data } = await axios.get(`${host}/tuition/multiple`, {
				params: {
					tuitions: sponsoredIds,
				}
			});
			this.setState({ sponsoredListing: data.filter(listing => listing._id !== listingDetails._id) });
		} catch (error) {
			console.error(error)
		}
	}

	render() {
		const { sponsoredListing } = this.state;
		return (
			<>
				{sponsoredListing.map((listing, index) => {
					return <Col key={listing._id} {...sponsoredCardLayout}>
						<ListingCardV2 listingDetails={listing} listingType='tuition' />
					</Col>
				})}
			</>
		);
	}
}

export default SponsoredListing;