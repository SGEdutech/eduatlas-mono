import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';

import { getFloatingBtnCss } from '../../../scripts/sharedCss';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop';

import BatchCard from './Batch/BatchCard';

import {
	Card,
	Col,
	Empty,
	Icon,
	Modal,
	Row,
	Skeleton
} from 'antd';

const confirm = Modal.confirm;

const colLayout = {
	xs: 24,
	sm: 12,
	md: 8,
	xl: 6,
	xxl: 6
};

class Batch extends Component {
	componentDidMount() {
		scrollToTop();
	}
	showDeleteConfirm = (courseId, batchId) => {
		const { deleteBatch, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteBatch(tuitionId, courseId, batchId);
			}
		});
	};

	render() {
		const { batchesInfo, messageInfo } = this.props;
		const batchesJsx = batchesInfo.batches.map(({ _id, code, description, students, courseId, courseCode }) => (
			<Col {...colLayout} key={_id}>
				<div className="mb-3">
					<BatchCard
						id={_id}
						code={code}
						courseId={courseId}
						courseCode={courseCode}
						description={description}
						numberOfStudents={students.length}
						deleteBatch={this.showDeleteConfirm} />
				</div>
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
						<Skeleton loading={true} active></Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<>
				<div className="container py-5">
					<Row gutter={16}>
						{messageInfo.fetching ? skeletonCards : (batchesInfo.batches.length === 0 ? emptyJsx : batchesJsx)}
					</Row>
				</div>
				<Link to="./add-batch">
					<Icon type="plus-circle" theme="filled" style={getFloatingBtnCss()} />
				</Link>
			</>
		);
	}
}

export default withRouter(Batch);
