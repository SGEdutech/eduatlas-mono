import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';

import ytLogo from '../../../../youtube-logo.svg';

import {
	Card,
	Icon,
	Modal,
	Row
} from 'antd';
const { Meta } = Card;
const { confirm } = Modal;

class VideoCard extends Component {
	state = {
		thumbnail: null,
		title: null,
		description: null
	}

	showDeleteConfirm = resourceId => {
		const { deleteResource, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteResource(tuitionId, resourceId);
			}
		});
	};

	handleDeleteBtnClick = () => {
		const { _id } = this.props;
		this.showDeleteConfirm(_id);
	}

	fetchAndUpdateYtInfo = async vidUrl => {
		const ytUrlRegex = new RegExp('^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$', 'i');
		const urlBreakdown = ytUrlRegex.exec(vidUrl);
		// Handle this case
		if (Boolean(urlBreakdown) === false) return;
		const vidId = urlBreakdown[5];
		const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=AIzaSyBK6bjBeIAUDJCrbAjSOGKSz4fOU2I6gBI`);
		if (response.data.items.length === 0) {
			// No Video
		}
		const vidData = response.data.items[0].snippet;
		this.setState({
			thumbnail: vidData.thumbnails.high.url,
			title: vidData.title,
			description: vidData.description
		});
	};

	componentDidMount() {
		const { ytUrl } = this.props;
		this.fetchAndUpdateYtInfo(ytUrl);
	}

	render() {
		const { ytUrl, showDelete, students } = this.props;
		const { description, thumbnail, title } = this.state;

		let actionsJsx = [<a href={ytUrl} target="_blank" rel="noopener noreferrer"><Icon type="eye" /></a>, <Icon type="delete" onClick={this.handleDeleteBtnClick} />];
		if (showDelete === false) actionsJsx = [<a href={ytUrl} target="_blank" rel="noopener noreferrer"><Icon type="eye" /></a>];

		return (
			<Card
				loading={Boolean(title) === false}
				className="mb-3"
				actions={actionsJsx}
				cover={<img style={{ height: 216 }} alt="Thumbnail" src={thumbnail || ytLogo} />}>
				<Meta
					title={title}
					description={
						<>
							<Row className="one-line-ellipsis">
								{description}
							</Row>
							<Row>
								<span className="font-weight-bold">Shared With: </span>{students.length} Students
							</Row>
						</>
					} />
			</Card>
		);
	}
}

export default withRouter(VideoCard);
