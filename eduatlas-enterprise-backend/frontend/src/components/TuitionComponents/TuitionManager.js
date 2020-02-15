import React from 'react';

import Navbar from '../Navbar';
import PrimaryTuitionTabs from './PrimaryTuitionTabs';

function TuitionManager() {
	return (
		<div className="below-nav">
			<Navbar />
			<PrimaryTuitionTabs />
		</div>
	);
}

export default TuitionManager;
