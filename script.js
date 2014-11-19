$(document).ready(function() {

	// Array that will hold the tags used to generate the cloud
	var twitterCloudTags = [];

	var domModule = (function() {
		
		// Private f(x)'s

		var getVal = function(selector) {

			return $(selector).val();
		};

		var clearField = function(selectors) {
					
			selectors.forEach(function(fieldID) {
				
				$(fieldID).val("");
			});
		};

		var revealOptionsCollapse = function() {
				
				$('.collapse:not(#collapseThree)').collapse('hide');
				$('#collapseThree').collapse('show');
		};

		var hideAllButOne = function(theClass, theID) {
				
			$(theClass).not(theID).fadeOut();
		};

		// Make input fields responsive to enter key
		var makeEnterKeyDoSomething = function(selector, func) {
			
			$(selector).keydown(function(e) {
				
				if (e.keyCode === 13) {

					func();
				}
			});
		};

		// Public Methods

		// Check to make sure jQuery loaded properly
		var jqueryCheckLoad = function(selector, milliseconds) {

			$(selector).fadeOut(milliseconds).fadeIn(milliseconds);
		};

		var activateTooltip = function(selector) {
			
			$(selector).tooltip(); 
		};

		// Activates button and input field so that their respective events 
		// trigger the given f(x)
		var activateSearchField = function(buttonID, inputID, func) {
			
			$(buttonID).on('click', function() {
				func();
			});

			makeEnterKeyDoSomething(inputID, function() {
				func();
			});
		};

		var scrollDownTo = function(selector, milliseconds) {
			
			$('html, body').animate({

				scrollTop: $(selector).offset().top
			}, milliseconds);
		};

		var scrollUpToTop = function(milliseconds) {
			
			$('html, body').animate({scrollTop: 0}, milliseconds);
		};

		var eraseAllFieldsButOne = function(theClass, theID) {
			
			$(theClass).not(theID).val('');
		};

		var eraseAllFields = function(theClass) {
			
			$(theClass).val('');
		};

		var deactivateToggleForAccordion = function(selector) {
			
			$(selector).collapse({toggle: false});
		};

		var customToggleForAccordion = function(selector) {
			
			$(selector).on('click', function() {
				
				$('div').removeClass('do_not_close');

				$(this).closest('.panel-heading').next().addClass('do_not_close');

				$('.collapse:not(.do_not_close)').collapse('hide');

			});
		};

		var openAccordionSegment = function(segmentID) {
			
			$(segmentID).collapse('show');
		};

		var displayOptions = function(optionsID) {
			
			revealOptionsCollapse();
			hideAllButOne('.options', optionsID);
			$(optionsID).fadeIn(3000);
		};

		var attachLinks = function(selectorsAndURLs) {
			
			selectorsAndURLs.forEach(function(obj) {
				
				$(obj.selector).on('click', function() {
					
					window.open(obj.url);
				});
			});
		};

		// Email modal: After submission
		var activatePopover = function(popoverID) {

			$(popoverID).popover({content: 'Thanks for reaching out!'}, 'click');
		};

		var emailModalAJAX = function() {
			
			$('#send_email_btn').on('click', function(event) {

				var firstName = getVal('#first_name');
				var lastName = getVal('#last_name');
				var email = getVal('#email');
				var comments = getVal('#comments');
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
					clearField(['#first_name', '#last_name', '#email', '#comments']);
					$('#send_email_btn').popover('hide');
				});

				request.fail(function() {
					
					alert('Sorry, AJAX was unable to process that request!');
				});

				event.preventDefault();
			});
		};

		return {

			jqueryCheckLoad: jqueryCheckLoad,
			
			activateTooltip: activateTooltip,
			activateSearchField: activateSearchField,
			
			scrollDownTo: scrollDownTo, 
			scrollUpToTop: scrollUpToTop,
			
			eraseAllFieldsButOne: eraseAllFieldsButOne,
			eraseAllFields: eraseAllFields, 
			
			deactivateToggleForAccordion: deactivateToggleForAccordion, 
			customToggleForAccordion: customToggleForAccordion, 
			openAccordionSegment: openAccordionSegment, 
			displayOptions: displayOptions, 
			
			attachLinks: attachLinks, 
			activatePopover: activatePopover, 
			emailModalAJAX: emailModalAJAX
		
		};
	
	})();

	var tagModule = (function() {
	
		// Takes military time and formats it into clock time
		var formatAMPM = function(date) {
			
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var AMorPM = hours >= 12 ? 'pm' : 'am';

			hours = hours % 12;
			hours = hours ? hours : 12;

			minutes = minutes < 10 ? '0' + minutes : minutes;

			var strTime = hours + ':' + minutes + ' ' + AMorPM;

			return strTime;
		};

		// Takes 'created_at' values from tweet objects and turns them 
		// into a date format that the tags can use
		// If 'withTime' is true, it adds the time to the result as well
		var createDate = function(theGivenDate, withTime) {
			
			var tempDate, date;
			var ms = Date.parse(theGivenDate);

			tempDate = new Date(ms);
			date = tempDate.toString().slice(0, 10);

			if (withTime) {

				time = formatAMPM(tempDate);
				date += " " + time;
			}

			return date;
		};

		// Generates an ID for the new object based upon the number of tags already 
		// in the tag array.  The first ten tags take thenumbers (as strings) 0-9, 
		// the next ten 00, 01, 02...09, the next ten 000, 001, 002...009, and so on.
		var createID = function(arr) {
			
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
		};

		// For input, instantiations of the Clouder class accept an array 
		// of "little objects" of the form: {text: theText, id: theID, weight: theWeight}.
		// This f(x) creates a single "little object" for the cloud
		var createObjectForCloud = function(theText, theURL, cloudTags, imageInTweet) {
			
			var theID = createID(cloudTags);

			return {text: theText, id: theID, weight: 0.1, url: theURL, isImage: imageInTweet};
		};

		// Adds tweet tag objects to the array of tweet tags
		// Formatting of the text depends upon which search URL is invoked
		var addTweetTags = function(arrayOfTweetObjects, variableToSaveTo, whichResults) {
			
			var tweetText, tweetDate, url, displayText;

			for (var i = 0; i < arrayOfTweetObjects.length; i++) {
				
				var tweet = arrayOfTweetObjects[i];

				tweetText = tweet.text;
				url = tweet.url;
				imageInTweet = tweet.isImage;

				if (whichResults === "twitter_timeline_search.php") {

					tweetDate = createDate(tweet.date, false);

					displayText = tweetText + " \n" + tweetDate;
				}

				if (whichResults === "twitter_keyword_search.php") {

					var userName = "- @" + tweet.screen_name;
					tweetDate = createDate(tweet.date, true);

					displayText = "\n" + tweetText + "\n" + userName + "\n" + tweetDate;
				}

				var newTweetTagObject = createObjectForCloud(displayText, url, variableToSaveTo, imageInTweet);
				console.log(newTweetTagObject);

				variableToSaveTo.push(newTweetTagObject);
			}
		};

		var clearTweetTags = function() {
			
			twitterCloudTags = [];
		};		

		return {

			addTweetTags: addTweetTags,
			clearTweetTags: clearTweetTags
		
		}
	
	})();

	var cloudModule = (function() {
		
		// Displays dialog box that shows tweet text and asks the user if they would 
		// like to navigate to the link contained within the tweet 
		var urlConfirmAssignment = function(theText, theURL) {
			
			var question = confirm(theText + 
				"\n\n Are you sure you want to navigate to the link contained in the highlighted tweet?");

			if (question) {
				window.open(theURL);
			} else return;
		};

		var displayImageModal = function(imageModalID, options) {

			$(imageModalID).modal(options);
		};

		var setImageSource = function(imgID, url) {
			
			$(imgID).attr('src', url);
		};

		var setImageModalTitle = function(titlePlacementID, theText) {
			
			$(titlePlacementID).text(theText);
		};

		var clearImageModal = function(labelID, imageID) {
			
			$(labelID).text("");

			$(imageID).attr('src', "#");
		};

		// Callback f(x) for when tweet tags are clicked upon
		// Checks to see whether tags exist, and if so, loops through the tag array 
		// until it finds the "little object" with the matching id, and then invokes 
		// 'urlConfirmAssignment', passing it the tweet text and url
		var urlCallback = function(id) {
			
			if (twitterCloudTags.length !== 0) {
				for (var i = 0; i < twitterCloudTags.length; i++) {
					
					var theTweet = twitterCloudTags[i];

					if (theTweet.id === id) {
						if (theTweet.url && theTweet.isImage) {
							
							setImageModalTitle('#imageModalLabel', theTweet.text);

							setImageSource('#tweet_image', theTweet.url);

							displayImageModal('#imageModal', {
								keyboard: true
							});
						
						} else if (theTweet.url && !theTweet.isImage) {

							urlConfirmAssignment(theTweet.text, theTweet.url);
						
						} else {
							alert(theTweet.text);
						}
					}
				}
			}
		};

		return {

			activateModalCloseButtons: 	function(modalCloseButtonClass) {
				
				$(modalCloseButtonClass).on('click', function() {
					
					clearImageModal('#imageModalLabel', '#tweet_image');
				});
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

				window.clouder = new Clouder({
					container: clouder,
					tags: variableContainingTags,
					nonSense: 0.3,
					interval: 10,
					yScale: 0.9,
					callback: urlCallback.bind(cloudModule)
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
						console.log("THE CURRENT TWEETS ARE: ");
						setOfTenTweets.getCurrentTweets();
						
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

	// Module that is initialized with the array of "little tweet objects".
	// The module takes that array and breaks the objects up into arrays
	// of length 10, and pushes them to an array which holds them all.
	// The module then returns 10 tweet objects at a time, and when it has 
	// returned all of them, the counter resets to 0.
	var setOfTenTweets = (function() {

		var counter;
		var arrayOfSetsOfTen;
		var currentTweets;

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

		function getCurrentTweets() {

			if (!currentTweets) {

				console.log("There are no current tweets!");
			} else {

				console.log(currentTweets);
			}
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

		    currentTweets = setOfTen;
	    
			return setOfTen;
		}

		return {
			init: init,
			returnTenTweets: returnTenTweets,
			resetCounter: resetCounter,
			getCurrentTweets: getCurrentTweets
		};

	})();

	// IMPLEMENTATION
	function createArrayOfSameElement(param, length) {

		var result = [];

		for (var i = 0; i < length; i++) {
			
			result[i] = param;
		}

		return result;
	}

	function callModuleMethod(module, method, param) {

		return module[method](param);
	}

	function invokeThisCriticalMethod(module, method, params) {

		return module[method].apply(module, params);
	}

	function invokeMultipleModuleMethods(objectOfParams, functionToApply) {

		var modules = objectOfParams.modules,
			methods = objectOfParams.methods,
			params = objectOfParams.params;

		var guageOfLength = modules.length;
		
		if (guageOfLength === methods.length && guageOfLength === params.length) {

			for (var i = 0; i < guageOfLength; i++) {
				
				functionToApply(modules[i], methods[i], params[i]);
			}
		}

	}

	var methodInvocationObj = {
		modules: createArrayOfSameElement(domModule, 6),
		methods: ['activateTooltip', 'activatePopover', 'deactivateToggleForAccordion', 'customToggleForAccordion', 'openAccordionSegment', 'attachLinks'],
		params: ['.bar-icon-right', '#send_email_btn', '.collapse', '.accordion_header', '#collapseOne', [
			{selector: '#twitter_icon', url: 'http://www.twitter.com/VRSanchez8717'}, 
			{selector: '#github_icon', url: 'http://www.github.com/tdbts'}
			]]
	};

	invokeMultipleModuleMethods(methodInvocationObj, callModuleMethod);

	var thisCriticalMethodInvocationObj = {
		modules: [domModule, domModule, cloudModule, cloudModule, domModule], 
		methods: ['activateSearchField', 'activateSearchField', 'activateTenMoreTweetsButton', 'activateModalCloseButtons', 'emailModalAJAX'], 
		params: [
			['#createTwitterFeedCloud', '#twitterHandle', searchModule.executeTwitterAccountSearch.bind(searchModule)],
			['#createTweetSearchCloud', '#search_term', searchModule.executeTwitterTermSearch.bind(searchModule)],
			[],
			['.modal_close'],
			[]
			]
	};	

	invokeMultipleModuleMethods(thisCriticalMethodInvocationObj, invokeThisCriticalMethod);

	// Check that jQuery is working properly
	domModule.jqueryCheckLoad('#header', 1000);
	
	activateClearTagsButton();

});