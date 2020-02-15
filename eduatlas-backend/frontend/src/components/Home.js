import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { stringify } from 'query-string';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import { host } from '../config.json';

import coachingCenterSvg from '../images/coaching-center.svg';
import formalSchoolSvg from '../images/formalschool.svg';
import hobbyCenterSvg from '../images/hobycenter.svg';
import preSchoolSvg from '../images/preschool.svg';
import tuitionCenterSvg from '../images/tutioncenter.svg';
import eventSvg from '../images/event.svg';

// temporary quotes
import motivation1 from '../images/motivation1.png';
import motivation4 from '../images/motivation4.png';
import motivation5 from '../images/motivation5.jpeg';
import motivation6 from '../images/motivation6.jpg';

import ListingCardV1 from './Search/ListingCardV1';

import Navbar from './Navbar';

import {
	Avatar,
	Button,
	Col,
	Form,
	Icon,
	Input,
	Row,
} from 'antd';

const cardLayout = {
	xs: 24,
	sm: 12,
	md: 6
};

const footerLinkLayout = {
	xs: 24,
	md: 3
};

const categoryLayout = {
	xs: 12,
	md: 4
};

const whereLayout = {
	xs: 24,
	md: 6
};

const whatLayout = {
	xs: 24,
	md: 12
};

class Home extends Component {
	state = {
		trendingSchools: [],
		trendingTuitions: [],
	}
	async componentDidMount() {
		try {
			const { data: trendingSchools } = await axios.get(`${host}/school/all`, { params: { limit: 4 }, withCredentials: true });
			this.setState({ trendingSchools });
			const { data: trendingTuitions } = await axios.get(`${host}/tuition/multiple`, { params: { tuitions: ['5d0b5ea0f7677d3c365e83f6', '5d19269d6da1383f70b2ec83', '5d10f5ec6a2c9d0af8e9c4b9', '5d11bc6f6a2c9d0af8e9c4bc' ] }, withCredentials: true });
			console.log(trendingTuitions);
			this.setState({ trendingTuitions });
		} catch (error) {
			console.error(error);
		}
	}

	handleSearchSubmit = e => {
		e.preventDefault();
		const { form: { validateFields }, history: { replace } } = this.props;
		validateFields((err, values) => {
			const { location, search } = values;
			const queryString = stringify({ location, search });
			replace(`/search/tuition?${queryString}`);
		});
	}

	render() {
		const { trendingSchools, trendingTuitions } = this.state;
		const { userInfo } = this.props;
		const { getFieldDecorator } = this.props.form;
		const carouselImages = [
			{ src: motivation1, legend: 'quote1' },
			{ src: motivation4, legend: 'quote2' },
			{ src: motivation5, legend: 'quote3' },
			{ src: motivation6, legend: 'quote4' }
		];

		return (
			<>
				<Navbar userInfo={userInfo} updateUserInfo={this.props.updateUserInfo} activeTab="home" />
				<div className="below-nav container">
					<Form onSubmit={this.handleSearchSubmit}>
						<Row gutter={16}>
							<Col {...whatLayout}>
								<Form.Item style={{ marginBottom: '8px' }}>
									{getFieldDecorator('search')(<Input placeholder="What" />)}
								</Form.Item>
							</Col>
							<Col {...whereLayout}>
								<Form.Item style={{ marginBottom: '8px' }}>
									{getFieldDecorator('location')(<Input placeholder="Where" />)}
								</Form.Item>
							</Col>
							<Col {...whereLayout}>
								<Form.Item>
									<Button htmlType="submit" className="mb-3" type="primary" block>Search</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
					{/* <Carousel
						autoPlay={true}
						centerMode={true}
						centerSlidePercentage={100 / 2}
						className="mb-3"
						infiniteLoop={true}
						interval={2000}
						showThumbs={false}
						useKeyboardArrows={true}>
						{carouselImages.map(imageObj => {
							return <div key={imageObj.legend}>
								<img alt="img" src={imageObj.src} />
								<p className="legend">{imageObj.legend}</p>
							</div>;
						})}
					</Carousel> */}
					{/* <h3 className="mb-1 text-center">Categories</h3>
					<Row className="mb-3">
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={coachingCenterSvg} />
							</Row>
							<Row justify="center" type="flex">
								Coaching Center
							</Row>
						</Col>
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={hobbyCenterSvg} />
							</Row>
							<Row justify="center" type="flex">
								Hobby Center
							</Row>
						</Col>
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={formalSchoolSvg} />
							</Row>
							<Row justify="center" type="flex">
								Formal School
							</Row>
						</Col>
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={preSchoolSvg} />
							</Row>
							<Row justify="center" type="flex">
								Pre School
							</Row>
						</Col>
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={tuitionCenterSvg} />
							</Row>
							<Row justify="center" type="flex">
								Tuition Center
							</Row>
						</Col>
						<Col {...categoryLayout}>
							<Row justify="center" type="flex">
								<Avatar size={64} src={eventSvg} />
							</Row>
							<Row justify="center" type="flex">
								Events
							</Row>
						</Col>
					</Row> */}

					<h3 className="mb-1  text-center">Tuition Centers</h3>
					<Row className="mb-1" justify="center" type="flex"><small className="text-info"><Link to="/search/tuition">View All</Link></small></Row>
					<Row className="mb-3" gutter={16}>
						{trendingTuitions.map(tuition => {
							return <Col key={tuition._id} {...cardLayout}>
								<ListingCardV1 listingInfo={tuition} listingType='tuition' userInfo={userInfo} />
							</Col>
						})}
					</Row>
					<h3 className="mb-1  text-center">Schools</h3>
					<Row className="mb-1" justify="center" type="flex"><small className="text-info"><Link to="/search/school">View All</Link></small></Row>
					<Row className="mb-3" gutter={16}>
						{trendingSchools.map(school => {
							return <Col key={school._id} {...cardLayout}>
								<ListingCardV1 listingInfo={school} listingType='school' userInfo={userInfo} />
							</Col>
						})}
					</Row>
				</div>
				<Row justify="center" type="flex" className="bg-dark py-3 text-center">
					<Col {...footerLinkLayout}><a className="text-white" target="_blank" rel="noopener noreferrer" href="http://eduatlas.in">About Us</a></Col>
					<Col {...footerLinkLayout}><Link className="text-white" to='/soon'>Carrers</Link></Col>
					<Col {...footerLinkLayout}><Link className="text-white" to='/soon'>Partner With Us</Link></Col>
					<Col {...footerLinkLayout}><Link className="text-white" to='/privacy-policy'>Privacy Policy</Link></Col>
					<Col {...footerLinkLayout}><Link className="text-white" to='/terms-of-use'>Terms Of Use</Link></Col>
					<Col {...footerLinkLayout}><Link className="text-white" to='/soon'>Disclaimer</Link></Col>
					<Col {...footerLinkLayout}><a className="text-white" target="_blank" rel="noopener noreferrer" href="http://eduatlas.in">Business</a></Col>
					<Col {...footerLinkLayout}><a className="text-white" target="_blank" rel="noopener noreferrer" href="http://eduatlas.in/contact">Contact Us</a></Col>
				</Row>
				<Row className="bg-dark pb-3 text-center" justify="center" type="flex" >
					<a className="text-white" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/eduatlasindia/"><Icon style={{ fontSize: '30px' }} type="facebook" theme="filled" /></a>
					<a className="text-white" target="_blank" rel="noopener noreferrer" href="https://in.linkedin.com/in/eduatlas-india-537a6916a"><Icon style={{ fontSize: '30px' }} type="linkedin" theme="filled" /></a>
					<a className="text-white" target="_blank" rel="noopener noreferrer" href="https://twitter.com/Eduatlas1/"><Icon style={{ fontSize: '30px' }} type="twitter" /></a>
					<a className="text-white" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/eduatlasindia/"><Icon style={{ fontSize: '30px' }} type="instagram" theme="filled" /></a>
				</Row>
			</>
		);
	}
}

export default withRouter(Form.create({ name: 'home-search' })(Home));
