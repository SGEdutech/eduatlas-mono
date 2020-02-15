import moment from 'moment';
import React, { Component } from 'react';

import {
	Col,
	Divider,
	Icon,
	Row,
	Tabs
} from 'antd';
const TabPane = Tabs.TabPane;

class InfoTabsEvent extends Component {
	state = {
		tabPosition: 'left'
	}

	componentDidMount() {
		this.resize();
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

	resize() {
		if (window.innerWidth < 768) {
			this.setState({ tabPosition: 'top' });
		}
	}

	render() {
		const { listingDetails } = this.props;
		const address = this.getAddress();

		const fromTimeJsx = listingDetails.fromTime ? moment(listingDetails.fromTime, ['hh:mm']).format('LT') : <small>NA</small>;
		const toTimeJsx = listingDetails.toTime ? moment(listingDetails.toTime, ['hh:mm']).format('LT') : <small>NA</small>;
		const fromDateJsx = listingDetails.fromDate ? moment(listingDetails.fromDate).format('DD/MM/YY') : <small>NA</small>;
		const toDateJsx = listingDetails.toDate ? moment(listingDetails.toDate).format('DD/MM/YY') : <small>NA</small>;

		return (
			<Tabs className="border p-2" tabPosition={this.state.tabPosition}>
				<TabPane tab={<span><Icon type="profile" />What</span>} key="1">
					<Divider orientation="left">Description</Divider>
					<div>{listingDetails.description}</div>
					<Divider orientation="left">Timings</Divider>
					<Row>
						<Col span={4}>From:</Col>
						<Col span={20}><span className="mx-1">{fromDateJsx}</span> <span>{fromTimeJsx}</span></Col>
					</Row>
					<Row>
						<Col span={4}>To:</Col>
						<Col span={20}><span className="mx-1">{toDateJsx}</span> <span>{toTimeJsx}</span></Col>
					</Row>
					<Divider orientation="left">Cost</Divider>
					{listingDetails.entryFee ? listingDetails.entryFee : <small>NA</small>}
				</TabPane>
				<TabPane tab={<span><Icon type="environment" />Where</span>} key="2">{address}</TabPane>
				<TabPane tab={<span><Icon type="picture" />Gallery</span>} key="3"><small>NA</small></TabPane>
			</Tabs>
		);
	}
}

export default InfoTabsEvent;

