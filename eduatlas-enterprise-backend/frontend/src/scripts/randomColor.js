export default function getRandomColor(uniqueId = 'hello') {
	const colorList = ['#e6615a', '#ffe51d', '#00afef', '#00a859', 'grey'];
	const randomNumber = _getRandomInt(0, colorList.length - 1, uniqueId);
	return colorList[randomNumber];
}

function _getRandomInt(min, max, uniqueId) {
	const charArr = uniqueId.split('');
	const sumOfAsciiCodes = charArr.reduce((acc, char) => {
		return acc += char.charCodeAt(0) ? char.charCodeAt(0) : 0;
	}, 0);

	const numberBetween0n9 = _getSumOfAllDigits(sumOfAsciiCodes);
	const sumOfAllDigits = numberBetween0n9 > (max - min + 1) ? numberBetween0n9 % (max - min + 1): numberBetween0n9;
	return sumOfAllDigits;
}

function _getSumOfAllDigits(number) {
	let sumOfAllDigits = 0;
	while (number) {
		sumOfAllDigits += number % 10;
		number = Math.floor(number / 10);
	}
	return sumOfAllDigits >= 10 ? _getSumOfAllDigits(sumOfAllDigits) : sumOfAllDigits;
}