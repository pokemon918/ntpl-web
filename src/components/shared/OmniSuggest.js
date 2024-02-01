export default class OmniSuggest {
	constructor(data) {
		this.data = data || [];
		this.inputData = '';
	}

	input(value) {
		this.inputData = value;
		const queryList = value.split(' ');
		const query = queryList[queryList.length - 1];

		return value ? this.data.filter((word) => word.startsWith(query)) : [];
	}

	suggest() {
		let resultArray = [];
		this.data.forEach((word) => {
			if (word.includes(this.inputData)) {
				resultArray.push({val: word});
			}
		});
		return resultArray;
	}
}
