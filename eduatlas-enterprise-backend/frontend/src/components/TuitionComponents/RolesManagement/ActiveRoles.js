import React from 'react';
import Navbar from '../../Navbar';
import { withRouter } from 'react-router-dom';

import getRandomColor from '../../../scripts/randomColor';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';

import {
	Avatar,
	Button,
	Dropdown,
	Icon,
	List,
	Menu
} from 'antd';

const ifMobile = window.screen.width ? window.screen.width <= 320 : true;

function ActiveRoles(props) {
	const { deleteRole, roles } = props;
	const handleDelete = roleId => {
		const { url } = props.match;
		const tuitionId = getTuitionIdFromUrl(url);
		deleteRole(tuitionId, roleId);
	};
	const rolesJsx = <List
		itemLayout="horizontal"
		dataSource={roles}
		renderItem={role => (
			<List.Item actions={[
				<Dropdown trigger={['hover', 'click']} overlay={
					<Menu>
						<Menu.Item className="pb-2" key="3" onClick={() => handleDelete(role._id)}>
							<Icon type="delete" />
							Delete Role
						</Menu.Item>
					</Menu>
				}>
					<Button shape="circle" icon="caret-down"></Button>
				</Dropdown>
			]}>
				<List.Item.Meta
					avatar={<Avatar style={{ backgroundColor: getRandomColor(role.email) }}>{role.email.slice(0, 1).toUpperCase()}</Avatar>}
					title={ifMobile && role.email.length > 18 ? role.email.slice(0, 15) + '...' : role.email}
					description={<div className="text-capitalize">{ifMobile && role.type.length > 18 ? role.type.slice(0, 15) + '...' : role.type}</div>}
				/>
			</List.Item>
		)}
	/>;
	return (
		<>
			<Navbar renderBackBtn={true} navText="Roles Management" />
			<div className="container below-nav py-5">
				{rolesJsx}
			</div>
		</>
	);
}

export default withRouter(ActiveRoles);
