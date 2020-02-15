export default obj => {
	const keys = Object.keys(obj);
	keys.forEach(key => {
		const value = obj[key];
		if (value !== 0 && Boolean(value) === false) delete obj[key];
	});
};
