import axios from 'axios';
import { schemeAndAuthority } from '../../config.json';

export default tuitionId => dispatch => {
	dispatch({
		payload: axios.get(`${schemeAndAuthority}/tuition/${tuitionId}/dashboard`, { withCredentials: true }),
		type: 'FETCH_ALL'
	});
};
