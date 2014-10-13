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
	$twitter_handle = test_input($_GET['q']);

	// Create OAuth connection
	require 'app_tokens.php';
	require 'tmhOAuth.php';
	$connection = new tmhOAuth(array(
		'consumer_key' => $consumer_key,
		'consumer_secret' => $consumer_secret,
		'user_token' => $user_token,
		'user_secret' => $user_secret
		));

	// Get the 10 most recent tweets using Twitter API
	$http_code = $connection->request('GET',$connection->url('1.1/statuses/user_timeline'),
		array('screen_name'=>$twitter_handle,
			'count'=>10));

	// Request was successful
	if ($http_code == 200) {

		// Extract the tweets from the API response
		$tweet_data = json_decode($connection->response['response'],true);

		// Accumulate tweets from results
		$tweet_stream = array();
		
		foreach($tweet_data as $tweet) {
			
			array_push($tweet_stream, array(
				'text' => $tweet['text'], 
				'date' => $tweet['created_at']
				));
		}

		print json_encode($tweet_stream);
	
	// Handle errors from API request
	}else{
		if ($http_code == 429) {
			print 'Error: Twitter API rate limit reached.';
		}else{
			print 'Error: Twitter was not able to process that request.';
		}
	}
}

?>