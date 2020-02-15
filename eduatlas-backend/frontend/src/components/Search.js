import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { parse, stringify } from 'query-string';

import ListingCardV1 from './Search/ListingCardV1';
import ListingCardV3 from './Search/ListingCardV3';
import Spinner from './Spinner';

import Navbar from './Navbar';

import {
	Button,
	Col,
	Input,
	Pagination,
	Radio,
	Row,
	Select,
	Tag
} from 'antd';

import axios from 'axios';

import { host } from '../config.json';

const leftColLayout = {
	xs: 24,
	md: 6
};

const rightColLayout = {
	xs: 24,
	md: 18
};

const cardLayout = {
	xs: 24,
	md: 8
};

const validCategories = [
	'tuition',
	'school',
	'event'
];

const itemsPerPage = 12;

const demands = {
	institute: 'name addressLine1 addressLine2 city state pin reviews primaryNumber email claimedBy img_tuitionCoverPic img_schoolCoverPic',
	event: 'name addressLine1 addressLine2 city state pin primaryNumber email claimedBy fromDate fromTime toDate toTime img_eventCoverPic'
};

class Search extends Component {
	state = {
		category: null,
		currentPage: 1,
		displaySearch: null,
		displayLocation: null,
		isLoading: false,
		search: null,
		searchResults: [],
		totalSearchItems: 0,
		location: null
	}

	fetchSearchData = async () => {
		try {
			const { category, currentPage, displayLocation, displaySearch } = this.state;
			this.setState({ isLoading: true });
			const { data: { docs: searchResults, total: totalSearchItems } } = await axios.get(`${host}/${category}/search`, {
				params: {
					location: displayLocation,
					search: displaySearch,
					opts: JSON.stringify({
						demands: category === 'event' ? demands.event : demands.institute,
						limit: itemsPerPage,
						page: currentPage
					})
				}
			});
			this.setState({ isLoading: false });
			this.setState({ searchResults, totalSearchItems });
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		}

	}

	handleCategoryChange = e => {
		const category = e.target.value;
		const { history } = this.props;
		this.setState(prevState => {
			const { search, location } = prevState;
			const searchString = stringify({ location, search });
			history.push(`/search/${category}?${searchString}`);
			return { category };
		}, this.fetchSearchData);
	};

	handleInputChange = e => {
		const nextState = {};
		const inputNode = e.currentTarget;
		nextState[inputNode.id] = inputNode.value;
		this.setState(nextState);
	};

	handlePageChange = currentPage => {
		this.setState({ currentPage }, this.fetchSearchData);
	};

	initSearch = () => {
		this.setState(prevState => {
			const { category, location, search } = prevState;
			const { history } = this.props;
			const searchString = stringify({ location, search });
			history.push(`/search/${category}?${searchString}`);
			return { currentPage: 1, displayLocation: location, displaySearch: search };
		}, this.fetchSearchData);
	};

	componentDidMount() {
		// searchQuery is optional
		const { match: { params: { category } } } = this.props;
		const searchObject = parse(this.props.location.search);
		searchObject.displayLocation = searchObject.location;
		searchObject.displaySearch = searchObject.search;
		this.setState({ ...searchObject, category }, this.fetchSearchData);
	}

	componentDidUpdate(prevProps, prevState) {
		const { category: urlCategory } = this.props.match.params;
		const { category: stateCategory } = this.state;
		if (urlCategory !== stateCategory) this.setState({ category: urlCategory }, this.initSearch);
	}

	render() {
		const { userInfo } = this.props;
		const { category, currentPage, displaySearch, displayLocation, isLoading, location, search, searchResults, totalSearchItems } = this.state;
		const isCategoryValid = Boolean(validCategories.find(validCategory => validCategory === category));
		// Category null is assumed to be initial value
		if (category !== null && isCategoryValid === false) return <Redirect to="/404" />;
		return (
			<>
				<Navbar userInfo={userInfo} updateUserInfo={this.props.updateUserInfo} activeTab={category} />
				<div className="below-nav container">
					<Row gutter={16}>
						<Col className="mt-5" {...leftColLayout}>
							<Row justify="center" type="flex">
								<h4 className="m-0 mb-3">What are you looking for ?</h4>
								<Input className="mb-1" id="search" onChange={this.handleInputChange} placeholder="What" value={search} />
								<Input className="mb-3" id="location" onChange={this.handleInputChange} placeholder="Where" value={location} />
								<Radio.Group className="mb-3" value={category} buttonStyle="solid" onChange={this.handleCategoryChange} size="small">
									<Radio.Button value="tuition">Tuitions</Radio.Button>
									<Radio.Button value="school">Schools</Radio.Button>
									<Radio.Button value="event">Events</Radio.Button>
								</Radio.Group>
								<Button onClick={this.initSearch} type="primary" block>Search</Button>
							</Row>
						</Col>
						<Col className="mt-5" {...rightColLayout}>
							<Row gutter={16}>
								<Col {...rightColLayout}>
									<h5 className="m-0 mb-3">Showing listings {displaySearch ? <span>for search <Tag>{displaySearch}</Tag></span> : ''} {displayLocation ? <span>in location <Tag>{displayLocation}</Tag></span> : ''}</h5>
								</Col>
								{/* <Col {...leftColLayout}>
								<Select className="w-100 mb-3" placeholder="Sort By">
									<Option value="tuition">Tuition</Option>
									<Option value="school">School</Option>
									<Option value="event">Event</Option>
								</Select>
							</Col> */}
							</Row>
							<Row gutter={16}>
								{searchResults.map(listing => (
									<Col {...cardLayout} key={listing._id}>
										{category === 'event' ? <ListingCardV3 listingType="event" listingInfo={listing} userInfo={userInfo} isLoading={isLoading} /> :
											<ListingCardV1 listingType={category} listingInfo={listing} userInfo={userInfo} isLoading={isLoading} />
										}
									</Col>
								))}
							</Row>
							<Row className="mb-5" justify="center" type="flex">
								<Pagination current={currentPage} hideOnSinglePage={true} onChange={this.handlePageChange} pageSize={itemsPerPage} total={totalSearchItems} />
							</Row>
						</Col>
					</Row>

				</div>
			</>
		);
	}
}

export default withRouter(Search);
