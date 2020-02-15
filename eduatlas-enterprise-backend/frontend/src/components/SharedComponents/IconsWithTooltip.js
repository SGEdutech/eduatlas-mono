import React from 'react';

import { Icon, Tooltip } from 'antd';

// FIXME: Functions declairing all the time
function IconsWithTooltip(props) {
	const { iconType, tooltipMessage, onClick } = props;

	return (
		<Tooltip placement="bottom" title={tooltipMessage}>
			<Icon style={{ fontSize: '1.3rem' }} onClick={onClick} type={iconType} />
		</Tooltip>
	);
}

export default IconsWithTooltip;
