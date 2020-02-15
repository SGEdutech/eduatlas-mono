import React, { Component } from 'react';
import { Link } from 'react-router-relative-link';

import FileCard from './ViewOrDeleteMaterials/FileCard';
import VideoCard from './ViewOrDeleteMaterials/VideoCard';

import { getFloatingBtnCss } from '../../../scripts/sharedCss';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Card,
	Col,
	Empty,
	Icon,
	Row,
	Select,
	Skeleton
} from 'antd';

const colLayout = {
	xs: 24,
	md: 8
};

class ViewOrDeleteMaterials extends Component {
	state = {
		videoResources: [],
		vidDatas: [],
		filterResourceType: []
	};

	componentDidMount() {
		scrollToTop();
	}

	handleSelectChange = updatedFilterVal => {
		this.setState({ filterResourceType: updatedFilterVal });
	}

	render() {
		let { resources } = this.props;
		const { showFreeOnly } = this.props;
		const { deleteResource, messageInfo, showDelete } = this.props;
		const { filterResourceType } = this.state;

		if (showFreeOnly) {
			resources = resources.filter(resource => resource.type === 'free');
		}

		// filter out resources based on filter values
		if (filterResourceType.length !== 0) {
			resources = resources.filter(resource => {
				let isIncluded = false;
				filterResourceType.forEach(acceptedType => {
					if (acceptedType === resource.type) isIncluded = true;
				});
				if (isIncluded) return resource;
				return false;
			});
		}
		const resourcesJsx = resources.map(({ _id, path, title, students, description, type, ytUrl }) => {
			if (type !== 'video') return (
				<Col {...colLayout} key={_id}>
					<FileCard deleteResource={deleteResource} description={description} _id={_id} path={path} showDelete={showDelete}
						students={students} title={title} type={type} ytUrl={ytUrl} />
				</Col>
			);
			return false;
		});
		const videoResources = resources.filter(resource => resource.type === 'video');
		const videoResourcesJsx = videoResources.map(({ _id, path, title, students, description, type, ytUrl }) => (
			<Col {...colLayout} key={_id}>
				<VideoCard deleteResource={deleteResource} description={description} _id={_id} path={path} showDelete={showDelete}
					students={students} title={title} type={type} ytUrl={ytUrl} />
			</Col>
		));

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col {...colLayout} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active>
						</Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<div className="container py-5">
				<Row className="mb-3" type="flex" align="middle" justify="center">
					<Col span={24} className="p-1">
						<Select
							onChange={this.handleSelectChange}
							className="w-100"
							mode="multiple"
							allowClear
							placeholder="Filter Study Materials">
							{!showFreeOnly && <Select.Option className="text-uppercase" value="reference material">Reference Material</Select.Option>}
							{!showFreeOnly && <Select.Option className="text-uppercase" value="homework">Homework</Select.Option>}
							{!showFreeOnly && <Select.Option className="text-uppercase" value="test">Assignment/Test</Select.Option>}
							{!showFreeOnly && <Select.Option className="text-uppercase" value="video">Video</Select.Option>}
							<Select.Option className="text-uppercase" value="free">Free</Select.Option>
						</Select>
					</Col>
				</Row>
				<Row gutter={16}>
					{messageInfo.fetching ? skeletonCards : (resources.length === 0 ? emptyJsx : resourcesJsx)}
				</Row>
				<Row gutter={16}>
					{messageInfo.fetching ? skeletonCards : videoResourcesJsx}
				</Row>
				{this.props.showDelete && <Link to="./add-resource">
					<Icon type="plus-circle" theme="filled" style={getFloatingBtnCss()} />
				</Link>}
			</div>
		);
	}
}

export default ViewOrDeleteMaterials;

