// Have to document this (and all of my code) much more thoroughly so after
// prolonged periods away from this project I can easily remember 
// how everything works

// Arrays that will hold the tags used to generate the cloud
// They are outside of any f(x)'s so that they can be accessed by 
// Other f(x)'s and code in other files -- I know there is a better 
// way to do this

var twitterCloudTags = [];

// As part of its input, the Clouder class accepts an array of 
// "little objects" of the form: {text: theText, id: theID, weight: theWeight}
// This f(x) creates a single "little object" for the cloud
function createObjectForCloud(theText, theURL, cloudTags) {
	var theID;

	// Generates an ID for the new object based upon the number of tags already 
	// in the tag array.  The first ten tags take the numbers (as strings) 0-9, 
	// the next ten 00, 01, 02...09, the next ten 000, 001, 002...009, and so on. 
	function createID(arr) {
		var tagLength = arr.length;
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
		// Invoke the 'output' f(x)
		return output(myFirstDigit, myNumberOfZeroes);
	}
	// Invoke 'createID' using array of cloud tags
	theID = createID(cloudTags);

	// Hardcoded weight value...may want to change this
	return {text: theText, id: theID, weight: 0.1, url: theURL};
}

