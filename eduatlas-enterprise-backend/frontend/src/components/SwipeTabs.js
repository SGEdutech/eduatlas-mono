import React, { Component } from 'react';

const { Tabs, WhiteSpace } = window['antd-mobile'];

export default class SwipeTabs extends Component {
	render() {
		const tabs = [
			{ title: '1st Tab' },
			{ title: '2nd Tab' },
			{ title: '3rd Tab' },
			{ title: '4th Tab' },
			{ title: '5th Tab' },
			{ title: '6th Tab' },
			{ title: '7th Tab' },
			{ title: '8th Tab' },
			{ title: '9th Tab' },
		];
		return (

			<div>
				<Tabs tabs={tabs} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}>
					{this.renderContent}
				</Tabs>
			</div>
		);
	}
}
