$(document).ready(function() {

	var twitterCloudTags = [];

	var domModule = (function() {
		
		return {
			// INVOKE with domModule.jqueryCheckLoad('#header', 700)
			jqueryCheckLoad: function(selector, milliseconds) {

				$(selector).fadeOut(milliseconds).fadeIn(milliseconds);
			},

			// INVOKE with domModule.activateTooltip('.bar-icon-right')
			activateTooltip: function(selector) {
				
				$(selector).tooltip(); 
			},

			makeEnterKeyDoSomething: function(selector, func) {
				
				$(selector).keydown(function(e) {
					
					if (e.keyCode === 13) {

						func();
					}
				});
			},

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

			displayOptions: function(optionsID) {
				
				this.hideAllButOne('.options', optionsID);
				$(optionsID).fadeIn(3000);
			}			
		}
	
	})();



	var tagModule = (function() {
	
		return {

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

			createDate: function(theGivenDate, withTime) {
				
				var tempDate, date;
				var ms = Date.parse(theGivenDate);

				tempDate = new Date(ms);
				date = tempDate.toString().slice(0, 10);

				if (withTime) {

					time = formatAMPM(tempDate);
					date += " " + time;
				}

				return date;
			},

			createID: function(arr) {
				
				var tagLength = arr.length;
				var subtractor = 0;

				while ((tagLength - subtractor)%10 > 0) {
					subtractor++;
				}

				var myFirstDigit = subtractor;
				
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

				return output(myFirstDigit, myNumberOfZeroes); 	
			},

			createObjectForCloud: function(theText, theURL, cloudTags) {
				
				var theID = this.createID(cloudTags);

				return {text: theText, id: theID, weight: 0.1, url: theURL};
			},

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

			urlConfirmAssignment: function(theText, theURL) {
				
				var question = confirm(theText + 
					"\n\n Are you sure you want to navigate to the link contained in the highlighted tweet?");

				if (question) {
					window.open(theURL);
				} else return;
			},

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
			},

			killCloud: function() {
				window.clouder.kill();
			},

			checkIfCloudExists: function() {
				
				if ($('#clouder').children().length > 0) {

					this.killCloud();
				}
			},

			init: function(variableContainingTags) {
				
				this.checkIfCloudExists();

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
					callback: this.urlCallback
				});
			},

			getTenMoreTweets: function() {
				
				this.init(setOfTenTweets.returnTenTweets());
			},

			activateTenMoreTweetsButton: function() {
				
				$('#getTenPreviousTweets').on('click', function() {
					
					this.getTenMoreTweets();
				});
			}
		}
	
	})();

	var searchModule = (function() {
	
		getTwitterSearchTerm: function(searchFieldID) {
			
			return $(searchFieldID).val();
		},

		search: function(searchTerms, searchURL) {
			
			cloudModule.checkIfCloudExists();

			$.ajax({

				url: searchURL + "?q=" + searchTerms,

				success: function(data) {
					
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

		executeSearch: function(searchTermField, url, optionsDiv) {
			
			var twitterSearchTerm;
			var input = $.trim($(searchTermField).val());

			if (input.length > 0) {

				tagModule.clearTweetTags();
				twitterSearchTerm = this.getTwitterSearchTerm(searchTermField);
				domModule.eraseAllFieldsButOne('.inputField', searchTermField);
				domModule.displayOptions(optionsDiv);
				this.search(twitterSearchTerm, url);
			}
		},

		executeTwitterAccountSearch: function() {
			
			this.executeSearch('#twitterHandle', 'twitter_timeline_search.php', '#feedCloudOptions');
		},

		executeTwitterTermSearch: function() {
			
			this.executeSearch('#search_term', 'twitter_keyword_search.php', '#searchCloudOptions');
		}
	
	})();

	function activateClearTagsButton() {

		$('.clearAll').click(function() {
			
			$('.options').fadeOut(1000);
			domModule.eraseAllFields('.inputField');

			cloudModule.killCloud();
			tagModule.clearTweetTags();

			domModule.scrollUpToTop(500);
		});
	}

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
	domModule.jqueryCheckLoad('#header', 700);
	domModule.activateTooltip('.bar-icon-right');

	activateClearTagsButton();

	domModule.activateSearchField('#createTwitterFeedCloud', '#twitterHandle', executeTwitterAccountSearch);
	domModule.activateSearchField('#createTweetSearchCloud', '#search_term', executeTwitterTermSearch);

	cloudModule.activateTenMoreTweetsButton();

});