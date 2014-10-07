<?php 

if (!empty($_GET['q'])){

	// Strip any dangerous text out of the search
	$search_terms = htmlspecialchars($_GET['q']);

	// Create OAuth connection
	require 'app_tokens.php';
	require 'tmhOAuth.php';
	$connection = new tmhOAuth(array(
		'consumer_key' => $consumer_key, 
		'consumer_secret' => $consumer_secret, 
		'user_token' => $user_token, 
		'user_secret' => $user_secret
		));

	// Run the search with the Twitter API
	$http_code = $connection->request('GET', $connection->url('1.1/search/tweets'), 
		array('q' => $search_terms, 
			'count' => 100, 
			'lang' => 'en', 
			'type' => 'recent'));

	// Search was successful
	if ($http_code == 200) {

		$response = json_decode($connection->response['response'],true);
		$tweet_data = $response['statuses'];
		$tweet_stream = '';

		function PrintR($var) {
			echo '<pre>';
			print_r($var);
			echo '</pre>';
		}

		foreach($tweet_data as $tweet) {

			$tweet_stream .= PrintR($tweet) . '<br/><br/>';
		}

		print $tweet_stream;
	

	// Handle errors from API request
	}else{
		if($http_code == 429) {
			print 'Error: Twitter API rate limit reached';
		}else{
			print 'Error: Twitter was not able to process that search';
		}
	}
}else{
	print 'No search terms found';
}

?>