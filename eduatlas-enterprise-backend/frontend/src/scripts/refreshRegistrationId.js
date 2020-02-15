import axios from 'axios';
import { schemeAndAuthority, tuitionId } from '../config.json';

function refreshRegistrationId(registrationId) {
	try {
		axios.put(`${schemeAndAuthority}/notification/refresh-registration-token`, { registrationId, tuitionId }, { withCredentials: true });
	} catch (error) {
		console.error(error);
	}
}

export default refreshRegistrationId;
