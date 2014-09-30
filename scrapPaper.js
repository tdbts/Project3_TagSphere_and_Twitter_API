// To initialize the Tag Shpere, you need to feed it some "little objects" -- 
// Here, I am going to create a f(x) which allows me to quickly make an array 
// of these little objects 
function createLittleObjects(theText, theID, theWeight) {
	var littleObjects = [];

	// Param checking
	if (Array.isArray(theText) === Array.isArray(theID) === Array.isArray(theWeight)) {
		if (theText.length === theID.length === theWeight.length) {
			// PLACEHOLDER
			console.log("Yes, the arguments are arrays, and are of the same length!");
			// processArrays();
		}
		else console.log("Arrays must be of the same length!");
	}
	else 
		if (typeof theText === typeof theID === 'string') {
			if (typeof theWeight === 'number') {
				// PLACEHOLDER
				console.log("Yes, all of the params are of the correct type!");
				// processParams();
			}
			else console.log("The 'weight' parameter must be a number!");
		}
		else console.log("Both the 'text' and 'ID' params must be strings!");
}

// TESTS
// Correct params
console.log("Correct params return: " + createLittleObjects(["shit", "piss"], ["100", "200"], [0.1, 0.1]));
// Text is not an array 
console.log("When text is not an array I get: " + createLittleObjects("fuck", ["100", "200"], [0.1, 0.1]));


// Hmm, there's a shit ton of type-checking that it looks like I'll need to do
// Let me back up a bit and try to refactor this process into something a 
// little more elegant.
function typeCheck(type, givenValue) {

}

// 'checkNumber' differentiates between unusable values of 
// Infinity and NaN from usuable numbers
function checkNumber(givenNumber) {
	// Problem with this f(x) as is because you must preclude 
	// 'string', 'boolean', 'function', 'undefined' first!
	if (preclude(["string", "boolean", "function", "undefined"], givenNumber)) {

		var numberString = givenNumber.toString();
		
		var answer = numberString === 'Infinity' ? 'Infinity' : 
		    			numberString === "NaN" ? 'NaN' : 'number';

		return answer;
	}
	else return "'checkNumber' received an unwanted type!"
}
console.log(checkNumber(true));
// => 'checkNumber' received an unwanted type!
console.log(checkNumber(24));
// => 'number'
console.log(checkNumber(Infinity));
// => 'Infinity'
console.log(checkNumber(NaN));
// => 'NaN'

// 'checkObject' differentiates unusuable objects from usable arrays
function checkObject(givenObject) {
	// Problem with this f(x) as is because you must preclude 
	// 'number', 'string', 'boolean', 'function', 'undefined' first!
	if (preclude(["number", "string", "boolean", "function", "undefined"], givenObject)) {
		
		var answer = givenObject === null ? 'null' : 
			Array.isArray(givenObject) ? 'array' : 'object';
		return answer;
	}
	else return "'checkObject' received an unwanted type!";
}

function preclude(arrayOfUnwanted, givenParam) {
	// This is to preclude certain types of values from going into my 
	// checkNumber and checkObject f(x)'s.  Because those f(x)'s take 
	// care of differentiating between distinct value types which skirt 
	// past the 'typeof' test, I merely have to implement that test here.
	var givenType = typeof givenParam;

	var answer = arrayOfUnwanted.every(function(x) {
		return x !== givenType;
	});

	return answer;
}
console.log(checkObject(28));
// => 'checkObject' received an unwanted type!
console.log(checkObject([24, 52]));
// => 'array'
console.log(checkObject({bitch: "titties"}));
// => 'object'


function createLittleObjects(theText, theID, theWeight) {
	if (typeof theText === 'object' && typeof theID === 'object' && typeof theWeight === 'object') {
		// Code goes here...
		console.log("Yes, we have three 'objects'!");
	}
	else if (typeof theText !== 'object' && typeof theID !== 'object' && typeof theWeight !== 'object') {
		// Code goes here...
		console.log("Yes, we have three non-'objects'");
	}
	else return "Cannot have params of different types!"
}
// Three "objects"
console.log(createLittleObjects([24, 242], [423, 6342], [2352, 6236]));
// Three non-"objects"
console.log(createLittleObjects("shit", 422, 2462));
// Mixed types
console.log(createLittleObjects([32, 532], "shit", 52));


/* Below: Failed attempt at making all of the 'typeof' tests more eloquent */
// function createLittleObjects(theText, theID, theWeight) {
// 	var truthArray = [];

// 	for (var i = 0; i < arguments.length; i++) {
// 		(function() {
// 			if (arguments[i] === 'object') {
// 				truthArray.push(true);
// 			}
// 			if (arguments[i] !== 'object') {
// 				truthArray.push(false);
// 			}
// 		}());
// 	};
// 	console.log(truthArray);

// 	if (truthArray.every(function(x) {
// 		x === true;
// 	})) {
// 		console.log("Yes, we have three 'objects'!");
// 	}
// 	if (truthArray.every(function(x) {
// 		x === false;
// 	})) {
// 		console.log("We have three non-'objects'!");
// 	}
// 	else return "Cannot have params of different types!";
// }


// function createLittleObjects(theText, theID, theWeight) {
// 	var args = Array.prototype.slice.call(arguments);

// 	if (args.every(function(x) {
// 		return x === 'object';
// 	})) {
// 		// Code goes here...
// 		console.log("Yes, we have three 'objects'!");
// 	}
// 	else if (args.every(function(x) {
// 		return x !== 'object';
// 	})) {
// 		// Code goes here...
// 		console.log("Yes, we have three non-'objects'");
// 	}
// 	else return "Cannot have params of different types!";
// }


// The problem I'm having at this point is that the code is 
// looking too spaghetti-like, with so many ifs, fors...
function createLittleObjects(theText, theID, theWeight) {
	var argsLength = arguments.length;
	var valueArray = [];
  
  	for (i = 0; i < arguments.length; i++) {
    	valueArray.push(arguments[i]);
  };

	if (typeof theText === 'object' && typeof theID === 'object' && typeof theWeight === 'object') {
		for (var i = 0; i < arguments.length; i++) {
			console.log(checkObject(arguments[i]));
		};
		console.log("Yes, we have three 'objects'!");
	}
	else if (typeof theText !== 'object' && typeof theID !== 'object' && typeof theWeight !== 'object') {
		// Code goes here...
		console.log("Yes, we have three non-'objects'");
	}
	else return "Cannot have params of different types!"
}


function test(theTest, theArgs) {
	return theArgs.every(function() {
		theTest(x);
	});
}

function testForObject(e) {
	return typeof e === 'object' ? true : false;
}

function testForArray(e) {
	return checkObject(e) === 'array' ? true : false;
}

function storeArrayLengths(arrs) {
	arrayLenghts = [];
	for (var i = 0; i < arrs.length; i++) {
		arrayLenghts.push(arrs[i].length);
	};
	return arrayLenghts;
}

function testEqualityToAdjacent(index, array) {
	return array[index] === array[index + 1];
}

function testElementsForSameValue(e) {
	var testArray = [];
	for (var i = 0; i < e.length; i++) {
		testArray.push(e[i]);

	for (var j = 0; j < testArray.length - 1; j++) {
		testArray.every(testEqualityToAdjacent(j))
	}
	};
}

// function testForArrayElementTypes(arr, type) {
// 	var answer = arr.every(function(x) {
// 		typeof x === type;
// 	});
// 	return answer;
// }

function testForNumbers(e) {
  return typeof e === 'number' ? true : false;
}

function testForStrings(e) {
  return typeof e === 'string' ? true : false;
}

function testEachElement(array, test) {
	var results = [];
	for (var i = 0; i < array.length; i++) {
		results.push(test(array[i]));
	};
	return testElementsForSameValue(results);
}

function areElementsEqual(arr) {
  var min = arr.reduce(function(x, y) {
    return x < y ? x : y;
  });
  
  var max = arr.reduce(function(x, y) {
    return x > y ? x : y;
  });
  
  return min === max;
}

function isNumberBetween(number, lowerLimit, upperLimit) {
	return lowerLimit <= number && number <= upperLimit;
}


function createLittleObjects(theText, theID, theWeight) {
	var argsLength = arguments.length;
  	console.log("Number of arguments passed to cLO: ");
  	console.log(argsLength);
	
	var valueArray = [];
	for (var i = 0; i < argsLength; i++) {
		valueArray.push(arguments[i]);
	};
  	console.log("valueArray: ")
  	console.log(valueArray);

	// Test whether 'typeof' returns 'object'
	var objectTest = valueArray.every(testForObject);
	if (objectTest) {
		
		// Test whether array test returns 'array'
		var arrayTest = valueArray.every(testForArray);
		if (arrayTest) {
			
			// Store the length of each of the arrays
			var arrayOfLengths = storeArrayLengths(valueArray);
			console.log("arrayOfLengths: ");
			console.log(arrayOfLengths);

			// Test whether the lenghts of the arrays are equal
			var arrayLengthTest = testElementsForSameValue(arrayOfLengths);
			if (arrayLengthTest) {
				
				//console.log("Object test, array test, and length test passed!");
				testFirstArray = testEachElement(arguments[0], testForStrings);
				testSecondArray = testEachElement(arguments[1], testForStrings);
				testThirdArray = testEachElement(arguments[2], testForStrings);
				if (testForArray && testSecondArray && testThirdArray) {

					console.log("Object, array, length and type test passed!");
				}
				else console.log("Object, array, length tests passed, but type test failed!");
			}
			else console.log("Object test and array test passed, but length test failed!");
		}
		else console.log("Object test passed but array test failed!");
	}
	else console.log("Object test failed!");	
}

// TESTS:
// For object test
console.log("*****FAIL OBJECT TEST: *****");
console.log(createLittleObjects(25, 23, 52));
// For array test
console.log("*****FAIL ARRAY TEST: *****");
console.log(createLittleObjects({shit: "piss"}, {fuck: "cunt"}));
// For array length test
console.log("*****FAIL ARRAY LENGTH TEST: *****");
console.log(createLittleObjects([532, 532], [532, 6423, 634]));
// For the win
console.log("*****FAIL TYPE TEST: *****");
console.log(createLittleObjects([532, 532], [52, 52], [532, 532]));
// For the type test
console.log("*****PASS OBJECT, ARRAY, LENGTH AND TYPE TESTS: *****");
console.log(createLittleObjects(["shit", "piss"], ["100", "200"], [0.1, 0.1]));

// TESTS:
// For object test
console.log(createLittleObjects(25, 23, 52));
// For array test
console.log(createLittleObjects({shit: "piss"}, {fuck: "cunt"}));
// For array length test
console.log(createLittleObjects([532, 532], [532, 6423, 634]));
// For the win
console.log(createLittleObjects([532, 532], [52, 52]));
// For the type test
console.log(createLittleObjects(["shit", "piss"], ["100", "200"], [0.1, 0.1]));



/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* ***************************************************************************************** */
/* Since it has been a few days since I've worked on this project, I'm going to rebuild 
what I have so far, both to refresh my understanding, as well as to try and incorporate 
some of the new things I've learned into the project. */

function createLittleObjects(theText, theID, theWeight) {
	var argsLength = arguments.length;
	console.log("Number of arguments passed to cLO:");
	console.log(argsLength);

	var valueArray = [];
	for (var i = 0; i < argsLength; i++) {
			valueArray.push(arguments[i]);
		};
		console.log("valueArray: ");
		console.log(valueArray);

	// Test whether 'typeof' returns object for every
	var objectTest = valueArray.every(testForObject);
	if (objectTest) {

		// Test whether array test returns 'array'
		var arrayTest = valueArray.every(testForArray);
		if (arrayTest) {

			// Store the length of each array in a new array
			var arrayOfLengths = storeArrayLengths(valueArray);
			console.log("arrayOfLengths: ");
			console.log(arrayOfLengths);

			// Test whether the lengths of the arrays are equal
			var arrayLengthTest = areElementsEqual(arrayOfLengths);
			if (arrayLengthTest) {

				//console.log("Object, array and length test passed!");
				// Test whether all of the elements in each of the 
				// three arrays are of the right types
				var testFirstArray = valueArray[0].every(testForStrings);
				var testSecondArray = valueArray[1].every(testForStrings);
				var testThirdArray = valueArray[2].every(testForNumbers);
				if (testFirstArray && testSecondArray && testThirdArray) {

					console.log("Object, array, length and type tests passed!");
				}
				else console.log("Object, array, and length tests passed, but type test failed!");
			}
			else console.log("Object, array tests passed, but length test failed!");
		}
		else console.log("Object test passed but array test failed!");
	}
	// else console.log("Object test failed!");
	else {
		var testFirstArgument = testForStrings(valueArray[0]);
		var testSecondArgument = testForStrings(valueArray[1]);
		var testThirdArgument = testForNumbers(valueArray[2]);
		if (testFirstArgument && testSecondArgument && testThirdArgument) {

			//console.log("Type test for these arguments passed!");
			var testNumber = isNumberBetween(valueArray[2], 0, 1);
			if (testNumber) {

				console.log("Type test and number test passed!");
			}
			else console.log("Type test passed, but number test failed!");
		}
		else console.log("Invalid arguments!");
	}
}

// TESTS:
// For object test
console.log("*****FAIL OBJECT TEST: *****");
console.log(createLittleObjects(25, 23, 52));
// For array test
console.log("*****FAIL ARRAY TEST: *****");
console.log(createLittleObjects({shit: "piss"}, {fuck: "cunt"}));
// For array length test
console.log("*****FAIL ARRAY LENGTH TEST: *****");
console.log(createLittleObjects([532, 532], [532, 6423, 634]));
// For type test
console.log("*****FAIL TYPE TEST: *****");
console.log(createLittleObjects([532, 532], [52, 52], [532, 532]));
console.log("*****PASS TYPE TEST: *****");
console.log(createLittleObjects(["shit", "piss"], ["fuck", "cunt"], [0.1, 0.1]));

// For non-array type test
console.log("*****FAIL TYPE TEST: *****");
console.log(createLittleObjects("shithead", 100, 0.1));
console.log("*****PASS TYPE TEST: *****");
console.log(createLittleObjects("fuck", "200", 0.2));
// For non-array number test
console.log("*****FAIL NUMBER TEST: *****");
console.log(createLittleObjects("bitch", "ass", 3));
console.log("*****PASS NUMBER TEST: *****");
console.log(createLittleObjects("stupid", "lil", 0.7));

/* ***************************************************************************************** */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

// Now that I have the checks working, I've put the entire checking process into a f(x) called
// 'checkArguments', and then I invoke that f(x) with 'valueArray' passed to it
// Let's continue from here
function createLittleObjects(theText, theID, theWeight) {
	var argsLength = arguments.length;
	console.log("Number of arguments passed to cLO:");
	console.log(argsLength);

	var valueArray = [];
	for (var i = 0; i < argsLength; i++) {
			valueArray.push(arguments[i]);
		};
		console.log("valueArray: ");
		console.log(valueArray);

	function checkArguments(theArguments) {
		var objectTest = theArguments.every(testForObject);
		if (objectTest) {

			// Test whether array test returns 'array'
			var arrayTest = theArguments.every(testForArray);
			if (arrayTest) {

				// Store the length of each array in a new array
				var arrayOfLengths = storeArrayLengths(theArguments);
				console.log("arrayOfLengths: ");
				console.log(arrayOfLengths);

				// Test whether the lengths of the arrays are equal
				var arrayLengthTest = areElementsEqual(arrayOfLengths);
				if (arrayLengthTest) {

					//console.log("Object, array and length test passed!");
					// Test whether all of the elements in each of the 
					// three arrays are of the right types
					var testFirstArray = theArguments[0].every(testForStrings);
					var testSecondArray = theArguments[1].every(testForStrings);
					var testThirdArray = theArguments[2].every(testForNumbers);
					if (testFirstArray && testSecondArray && testThirdArray) {

						console.log("Object, array, length and type tests passed!");
					}
					else console.log("Object, array, and length tests passed, but type test failed!");
				}
				else console.log("Object, array tests passed, but length test failed!");
			}
			else console.log("Object test passed but array test failed!");
		}
		else {
			var testFirstArgument = testForStrings(theArguments[0]);
			var testSecondArgument = testForStrings(theArguments[1]);
			var testThirdArgument = testForNumbers(theArguments[2]);
			if (testFirstArgument && testSecondArgument && testThirdArgument) {

				//console.log("Type test for these arguments passed!");
				var testNumber = isNumberBetween(theArguments[2], 0, 1);
				if (testNumber) {

					console.log("Type test and number test passed!");
				}
				else console.log("Type test passed, but number test failed!");
			}
			else console.log("Invalid arguments!");
		}
	}
	var check = checkArguments(valueArray);
}


// TESTS:
// For object test
console.log("*****FAIL OBJECT TEST: *****");
console.log(createLittleObjects(25, 23, 52));
// For array test
console.log("*****FAIL ARRAY TEST: *****");
console.log(createLittleObjects({shit: "piss"}, {fuck: "cunt"}));
// For array length test
console.log("*****FAIL ARRAY LENGTH TEST: *****");
console.log(createLittleObjects([532, 532], [532, 6423, 634]));
// For type test
console.log("*****FAIL TYPE TEST: *****");
console.log(createLittleObjects([532, 532], [52, 52], [532, 532]));
console.log("*****PASS TYPE TEST: *****");
console.log(createLittleObjects(["shit", "piss"], ["fuck", "cunt"], [0.1, 0.1]));

// For non-array type test
console.log("*****FAIL TYPE TEST: *****");
console.log(createLittleObjects("shithead", 100, 0.1));
console.log("*****PASS TYPE TEST: *****");
console.log(createLittleObjects("fuck", "200", 0.2));
// For non-array number test
console.log("*****FAIL NUMBER TEST: *****");
console.log(createLittleObjects("bitch", "ass", 3));
console.log("*****PASS NUMBER TEST: *****");
console.log(createLittleObjects("stupid", "lil", 0.7));