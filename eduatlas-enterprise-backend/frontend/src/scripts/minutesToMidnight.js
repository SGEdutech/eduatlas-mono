import moment from 'moment';

export function inverseMinutesFromMidnight(minutesFromMidnight) {
	const dt = new Date(0, 0, 0);
	const time = new Date(dt.getTime() + minutesFromMidnight * 60000);
	return moment(time);
}

export function minutesFromMidnight(time) {
	if (time === undefined) throw new Error('Time not provided');
	if (typeof time === 'object' && time._isAMomentObject) time = time.toDate();
	if (time instanceof Date === false) throw new Error('Time should be an instance of date');
	return (time.getHours() * 60) + time.getMinutes();
}
