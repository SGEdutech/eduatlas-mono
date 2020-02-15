export default text => {
	if (!navigator.clipboard) {
		throw new Error('Old Browser');
	}
	return navigator.clipboard.writeText(text);
};