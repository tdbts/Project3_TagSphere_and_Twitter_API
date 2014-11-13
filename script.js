$(document).ready(function() {

	// Array that will hold the tags used to generate the cloud
	var twitterCloudTags = [];

	var domModule = (function() {
		
		return {
			
			// Check to make sure jQuery loaded properly
			jqueryCheckLoad: function(selector, milliseconds) {

				$(selector).fadeOut(milliseconds).fadeIn(milliseconds);
			},

			activateTooltip: function(selector) {
				
				$(selector).tooltip(); 
			},

			// Make input fields responsive to enter key
			makeEnterKeyDoSomething: function(selector, func) {
				
				$(selector).keydown(function(e) {
					
					if (e.keyCode === 13) {

						func();
					}
				});
			},

			// Activates button and input field so that their respective events 
			// trigger the given f(x)
			activateSearchField: function(buttonID, inputID, func) {
				
				$(buttonID).on('click', function() {
					func();
				});

				this.makeEnterKeyDoSomething(inputID, function() {
					func();
				});
			},

			scrollDownTo: function(selector, milliseconds) {
				
				$('html, body').animate({

					scrollTop: $(selector).offset().top
				}, milliseconds);
			},

			scrollUpToTop: function(milliseconds) {
				
				$('html, body').animate({scrollTop: 0}, milliseconds);
			},

			hideAllButOne: function(theClass, theID) {
				
				$(theClass).not(theID).fadeOut();
			},

			eraseAllFieldsButOne: function(theClass, theID) {
				
				$(theClass).not(theID).val('');
			},

			eraseAllFields: function(theClass) {
				
				$(theClass).val('');
			},

			deactivateToggleForAccordion: function(selector) {
				
				$(selector).collapse({toggle: false});
			},

			customToggleForAccordion: function(selector) {
				
				$(selector).on('click', function() {
					
					$('div').removeClass('do_not_close');

					$(this).closest('.panel-heading').next().addClass('do_not_close');

					$('.collapse:not(.do_not_close)').collapse('hide');

				});
			},

			revealOptionsCollapse: function() {
				
				$('.collapse:not(#collapseThree)').collapse('hide');
				$('#collapseThree').collapse('show');
			},

			displayOptions: function(optionsID) {
				
				this.revealOptionsCollapse();
				this.hideAllButOne('.options', optionsID);
				$(optionsID).fadeIn(3000);
			},

			attachLink: function(selector, url) {
				
				$(selector).on('click', function() {
			
					window.open(url);
				});
			},

			getVal: function(selector) {
				
				return $(selector).val();
			},

			clearField: function(selectors) {
				
				selectors.forEach(function(fieldID) {
					
					$(fieldID).val("");
				});
			},

			emailModalAJAX: function() {
				
				$('#send_email_btn').on('click', function(event) {
					
					var firstName = domModule.getVal.call(domModule, '#first_name');
					var lastName = domModule.getVal.call(domModule, '#last_name');
					var email = domModule.getVal.call(domModule, '#email');
					var comments = domModule.getVal.call(domModule, '#comments');
					var url = '/shared/send_form_email.php';

					var request = $.ajax({

						type: "POST",
						url: url,
						data: {
							first_name: firstName,
							last_name: lastName,
							email: email,
							comments: comments
						}
					});

					request.done(function() {
						
						$('#emailModal').modal('hide');
						domModule.clearField(['#first_name', '#last_name', '#email', '#comments']);
						$('#send_email_btn').popover('hide');
					});

					request.fail(function() {
						
						alert('Sorry, AJAX was unable to process that request!');
					});

					event.preventDefault();
				});
			}			
		}
	
	})();

	var tagModule = (function() {
	
		return {

			// Takes military time and formats it into clock time
			formatAMPM: function(date) {
				
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var AMorPM = hours >= 12 ? 'pm' : 'am';

				hours = hours % 12;
				hours = hours ? hours : 12;

				minutes = minutes < 10 ? '0' + minutes : minutes;

				var strTime = hours + ':' + minutes + ' ' + AMorPM;

				return strTime;
			},

			// Takes 'created_at' values from tweet objects and turns them 
			// into a date format that the tags can use
			// If 'withTime' is true, it adds the time to the result as well
			createDate: function(theGivenDate, withTime) {
				
				var tempDate, date;
				var ms = Date.parse(theGivenDate);

				tempDate = new Date(ms);
				date = tempDate.toString().slice(0, 10);

				if (withTime) {

					time = this.formatAMPM.call(tagModule, tempDate);
					date += " " + time;
				}

				return date;
			},

			// Generates an ID for the new object based upon the number of tags already 
			// in the tag array.  The first ten tags take thenumbers (as strings) 0-9, 
			// the next ten 00, 01, 02...09, the next ten 000, 001, 002...009, and so on.
			createID: function(arr) {
				
				var tagLength = arr.length;
				var subtractor = 0;

				// Starting from zero, subtract from the number of elements in the array, 
				// until the result is evenly divisible by 10
				while ((tagLength - subtractor)%10 > 0) {
					subtractor++;
				}

				// The first digit of the tag is equal to the amount that had to be 
				// subtracted to get a number evenly divisible by 10
				var myFirstDigit = subtractor;
				// The number of zeroes is equal to the amount of times 10 goes 
				// into the result of tagLength minus the subtractor
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
			},

			// For input, instantiations of the Clouder class accept an array 
			// of "little objects" of the form: {text: theText, id: theID, weight: theWeight}.
			// This f(x) creates a single "little object" for the cloud
			createObjectForCloud: function(theText, theURL, cloudTags, imageInTweet) {
				
				var theID = this.createID(cloudTags);

				return {text: theText, id: theID, weight: 0.1, url: theURL, isImage: imageInTweet};
			},

			// Adds tweet tag objects to the array of tweet tags
			// Formatting of the text depends upon which search URL is invoked
			addTweetTags: function(arrayOfTweetObjects, variableToSaveTo, whichResults) {
				
				var tweetText, tweetDate, url, displayText;

				for (var i = 0; i < arrayOfTweetObjects.length; i++) {
					
					var tweet = arrayOfTweetObjects[i];

					tweetText = tweet.text;
					url = tweet.url;
					imageInTweet = tweet.isImage;

					if (whichResults === "twitter_timeline_search.php") {

						tweetDate = this.createDate(tweet.date, false);

						displayText = tweetText + " \n" + tweetDate;
					}

					if (whichResults === "twitter_keyword_search.php") {

						var userName = "- @" + tweet.screen_name;
						tweetDate = this.createDate(tweet.date, true);

						displayText = "\n" + tweetText + "\n" + userName + "\n" + tweetDate;
					}

					var newTweetTagObject = this.createObjectForCloud(displayText, url, variableToSaveTo, imageInTweet);
					console.log(newTweetTagObject);

					variableToSaveTo.push(newTweetTagObject);
				}
			},

			clearTweetTags: function() {
				
				twitterCloudTags = [];
			}
		}
	
	})();

	var cloudModule = (function() {
	
		return {

			// Displays dialog box that shows tweet text and asks the user if they would 
			// like to navigate to the link contained within the tweet 
			urlConfirmAssignment: function(theText, theURL) {
				
				var question = confirm(theText + 
					"\n\n Are you sure you want to navigate to the link contained in the highlighted tweet?");

				if (question) {
					window.open(theURL);
				} else return;
			},

			displayImageModal: function(imageModalID, options) {

				$(imageModalID).modal(options);
			},

			setImageSource: function(imgID, url) {
				
				$(imgID).attr('src', url);
			},

			setImageModalTitle: function(titlePlacementID, theText) {
				
				$(titlePlacementID).text(theText);
			},

			clearImageModal: function(labelID, imageID) {
				
				$(labelID).text("");

				$(imageID).attr('src', "#");
			},

			activateModalCloseButtons: 	function(modalCloseButtonClass) {
				
				$(modalCloseButtonClass).on('click', cloudModule.clearImageModal.bind(cloudModule, '#imageModalLabel', '#tweet_image'));
			},

			// Callback f(x) for when tweet tags are clicked upon
			// Checks to see whether tags exist, and if so, loops through the tag array 
			// until it finds the "little object" with the matching id, and then invokes 
			// 'urlConfirmAssignment', passing it the tweet text and url
			urlCallback: function(id) {
				
				if (twitterCloudTags.length !== 0) {
					for (var i = 0; i < twitterCloudTags.length; i++) {
						
						var theTweet = twitterCloudTags[i];

						if (theTweet.id === id) {
							if (theTweet.url && theTweet.isImage) {
								
								this.setImageModalTitle('#imageModalLabel', theTweet.text);

								this.setImageSource('#tweet_image', theTweet.url);

								this.displayImageModal('#imageModal', {
									keyboard: true
								});
							
							} else if (theTweet.url && !theTweet.isImage) {

								this.urlConfirmAssignment(theTweet.text, theTweet.url);
							
							} else {
								alert(theTweet.text);
							}
						}
					}
				}
			},

			killCloud: function() {
				window.clouder.kill();
			},

			// Check to see if tags are already displayed from a previous search.
			// If so, kill that cloud.
			checkIfCloudExists: function() {
				
				if ($('#clouder').children().length > 0) {

					this.killCloud();
				}
			},

			// Initialize tag cloud
			init: function(variableContainingTags) {
				
				this.checkIfCloudExists();

				var w = document.body.clientWidth, h = document.body.clientHeight;
				var clouder = document.getElementById('clouder');
				var parent = document.getElementById('cloudParent');
				var parentRect = parent.getBoundingClientRect();

				clouder.style.width = (w * 3 / 4).toString() + "px";
				clouder.style.height = (h * 0.8).toString() + "px";
				clouder.style.position = "relative";
				clouder.style.left = (w / 6).toString() + "px";
				clouder.style.top = "0px";
				// clouder.style.top = (parentRect.y + window.pageYOffset).toString() + "px";

				window.clouder = new Clouder({
					container: clouder,
					tags: variableContainingTags,
					nonSense: 0.3,
					interval: 10,
					yScale: 0.9,
					callback: this.urlCallback.bind(cloudModule)
				});
			},

			getTenMoreTweets: function() {
				
				this.init.call(cloudModule, setOfTenTweets.returnTenTweets.call(setOfTenTweets));
			},

			activateTenMoreTweetsButton: function() {
				$('#getTenPreviousTweets').click(this.getTenMoreTweets.bind(cloudModule));
			}
		}
	
	})();

	var searchModule = (function() {
	
		return {

			getTwitterSearchTerm: function(searchFieldID) {
				
				return $(searchFieldID).val();
			},

			// AJAX request to Twitter for tweet data
			search: function(searchTerms, searchURL) {
				
				// If cloud tags already exist, kill cloud before
				// running the AJAX request
				cloudModule.checkIfCloudExists();

				$.ajax({

					// Create URL for tweet search
					url: searchURL + "?q=" + searchTerms,

					success: function(data) {
						
						// Take the returned string and parse into queryable JSON
						// The server will have already cut the data down to 
						// only what is needed for the cloud
						var parsedData = JSON.parse(data);
						console.log(parsedData);

						tagModule.addTweetTags(parsedData, twitterCloudTags, searchURL);
						setOfTenTweets.init(twitterCloudTags);
						cloudModule.init(setOfTenTweets.returnTenTweets());
						domModule.scrollDownTo('#clouder', 500);
					},

					error: function() {
						
						$('#clouder').html('Search for Tweets failed!');
					}
				});
			},

			// Abstraction of general search process
			executeSearch: function(searchTermField, url, optionsDiv) {
				
				var twitterSearchTerm;
				var input = $.trim($(searchTermField).val());

				// Execute the search only if there is something in the input field
				if (input.length > 0) {

					tagModule.clearTweetTags();
					twitterSearchTerm = this.getTwitterSearchTerm(searchTermField);
					domModule.eraseAllFieldsButOne('.inputField', searchTermField);
					domModule.displayOptions(optionsDiv);
					this.search(twitterSearchTerm, url);
				}
			},

			executeTwitterAccountSearch: function() {
				
				this.executeSearch.call(searchModule, '#twitterHandle', 'twitter_timeline_search.php', '#feedCloudOptions');
			},

			executeTwitterTermSearch: function() {
				
				this.executeSearch.call(searchModule, '#search_term', 'twitter_keyword_search.php', '#searchCloudOptions');
			}

		}
	
	})();

	// When 'Clear Tags' button clicked, kill the cloud, reset the tag array, 
	// then autoscroll back up to the top
	function activateClearTagsButton() {

		$('.clearAll').click(function() {
			
			$('.options').fadeOut(1000);
			domModule.eraseAllFields('.inputField');

			cloudModule.killCloud();
			tagModule.clearTweetTags();

			domModule.scrollUpToTop(500);
		});
	}

	// Module that is initialized with the array of "little tweetobjects"
	// The module takes that array and breaks the objects up into arrays
	// of length 10, and pushes them to an array which holds them all.
	// The module then returns 10 tweet objects at a time, and when it has 
	// returned all of them, the counter resets to 0.
	var setOfTenTweets = (function() {

		var counter;
		var arrayOfSetsOfTen;

		function incrementCounter() {
			return counter++;
		}

		function resetCounter() {
			counter = 0;
			console.log("Counter reset to 0.");
		}

		// Takes an array of elements, and breaks it up into sets of a 
		// given size, and then groups all these sets into a new array
		function createArrayOfArrays(source, setSize) {
			var i, j;
			var arrayOfArrays = [];

			for (var i = 0, j = source.length; i < j; i += setSize) {
				
				tempArray = source.slice(i, i + setSize);
				arrayOfArrays.push(tempArray);
			}

			return arrayOfArrays;
		}

		// Initializes the module with the array of tweet objects
		function init(arrayOfTweetObjects) {

			arrayOfSetsOfTen = createArrayOfArrays(arrayOfTweetObjects, 10);
	    	counter = 0;
		}

		// Returns 10 of the tweet objects at a time
		// If the counter has reached the length of the array of arrays, 
		// the counter resets to 0 and indicates this in the console
		function returnTenTweets() {

			var setOfTen;

			setOfTen = arrayOfSetsOfTen[counter];
			incrementCounter();
	  
		    if (!(counter < arrayOfSetsOfTen.length)) {
		      resetCounter();
		    }
	    
			return setOfTen;
		}

		return {
			init: init,
			returnTenTweets: returnTenTweets,
			resetCounter: resetCounter
		};

	})();

	// IMPLEMENTATION
	// Check that jQuery is working properly
	domModule.jqueryCheckLoad('#header', 1000);
	// Bootstrap tooltips
	domModule.activateTooltip('.bar-icon-right');

	domModule.deactivateToggleForAccordion('.collapse');
	$('#collapseOne').collapse('show');
	domModule.customToggleForAccordion('.accordion_header');

	activateClearTagsButton();

	domModule.activateSearchField.call(domModule, '#createTwitterFeedCloud', '#twitterHandle', searchModule.executeTwitterAccountSearch.bind(searchModule));
	domModule.activateSearchField.call(domModule, '#createTweetSearchCloud', '#search_term', searchModule.executeTwitterTermSearch.bind(searchModule));

	cloudModule.activateTenMoreTweetsButton.call(cloudModule);
	cloudModule.activateModalCloseButtons.call(cloudModule, '.modal_close');

	domModule.attachLink('#twitter_icon', 'http://www.twitter.com/VRSanchez8717');
	domModule.attachLink('#github_icon', 'http://www.github.com/tdbts');

	domModule.emailModalAJAX.call(domModule);
	$('#send_email_btn').popover({content: 'Thanks for reaching out!'}, 'click');

});