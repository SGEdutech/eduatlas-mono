import moment from 'moment';

function isMoment(data) {
	return typeof data === 'object' && data._isAMomentObject;
}

function momentToDate(data) {
	if (typeof data !== 'object') return;
	if (Array.isArray(data)) {
		data.forEach((element, index) => {
			if (isMoment(element)) {
				data[index] = element.toDate();
			} else {
				momentToDate(element);
			}
		});
		return;
	}
	// Data is an object
	if (isMoment(data)) throw new Error('Moment can\'t be top level data');
	const keys = Object.keys(data);
	keys.forEach(key => {
		if (isMoment(data[key])) {
			data[key] = data[key].toDate();
		} else {
			momentToDate(data[key]);
		}
	});
	return;
}

export default momentToDate;
