import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-relative-link';

import Navbar from '../../Navbar';

import { getFloatingBtnCss } from '../../../scripts/sharedCss';
import getRandomColor from '../../../scripts/randomColor';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Avatar,
	Card,
	Col,
	Comment,
	Empty,
	Icon,
	Row,
	Skeleton,
	Tooltip
} from 'antd';

const cardColLayout = {
	xs: 24,
	sm: 12,
	md: 8,
	xl: 6,
	xxl: 6
};

class Announcements extends Component {
	componentDidMount() {
		scrollToTop();
	}
	getSortedAnnouncements = () => {
		const { announcements } = this.props;
		announcements.sort((a, b) => {
			if (a.createdAt.valueOf() >= b.createdAt.valueOf()) return -1;
			return 1;
		});
		return announcements;
	}
	render() {
		const { announcements, messageInfo } = this.props;
		const sortedAnnouncements = this.getSortedAnnouncements();
		const announcementsJsx = sortedAnnouncements.map(({ _id, message, receivers, senderId, createdAt }) => (
			<Link to={'./view-announcement/' + _id} key={_id}>
				<Row align="middle" className="border-bottom-fine" type="flex">
					<Col span={22}>
						<Comment
							author={`Received By: ${receivers.length}`}
							avatar={
								<Avatar style={{ backgroundColor: getRandomColor(_id) }}>{message.slice(0, 1).toUpperCase()}</Avatar>
							}
							content={
								<div className="one-line-ellipsis text-dark">{message}</div>
							}
							datetime={
								<Tooltip title={moment(createdAt).fromNow()}>
									<span>{moment(createdAt).fromNow()}</span>
								</Tooltip>
							}
						/>
					</Col>
					<Col span={2}>
						<div><Icon className="text-dark" style={{ fontSize: 20 }} type="fullscreen" /></div>
					</Col>
				</Row>

			</Link>
		));

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col {...cardColLayout} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active></Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<>
				<Navbar renderBackBtn={true} navText="Announcements" />
				<div className="container below-nav">
					{/* <Row gutter={16}> */}
					{messageInfo.fetching ? skeletonCards : (announcements.length === 0 ? emptyJsx : announcementsJsx)}
					{/* </Row> */}
					<Link to="./add-announcement">
						<Icon type="plus-circle" theme="filled" style={getFloatingBtnCss(false)} />
					</Link>
				</div>
			</>
		);
	}
}

export default Announcements;

