import React, { Component } from 'react';
import scrollToTop from '../../scripts/scrollToTop';
import { tuitionName } from '../../config.json';

import eduatlasLogo from '../../fallback-dp.svg';
import tuitionLogo from '../../tuition-logo.svg';

import {
	Alert,
	Avatar,
	Card,
	Col,
	Empty,
	Row,
	Skeleton
} from 'antd';

const dateNTimeLayout = { xs: 24, md: 4 };
const messageLayout = { xs: 24, md: 20 };

export default class Notifications extends Component {
	componentDidMount() {
		scrollToTop();
	}

	onClose = id => {
		const { readNotification } = this.props;
		readNotification({ ids: [id] });
	}

	render() {
		const { messageInfo, notifications, studentEmail } = this.props;

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col span={24} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active>
						</Skeleton>
					</Card>
				</Col>
			);
		}

		const notificationsOfThisStudent = notifications.filter(notification => notification.receivers.find(receiver => Boolean(receiver.readAt) === false && receiver.userEmail === studentEmail));
		const notificationJsx = notificationsOfThisStudent.map(notification => (
			<Alert
				className="mb-3"
				description={
					<Row>
						<Col {...messageLayout}>{notification.message}</Col>
						<Col className="text-right" {...dateNTimeLayout}><small>{notification.createdAt.fromNow()}</small></Col>
					</Row>
				}
				key={notification._id}
				message={
					<Row>
						<Col className="one-line-ellipsis" span={20}>{tuitionName}</Col>
						<Col className="text-right" span={4}><small className="cursor-pointer" onClick={() => this.onClose(notification._id)}>close</small></Col>
					</Row>
				}
				showIcon
				icon={window.cordova ? <Avatar src={tuitionLogo} /> : <Avatar src={eduatlasLogo} />}
				type="info" />
		));

		return (
			< div className="container" >{messageInfo.fetching ? skeletonCards : (notificationsOfThisStudent.length === 0 ? emptyJsx : notificationJsx)}</div >
		);
	}
}
