var userCloudTags = [];

function createObjectForCloud(theText, cloudTags) {
	var theID;

	function createID() {
		var tagLength = cloudTags.length;
		var subtractor = 0;

		// Starting from zero, subtract from the number of elements in the 
		// array, until the result is evenly divisible by 10
		while ((tagLength - subtractor)%10 > 0) {
			subtractor++;
		}

		// The first digit of the tag is equal to the amount you had to 
		// subtract to get a number evenly divisible by 10
		var myFirstDigit = subtractor;
		// The number of zeroes is equal to the amount of times 10 goes 
		// into tagLength minus the subtractor
		var myNumberOfZeroes = (tagLength - subtractor)/10;

		function output(firstDigit, numberOfZeroes) {
			var zeroes = "";

			if (numberOfZeroes === 0) {
				return firstDigit.toString();
			}
			else {
				while (numberOfZeroes !== 0) {
					zeroes += "0";
					numberOfZeroes--;
				}
				return firstDigit.toString() + zeroes;
			}
		}
		return output(myFirstDigit, myNumberOfZeroes);
	}

	theID = createID();

	return {text: theText, id: theID, weight: 0.1};
}

