function filter(students, searchKeyWord) {
	return students.filter(student => {
		const { rollNumber, name, email } = student;
		const searchRegex = new RegExp(searchKeyWord, 'i');
		return searchRegex.test(rollNumber) || searchRegex.test(name) || searchRegex.test(email);
	});
}

export default filter;
