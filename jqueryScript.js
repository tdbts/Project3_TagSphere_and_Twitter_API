$(document).ready(function() {
	
	// Check to make sure jQuery loaded properly
	function jqueryCheckLoad(selector, milliseconds) {

		$(selector).fadeOut(milliseconds).fadeIn(milliseconds);
	}
	// Invoke the check
	jqueryCheckLoad('#header', 700);

	// Font-Awesome Icons
	$('.bar-icon-right').tooltip();

	// Takes military time and formats it into clock time	
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

	// Takes 'created_at' values from tweet objects and turns it 
	// into a format I can use for the tags
	// If 'withTime' is true, it adds the time to the result
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

				displayText = "\n" + tweetText + "\n" + userName + "\n" + tweetDate;
			}

			var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo);

			variableToSaveTo.push(newTweetTagObject);
		}
	}

	// Initialize tag cloud
	function init(variableContainingTags) {

		checkIfCloudExists();
		
		var w = document.body.clientWidth, h = document.body.clientHeight;
		var clouder = document.getElementById('clouder');
		var parent = document.getElementById('cloudParent');
		var parentRect = parent.getBoundingClientRect();

		clouder.style.width = (w * 3 / 4).toString() + "px";
		clouder.style.height = (h * 1.75).toString() + "px";
		clouder.style.position = "absolute";
		clouder.style.left = (w / 6).toString() + "px";
		clouder.style.top = (parentRect.y + window.pageYOffset).toString() + "px";
		
		window.clouder = new Clouder({
			container: clouder,
			tags: variableContainingTags,
			nonSense: 0.3,
			callback: urlCallback
		});
	}

	// Callback f(x) for when tweet tags are clicked upon
	// Checks to see whether tags exist, and if so, loops through the tag array 
	// until it finds the "little object" with the matching id, and then invokes 
	// 'urlConfirmAssignment', passing to the tweet text and url
	var urlCallback = function(id) {
		
		if (twitterCloudTags.length !== 0) {
			for (var i = 0; i < twitterCloudTags.length; i++) {
				
				var theTweet = twitterCloudTags[i];

				if (theTweet.id === id) {
					if (theTweet.url) {
						
						urlConfirmAssignment(theTweet.text, theTweet.url);
					
					} else {
						alert(theTweet.text);
					}
				}
			}
		}
	};

	// Display dialog box showing tweet text and asking user if they would like to 
	// navigate to the link contained within the tweet
	function urlConfirmAssignment(theText, theURL) {
		var question = confirm(theText + 
			"\n\n Are you sure you sure you want to navigate to the link contained in the outlined tweet?");

		if (question) {
			window.open(theURL);
		} else return;
	}

	// Make custom tag field responsive to enter key
	function makeEnterKeyDoSomething(selector, func) {

		$(selector).keydown(function(e) {
			
			if (e.keyCode === 13) {

				func();
			}
		});
	}

	function scrollDownTo(elementSelector, milliseconds) {

		$('html, body').animate({

			scrollTop: $(elementSelector).offset().top
		}, milliseconds);
	}

	function scrollUpToTop(milliseconds) {

		$('html, body').animate({scrollTop: 0}, milliseconds);
	}

	function killCloud() {
		window.clouder.kill();
	}

	function clearTweetTags() {
		twitterCloudTags = [];
	}

	// When Clear Tags button clicked, kill the cloud, reset the tag array, 
	// then autoscroll back up to the top
	$('.clearAll').click(function() {
		
		$('.options').fadeOut(1000);
		eraseAllFields('.inputField');
		
		killCloud();
		clearTweetTags();	

		scrollUpToTop(500);
	});

	// Check to see if tags are already displayed from a 
	// previous search.  If so, kill that cloud.
	function checkIfCloudExists() {

		if ($('#clouder').children().length > 0) {

			killCloud();
		}
	}

	// AJAX request to Twitter for tweet data
	function search(searchTerms, searchURL) {

		// If cloud tags already, kill cloud before 
		// running the AJAX request
		checkIfCloudExists();

		$.ajax({

			// Create URL for tweet search
			url: searchURL + "?q=" + searchTerms, 

			success: function(data) {
				
				// Take returned string and parse into queryable JSON
				// The server will have already cut the data down to 
				// only what I need for the cloud
				var parsedData = JSON.parse(data);
				console.log(parsedData);
				
				addTweetTags(parsedData, twitterCloudTags, searchURL);
				setOfTenTweets.init(twitterCloudTags);
				init(setOfTenTweets.returnTenTweets());
				scrollDownTo('#clouder', 500);
			},

			error: function() {
				$('#clouder').html('Search for Tweets failed!');
			}
		});
	}

	function getTwitterSearchTerm(searchFieldID) {
		return $(searchFieldID).val();
	}

	// Abstraction of general search process
	function executeSearch(searchTermField, url, optionsDiv) {
		
		var twitterSearchTerm;
		var input = $.trim($(searchTermField).val());

		// Execute the search only if there is something in the input field
		if (input.length > 0) {

			clearTweetTags();
			twitterSearchTerm = getTwitterSearchTerm(searchTermField);
			eraseAllFieldsButOne('.inputField', searchTermField);
			displayOptions(optionsDiv);
			search(twitterSearchTerm, url);
		}
		
	}

	var executeTwitterAccountSearch = function() {
		executeSearch('#twitterHandle', 'twitter_timeline_search.php', '#feedCloudOptions');
	}

	var executeTwitterTermSearch = function() {
		executeSearch('#search_term', 'twitter_keyword_search.php', '#searchCloudOptions');
	}

	// Activates button and input field so that their respective events 
	// trigger the given f(x)
	function activateSearchField(buttonID, inputID, func) {

			$(buttonID).click(function() {
				func();
			});

			makeEnterKeyDoSomething(inputID, function() {
				func();
			});
	}
	activateSearchField('#createTwitterFeedCloud', '#twitterHandle', executeTwitterAccountSearch);
	activateSearchField('#createTweetSearchCloud', '#search_term', executeTwitterTermSearch);

	function hideAllButOne(theClass, theID) {
		$(theClass).not(theID).fadeOut();
	}

	function eraseAllFieldsButOne(theClass, theID) {
		$(theClass).not(theID).val('');
	}

	function eraseAllFields(theClass) {
		$(theClass).val('');
	}

	function displayOptions(optionsID) {
		
		hideAllButOne('.options', optionsID);
		$(optionsID).fadeIn(3000);
	}

	function getTenMoreTweets() {

		init(setOfTenTweets.returnTenTweets());
	}

	$('#getTenPreviousTweets').on('click', function() {
		
		getTenMoreTweets();
	});

});


