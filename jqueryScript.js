$(document).ready(function() {
	
	$('#header').fadeOut(700).fadeIn(700);

	function addTag() {

		var userText = $('#customTag').val();
		console.log("Adding '" + userText + "' to the cloud.");

		var newUserLittleObject = createObjectForCloud(userText, userCloudTags);
		userCloudTags.push(newUserLittleObject);
		console.log(userCloudTags);

		$('#customTag').val('');
	}

	function addTweetTags(arrayOfTweetObjects, variableToSaveTo) {
		// console.log("addTweetTags: received data - ");
		// console.log(arrayOfTweetObjects[0]);

		for (i = 0; i < arrayOfTweetObjects.length; i++) {
			var tweetText = arrayOfTweetObjects[i].text;
			console.log("tweetText: " + tweetText);
			var tweetDate = arrayOfTweetObjects[i].date.slice(0, 10);
			console.log("tweetDate: " + tweetDate);
			var displayText = tweetText + " \n" + tweetDate;
			console.log("displayText: " + displayText);

			var newTweetTagObject = createObjectForCloud(displayText, variableToSaveTo);
			twitterCloudTags.push(newTweetTagObject);
		}
	}

	$('#tagButton').click(function() {
	
		addTag();
	});

	// Need to activate keycode '13' for all other input locations
	$('#customTag').keydown(function(e) {
		
		if (e.keyCode == 13) {

			addTag();
		}
	});

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


