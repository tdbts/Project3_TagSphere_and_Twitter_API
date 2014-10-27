/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
/* ***************************************************************************************** */

/* 
TEMPLATE - 

status: 
module: 
function: 
implementation: 

*/

/* ***************************************************************************************** */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */


// status: BROKEN 
// module: domModule
// function:
makeEnterKeyDoSomething: function(selector, func) {
				
	$(selector).keydown(function(e) {
		
		if (e.keyCode === 13) {

			func();
		}
	});
} 
// implementation: 
	// domModule.activateSearchField()
/* 
	this.makeEnterKeyDoSomething(inputID, function() {
		func();
	});
*/

// status: BROKEN 
// module: domModule 
// function:
activateSearchField: function(buttonID, inputID, func) {
	
	$(buttonID).on('click', function() {
		func();
	});

	this.makeEnterKeyDoSomething(inputID, function() {
		func();
	});
} 
// implementation: outer scope
	domModule.activateSearchField('#createTwitterFeedCloud', '#twitterHandle', searchModule.executeTwitterAccountSearch);
	domModule.activateSearchField('#createTweetSearchCloud', '#search_term', searchModule.executeTwitterTermSearch);

// status: BROKEN
// module: cloudModule 
// function:
urlConfirmAssignment: function(theText, theURL) {
				
	var question = confirm(theText + 
		"\n\n Are you sure you want to navigate to the link contained in the highlighted tweet?");

	if (question) {
		window.open(theURL);
	} else return;
} 
// implementation: cloudModule.urlCallback
/* 
	if (theTweet.url) {

		this.urlConfirmAssignment(theTweet.text, theTweet.url);

	}
 */ 


// status: BROKEN 
// module: cloudModule 
// function:
activateTenMoreTweetsButton: function() {
				
	$('#getTenPreviousTweets').on('click', function() {
		
		this.getTenMoreTweets();
	});
} 
// implementation: outer scope
cloudModule.activateTenMoreTweetsButton(); 

// status: [works] for timeline / BROKEN for keyword 
// module: tagModule 
// function:
addTweetTags: function(arrayOfTweetObjects, variableToSaveTo, whichResults) {
	
	var tweetText, tweetDate, url, displayText;

	for (var i = 0; i < arrayOfTweetObjects.length; i++) {
		
		var tweet = arrayOfTweetObjects[i];

		tweetText = tweet.text;
		url = tweet.url;

		if (whichResults === "twitter_timeline_search.php") {

			tweetDate = this.createDate(tweet.date, false);

			displayText = tweetText + " \n" + tweetDate;
		}

		if (whichResults === "twitter_keyword_search.php") {

			var userName = "- @" + tweet.screen_name;
			tweetDate = this.createDate(tweet.date, true);

			displayText = "\n" + tweetText + "\n" + userName + "\n" + tweetDate;
		}

		var newTweetTagObject = this.createObjectForCloud(displayText, url, variableToSaveTo);
		console.log(newTweetTagObject);

		variableToSaveTo.push(newTweetTagObject);
	}
} 
// implementation: searchModule.search
tagModule.addTweetTags(parsedData, twitterCloudTags, searchURL); 

// status: [works] for tweets w/o urls / BROKEN for tweets with urls 
// module: cloudModule 
// function: 
urlCallback: function(id) {
	
	if (twitterCloudTags.length !== 0) {
		for (var i = 0; i < twitterCloudTags.length; i++) {
			
			var theTweet = twitterCloudTags[i];

			if (theTweet.id === id) {
				if (theTweet.url) {

					this.urlConfirmAssignment(theTweet.text, theTweet.url);

				} else {
					alert(theTweet.text);
				}
			}
		}
	}
}
// implementation: cloudModule.init
window.clouder = new Clouder({
	container: clouder,
	tags: variableContainingTags,
	nonSense: 0.3,
	callback: this.urlCallback
}); 

// status: ~~~ not sure ~~~ 
// module: domModule
// function:
hideAllButOne: function(theClass, theID) {
	
	$(theClass).not(theID).fadeOut();
} 
// implementation: domModule.displayOptions
this.hideAllButOne('.options', optionsID); 

// status: ~~~ not sure ~~~
// module: cloudModule 
// function:
getTenMoreTweets: function() {
	
	this.init(setOfTenTweets.returnTenTweets());
} 
// implementation: cloudModule.activateTenMoreTweets
this.getTenMoreTweets();

// status: ~~~ not sure ~~~ 
// module: own
// function: 
	// setOfTenTweets... [not going to put the whole thing here]
// implementation:
	//searchModule.search [setOfTenTweets.init]
	//searchModule.search [setOfTenTweets.returnTenTweets] 


