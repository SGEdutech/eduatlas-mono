import dateToMoment from './dateToMoment';

export default obj => {
	obj = JSON.parse(JSON.stringify(obj));
	dateToMoment(obj);
	return obj;
};
