export function titleCase(str) {
	const splitStr = str.toLowerCase().split(' ');
	splitStr.forEach((word, index) => splitStr[index] = splitStr[index].charAt(0).toUpperCase() + splitStr[index].substring(1));
	return splitStr.join(' ');
}
