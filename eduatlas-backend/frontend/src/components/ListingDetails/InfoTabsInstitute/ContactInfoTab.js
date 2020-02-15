import React, { Component } from 'react';

import {
	Col,
	Divider,
	Icon,
	Row
} from 'antd';

const contactInfoHeadingLayout = {
	xs: 8,
	md: 12
};

const contactInfoValueLayout = {
	xs: 16,
	md: 12
};

const contactInfoFromTimeLayout = {
	xs: 8,
	md: 6
};

class ContactInfoTab extends Component {
	getDayAndTimeInfo = () => {
		const { listingDetails, listingType } = this.props;
		const dayAndTimeInfo = {
			Monday: { fromTime: undefined, toTime: undefined },
			Tuesday: { fromTime: undefined, toTime: undefined },
			Wednesday: { fromTime: undefined, toTime: undefined },
			Thursday: { fromTime: undefined, toTime: undefined },
			Friday: { fromTime: undefined, toTime: undefined },
			Saturday: { fromTime: undefined, toTime: undefined },
			Sunday: { fromTime: undefined, toTime: undefined }
		};
		if (listingType === 'tuition' && Boolean(listingDetails.dayAndTimeOfOperation) === false) return dayAndTimeInfo;
		if (listingType === 'school' && Boolean(listingDetails.schoolTiming) === false) return dayAndTimeInfo;
		if (listingType === 'tuition') {
			listingDetails.dayAndTimeOfOperation.forEach(dayInfo => {
				const { fromTime, toTime } = dayInfo;
				let { day } = dayInfo;
				day = day.charAt(0).toUpperCase() + day.slice(1);
				dayAndTimeInfo[day].fromTime = fromTime;
				dayAndTimeInfo[day].toTime = toTime;
			});
		}
		if (listingType === 'school') {
			listingDetails.schoolTiming.forEach(dayInfo => {
				const { fromTime, toTime } = dayInfo;
				let { day } = dayInfo;
				day = day.charAt(0).toUpperCase() + day.slice(1);
				dayAndTimeInfo[day].fromTime = fromTime;
				dayAndTimeInfo[day].toTime = toTime;
			});
		}
		return dayAndTimeInfo;
	}

	render() {
		const {listingDetails} = this.props;
		const dayAndTimeInfo = this.getDayAndTimeInfo();

		return (
			<>
				<Divider orientation="left">Contact Info</Divider>
				<Row>
					<Col {...contactInfoHeadingLayout}>Contact Person:</Col>
					<Col {...contactInfoValueLayout}>
						{listingDetails.contactPerson ? listingDetails.contactPerson : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Primary Number:</Col>
					<Col {...contactInfoValueLayout}>
						{listingDetails.primaryNumber ? listingDetails.primaryNumber : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Secondary Number:</Col>
					<Col {...contactInfoValueLayout}>
						{listingDetails.secondaryNumber ? listingDetails.secondaryNumber : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Email:</Col>
					<Col {...contactInfoValueLayout}>
						{listingDetails.email ? listingDetails.email : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Website:</Col>
					<Col {...contactInfoValueLayout}>
						{listingDetails.website ? listingDetails.website : <small>NA</small>}
					</Col>
				</Row>
				<Divider orientation="left">Operates On</Divider>
				<Row>
					<Col {...contactInfoHeadingLayout}>Monday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Monday.fromTime ? dayAndTimeInfo.Monday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Monday.toTime ? dayAndTimeInfo.Monday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Tuesday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Tuesday.fromTime ? dayAndTimeInfo.Tuesday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Tuesday.toTime ? dayAndTimeInfo.Tuesday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Wednesday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Wednesday.fromTime ? dayAndTimeInfo.Wednesday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Wednesday.toTime ? dayAndTimeInfo.Wednesday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Thursday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Thursday.fromTime ? dayAndTimeInfo.Thursday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Thursday.toTime ? dayAndTimeInfo.Thursday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Friday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Friday.fromTime ? dayAndTimeInfo.Friday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Friday.toTime ? dayAndTimeInfo.Friday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Saturday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Saturday.fromTime ? dayAndTimeInfo.Saturday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Saturday.toTime ? dayAndTimeInfo.Saturday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Row>
					<Col {...contactInfoHeadingLayout}>Sunday:</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Sunday.fromTime ? dayAndTimeInfo.Sunday.fromTime : <small>NA</small>}
					</Col>
					<Col {...contactInfoFromTimeLayout}>
						{dayAndTimeInfo.Sunday.toTime ? dayAndTimeInfo.Sunday.toTime : <small>NA</small>}
					</Col>
				</Row>
				<Divider orientation="left">Social Links</Divider>
				<Row justify="space-around" type="flex">
					{Boolean(listingDetails.fbLink) === false && Boolean(listingDetails.youtubeLink) === false && Boolean(listingDetails.instaLink) === false && Boolean(listingDetails.twitterLink) === false && <small>NA</small>}
					{listingDetails.fbLink ? <a rel="noopener noreferrer" target="_blank" href={listingDetails.fbLink}><Icon style={{ fontSize: 30 }} type="facebook" /></a> : undefined}
					{listingDetails.youtubeLink ? <a rel="noopener noreferrer" target="_blank" href={listingDetails.youtubeLink}><Icon style={{ fontSize: 30 }} type="youtube" /></a> : undefined}
					{listingDetails.instaLink ? <a rel="noopener noreferrer" target="_blank" href={listingDetails.instaLink}><Icon style={{ fontSize: 30 }} type="instagram" /></a> : undefined}
					{listingDetails.twitterLink ? <a rel="noopener noreferrer" target="_blank" href={listingDetails.twitterLink}><Icon style={{ fontSize: 30 }} type="twitter" /></a> : undefined}
				</Row>
			</>
		);
	}
}

export default ContactInfoTab;

