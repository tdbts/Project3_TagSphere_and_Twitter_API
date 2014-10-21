$(document).ready(function() {
	
	// Check to make sure jQuery loaded properly
	function jqueryCheckLoad(selector, milliseconds) {

		$(selector).fadeOut(milliseconds).fadeIn(milliseconds);
	}
	// Invoke the check
	jqueryCheckLoad('#header', 700);

	// Creates tag object for the given tag and pushes it to the 
	// array of cloud tags
	function addTag() {

		// Get user text input
		var userText = $('#customTag').val();

		// Create object for user tag and push to array
		var newUserLittleObject = createObjectForCloud(userText, userCloudTags);
		userCloudTags.push(newUserLittleObject);

		// Erase contents of the input field
		$('#customTag').val('');
	}

	// Takes an array of JSON data for each individual tweet and gets the 
	// tweet text and date for each, then formats everything for the tags
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
			console.log(newTweetTagObject);
			variableToSaveTo.push(newTweetTagObject);
		}
	}

	// Initialize tag cloud
	function init(variableContainingTags) {
		var w = document.body.clientWidth, h = document.body.clientHeight;
		var clouder = document.getElementById('clouder');
		var parent = document.getElementById('cloudParent');
		var parentRect = parent.getBoundingClientRect();

		clouder.style.width = (w * 3 / 4).toString() + "px";
		clouder.style.height = (h * 1.5).toString() + "px";
		clouder.style.position = "absolute";
		clouder.style.left = (w / 6).toString() + "px";
		clouder.style.top = (parentRect.y + 50).toString() + "px";
		
		window.clouder = new Clouder({
			container: clouder,
			tags: variableContainingTags,
			nonSense: 0.3,
			callback: urlCallback
		});
	}

	var urlCallback = function(id) {
		if (twitterCloudTags.length !== 0) {
			for (var i = 0; i < twitterCloudTags.length; i++) {
				if (twitterCloudTags[i].id === id) {
					if (twitterCloudTags[i].url) {
						urlConfirmAssignment(twitterCloudTags[i].url);
					} else {
						alert(twitterCloudTags[i].text);
					}
				}
			}
		}
	};

	function urlConfirmAssignment(theURL) {
		var question = confirm("Are you sure you navigate to the link contained in the outlined tweet?");

		if (question) {
			window.open(theURL);
		} else return;
	}

	// For user-generated tags
	$('#tagButton').click(function() {
	
		addTag();
	});

	// Make custom tag field responsive to enter key
	function makeEnterKeyDoSomething(selector, func) {

		$(selector).keydown(function(e) {
			
			if (e.keyCode === 13) {

				func();
			}
		});
	}
	makeEnterKeyDoSomething('#customTag', addTag);


	function scrollDownTo(elementSelector, milliseconds) {

	$('html, body').animate({

		scrollTop: $(elementSelector).offset().top
	}, milliseconds);
}

	function scrollUpToTop(milliseconds) {

		$('html, body').animate({scrollTop: 0}, milliseconds);
	}

	// Initialize cloud when Draw Cloud button clicked, then 
	// autoscroll down to where the cloud appears
	$('#drawCloud').click(function() {
		
		init(userCloudTags);

		scrollDownTo('#clouder', 500);
	});

	// When Clear Tags button clicked, kill the cloud, reset the tag array, 
	// then autoscroll back up to the top
	$('#clearAll').click(function() {
		
		window.clouder.kill();
		userCloudTags = [];
		twitterCloudTags = [];	

		scrollUpToTop(500);
	});

	// AJAX request to Twitter for tweet data
	function search(searchTerms, searchURL) {

		$.ajax({

			// Create URL for tweet search
			url: searchURL + "?q=" + searchTerms, 

			success: function(data) {
				
				// Take returned string and parse into queryable JSON
				// The server will have already cut the data down to 
				// only what I need for the cloud
				var parsedData = JSON.parse(data);
				console.log(parsedData);
				
				addTweetTags(parsedData, twitterCloudTags);
				init(twitterCloudTags);
				scrollDownTo('#clouder', 500);
			},

			error: function() {
				$('#clouder').html('Search for Tweets failed!');
			}
		});
	}

	function getTwitterHandle() {
		return $('#twitterHandle').val();
	}

	function executeTwitterSearch() {

		var search_value = getTwitterHandle();
		search(search_value, 'twitter_cloud_search.php');
	}

	$('#createTweetCloud').click(function() {

		executeTwitterSearch();
	});

	makeEnterKeyDoSomething('#twitterHandle', function() {
		
		executeTwitterSearch();
	});




});


