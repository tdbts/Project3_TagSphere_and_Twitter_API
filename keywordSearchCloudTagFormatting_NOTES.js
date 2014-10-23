/* 
So far, I've got the search to work, and to create "little objects" 
using the response.  

However, with the keyword search cloud, a couple of things will need to 
be different.

First, because the search results will often include many tweets that 
have been tweeted on the same day, displaying the TIME the tweets occurred 
will be far more important here

Secondly, I'll also need to display the SCREEN NAME for these tweets, unlike 
the other cloud where all the tweets come from a single user.

Therefore, I'm going to need to alter the f(x) 'addTwetTags' to differentiate 
between these two types of searches, and to parse them accordingly.
*/

// This is the f(x) as it looks now
	function addTweetTags(arrayOfTweetObjects, variableToSaveTo) {

		for (i = 0; i < arrayOfTweetObjects.length; i++) {
			
			// Get the text and (modified) date information, then format them
			var tweetText = arrayOfTweetObjects[i].text;
			var tweetDate = arrayOfTweetObjects[i].date.slice(0, 10);
			var displayText = tweetText + " \n" + tweetDate;
			
			// Get URL from JSON data
			var url = arrayOfTweetObjects[i].url;

			// Create "little object" using the extracted information and push to array of objects
			var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo);
			
			variableToSaveTo.push(newTweetTagObject);
		}
	}

/* 
There are a couple of ways I can do this.

I can alter 'addTweetTags' so that it has the ablility to parse both kinds of 
search results.  

The other way to do this will be to split the f(x) into two different f(x)'s for 
the different kinds of responses.  
*/

// Let me first make a f(x) specifically tailored to the keyword search, and 
// if there's enough similarity to refactor both f(x)'s into one (I imagine 
// there will be), I will do so.

// I'll probably need a separate f(x) to parse the time and 
// convert it to the user's time zone.
// After playing around with this for a bit, I found that I can do:
var date = Date.parse('Thu Oct 23 16:35:01 +0000 2014');
console.log(date);
// => 1414082101000
var newDate = new Date(date);
console.log(newDate);
// =>  Date {Thu Oct 23 2014 12:35:01 GMT-0400 (Eastern Standard Time)}
// Then I can do this for the timeline cloud:
console.log(newDate.toString().slice(0, 10));
// => Thu Oct 23
// And this for the search cloud:
console.log(newDate.toString().slice(0, 24));
// => Thu Oct 23 2014 12:35:01
// OR, better yet:
console.log(newDate.toString().slice(0, 10) 
	+ " " + newDate.toString().slice(16, 24));
// => Thu Oct 23 12:35:01

function createDate(theGivenDate, withTime) {
	var tempDate, date;
	var ms = Date.parse(theGivenDate);

	tempDate = new Date(ms);
	date = tempDate.toString().slice(0, 10);
	
	if (withTime) {
		
		date += " " + tempDate.toString().slice(16, 24);
	}

	return date;
}

var myDate = 'Thu Oct 23 16:35:01 +0000 2014';

console.log(createDate(myDate, true));
// => Thu Oct 23 12:35:01
console.log(createDate(myDate, false));
// => Thu Oct 23



function addTweetTagsForKeywordSearch(arrayOfTweetObjects, variableToSaveTo) {

	for (var i = 0; i < arrayOfTweetObjects.length; i++) {
		
		var tweetText = arrayOfTweetObjects[i].text;
		var userName = "- @" + arrayOfTweetObjects[i].screen_name;
		var tweetDate = createDate(arrayOfTweetObjects[i].date, true);

		var displayText = tweetText + "\n" + userName + "\n" + tweetDate;

		var url = arrayOfTweetObjects[i].url; 

		var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo);
			
		variableToSaveTo.push(newTweetTagObject);

	}
}

function addTweetTags(arrayOfTweetObjects, variableToSaveTo) {

	for (i = 0; i < arrayOfTweetObjects.length; i++) {
		
		// Get the text and (modified) date information, then format them
		var tweetText = arrayOfTweetObjects[i].text;
		var tweetDate = createDate(arrayOfTweetObjects[i].date, false);
		var displayText = tweetText + " \n" + tweetDate;
		
		// Get URL from JSON data
		var url = arrayOfTweetObjects[i].url;

		// Create "little object" using the extracted information and push to array of objects
		var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo);
		
		variableToSaveTo.push(newTweetTagObject);
	}
}

function addTweetTags(arrayOfTweetObjects, variableToSaveTo, whichResults) {
	var tweetText, tweetDate, url, displayText; 

	for (var i = 0; i < arrayOfTweetObjects.length; i++) {
		
		var tweet = arrayOfTweetObjects[i];

		tweetText = tweet.text;
		url = tweet.url;

		if (whichResults === "twitter_timeline_search.php") {
			
			tweetDate = createDate(tweet.date, false);

			displayText = tweetText + " \n" + tweetDate;
		}

		if (whichResults === "twitter_keyword_search.php") {

			var userName = "- @" + tweet.screen_name;
			tweetDate = createDate(tweet.date, true);

			displayText = tweetText + "\n" + userName + "\n" + tweetDate;
		}

		var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo);

		variableToSaveTo.push(newTweetTagObject);
	}
}
// This works, but I don't like  how the time during the afternoon shows 
// values like '14:33:45'.
// Let's see what I can do to fix this.
function formatAMPM(date) {

	var hours = date.getHours();
	var minutes = date.getMinutes();
	var AMorPM = hours >= 12 ? 'pm' : 'am';
	
	hours = hours % 12;
	hours = hours ? hours : 12;
	
	minutes = minutes < 10 ? '0' + minutes : minutes;
	
	var strTime = hours + ':' + minutes + ' ' + AMorPM;
	
	return strTime;
}

function createDate(theGivenDate, withTime) {
	var tempDate, date;
	var ms = Date.parse(theGivenDate);

	tempDate = new Date(ms);
	date = tempDate.toString().slice(0, 10);
	
	if (withTime) {
		
		time = formatAMPM(tempDate);
		date += " " + time;
	}

	return date;
}

