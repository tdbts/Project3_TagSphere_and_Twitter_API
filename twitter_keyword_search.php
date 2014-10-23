<?php 

if (!empty($_GET['q'])) {

	// f(x) that validates user input
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}

	// Strip any dangerous and unnecessary text out of the search
	$twitter_search_term = test_input($_GET['q']);

	// Create OAuth connection
	require 'app_tokens.php';
	require 'tmhOAuth.php';
	$connection = new tmhOAuth(array(
		'consumer_key' => $consumer_key,
		'consumer_secret' => $consumer_secret,
		'user_token' => $user_token,
		'user_secret' => $user_secret
		));

	// Get the 100 most recent tweets using Twitter API
	$http_code = $connection->request('GET', $connection->url('1.1/search/tweets'), 
		array('q' => $twitter_search_term,
			'count' => 100,
			'lang' => 'en'
			));

	// Request was successful
	if ($http_code == 200) {

		// Extract the tweets from the API response
		$response = json_decode($connection->response['response'],true);
		$tweet_data = $response['statuses'];

		// Accumulate tweets from results
		$tweet_stream = array();

		// Checks tweet object for urls, and if one exists, 
		// returns it.  Else, it checks for media urls, and 
		// if one exists, it returns it.  Else, null.
		function getURL($theTweet) {

			$url_location = $theTweet['entities']['urls'][0];
			$media_location = $theTweet['entities']['media'][0];

			if (!(empty($url_location))) {

				return $url_location['expanded_url'];

			} else if (!(empty($media_location))) {

				return $media_location['media_url'];

			} else {

				return NULL;
			}
		}

		// Take tweet data, loop through tweets and create an associative array 
		// containing 'text', 'date', and 'url' keys
		foreach ($tweet_data as $tweet) {
			
			$url = getURL($tweet);

			array_push($tweet_stream, array(
				'text' => $tweet['text'],
				'date' => $tweet['created_at'],
				'url' => $url,
				'tweet_id' => $tweet['id_str'],
				'screen_name' => $tweet['user']['screen_name']
				));
		}

		print json_encode($tweet_stream);

	// Handle errors from API request
	} else {
		if ($http_code == 429) {
			print 'Error: Twitter API rate limit reached.';
		} else {
			print 'Error: Twitter was not able to process that request.';
		}
	}
}

?>