import React, { Component } from 'react';

import PendingCard from './Pending/PendingCard';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Card,
	Col,
	Empty,
	Icon,
	Input,
	Pagination,
	Row,
	Skeleton
} from 'antd';

const colLayout = {
	xs: 24,
	sm: 12,
	md: 8,
	xl: 6,
	xxl: 6
};

const pageSize = 12;

class Pending extends Component {
	state = {
		search: '',
		currentPage: 1,
		itemsPerPage: pageSize
	};

	componentDidMount() {
		scrollToTop();
	}

	handlePaginationChange = (currentPage, itemsPerPage) => this.setState({ currentPage, itemsPerPage });

	handleSearchInpChange = e => this.setState({ search: e.target.value, currentPage: 1 });

	render() {
		const { addStudentInBatch, batches, deleteStudent, messageInfo, students } = this.props;
		const { currentPage, itemsPerPage } = this.state;

		// filter out students with batches
		let studentsToRender = students.filter(student => {
			let isBatchless = true;
			batches.forEach(batch => {
				if (batch.students.find(studentId => student._id === studentId)) isBatchless = false;
			});
			return isBatchless;
		});

		studentsToRender = studentsToRender.filter(student => {
			const { rollNumber, name, email } = student;
			const searchRegex = new RegExp(this.state.search, 'i');
			return searchRegex.test(rollNumber) || searchRegex.test(name) || searchRegex.test(email);
		});

		const studentsToRenderOnThisPage = studentsToRender.slice(itemsPerPage * (currentPage - 1), currentPage * itemsPerPage);

		const studentsJsx = studentsToRenderOnThisPage.map(({ _id, name, rollNumber, email }) => (
			<Col {...colLayout} key={_id}>
				<div className="mb-3">
					<PendingCard
						batches={batches}
						deleteStudent={deleteStudent}
						id={_id}
						name={name}
						rollNumber={rollNumber}
						email={email}
						addStudentInBatch={addStudentInBatch} />
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
					<Row className="mb-3">
						<Input allowClear addonAfter={<Icon type="search" />} onChange={this.handleSearchInpChange} placeholder="Search Students" />
					</Row>
					<Row gutter={16}>
						{messageInfo.fetching ? skeletonCards : (studentsToRenderOnThisPage.length === 0 ? emptyJsx : studentsJsx)}
					</Row>
					<Pagination className="mb-3" current={currentPage} hideOnSinglePage={true} onChange={this.handlePaginationChange} pageSize={pageSize} total={studentsToRender.length} />
				</div>
			</>
		);
	}
}

export default Pending;
