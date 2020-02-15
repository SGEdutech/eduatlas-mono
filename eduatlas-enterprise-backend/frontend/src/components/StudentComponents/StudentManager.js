import React from 'react';

import StudentNavbar from '../StudentNavbar';
import PrimaryStudentTabs from './PrimaryStudentTabs';

export default function StudentManager() {
	return (
		<div className="below-nav-and-tab">
			<StudentNavbar />
			<PrimaryStudentTabs />
		</div>
	);
}

