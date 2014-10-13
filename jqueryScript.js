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
			
			// Create "little object" using the extracted text and push to array of objects
			var newTweetTagObject = createObjectForCloud(displayText, variableToSaveTo);
			variableToSaveTo.push(newTweetTagObject);
		}
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

	function init(variableContainingTags) {
		var w = document.body.clientWidth, h = document.body.clientHeight;
		var clouder = document.getElementById('clouder');

		clouder.style.borderTop = "1px solid black";
		clouder.style.borderBottom = "1px solid black";
		clouder.style.width = w * 3 / 4;
		clouder.style.height = h * 3 / 4;
		clouder.style.position = "absolute";
		clouder.style.left = w / 6;
		clouder.style.top = h / 2;
		
		// Need to refactor this into a f(x)
		window.clouder = new Clouder({
			container: clouder,
			tags: variableContainingTags,
			nonSense: 0.075
		});
	}

	function scrollDownTo(elementSelector, milliseconds) {

	$('html, body').animate({

		scrollTop: $(elementSelector).offset().top
	}, milliseconds);
}

	function scrollUpToTop(milliseconds) {

		$('html, body').animate({

			scrollTop: 0
		}, milliseconds);
	}

	$('#drawCloud').click(function() {
		
		init(userCloudTags);

		scrollDownTo('#clouder', 500);
	});

	$('#clearAll').click(function() {
		
		window.clouder.kill();
		userCloudTags = [];

		scrollUpToTop(500);
	});

	function search(searchTerms, searchURL) {

		// $('#ajax_results').html('Searching Twitter...');

		// var search_value = encodeURIComponent($('input[name=search_terms]').val());
		console.log("Searching for @" + searchTerms + ".");

		$.ajax({

			// Create URL
			url: searchURL + "?q=" + searchTerms, 

			success: function(data) {
				
				console.log("Search for " + searchTerms + " was successful!");
				// Display the results
				// $('#ajax_results').html(data);
				var parsedData = JSON.parse(data);
				console.log(parsedData);
				addTweetTags(parsedData, twitterCloudTags);
				console.log("twitterCloudTags: ");
				console.log(twitterCloudTags);
				init(twitterCloudTags);
			},

			error: function() {
				// $('#ajax_results').html('Ajax request failed');
				console.log('Ajax request failed!');
			}
		});
	}

	$('#createTweetCloud').click(function() {

		var search_value = $('#twitterHandle').val();
		search(search_value, 'twitter_cloud_search.php');

		// addTweetTags(data, twitterCloudTags);

		// init(twitterCloudTags);
	});

});


