<?php 

if(isset($_POST['email'])) {

	require '/shared/test_input.php';

	$email_to = "VinnySanchez87@gmail.com";
	$email_subject = "New Message From a Visitor to Your Homepage";

	function died($error) {

		echo "Sorry, but there were errors found in the form you submitted.";
		echo "These errors appear below.<br/><br/>";
		echo $error."<br/><br>";
		echo "Please go back and fix these errors.<br/><br/>";
		die();
	}

	// Validate that expected data exists
	if(!isset($_POST['first_name']) ||
		!isset($_POST['last_name']) ||
		!isset($_POST['email']) ||
		!isset($_POST['comments'])) {
		died('Sorry, but there seems to be a problem with the form you submitted.');
	}

	$first_name = test_input($_POST['first_name']); // required
	$last_name = test_input($_POST['last_name']); // required
	$email_from = test_input($_POST['email']); // required
	$comments = test_input($_POST['comments']); // required

	$error_message = "";
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
	if(!preg_match($email_exp, $email_from)) {
		$error_message .= 'The email address you entered does not appear to be valid.<br/>';
	}
	$string_exp = "/^[A-Za-z\s.'-]+$/";
	if(!preg_match($string_exp, $first_name)) {
		$error_message .= 'The first name you entered does not appear to be valid.<br/>';
	}
	if(!preg_match($string_exp, $last_name)) {
		$error_message .= 'The last name you entered does not appear to be valid.<br/>';
	}
	if(strlen($comments) < 2) {
		$error_message .= 'The comments you entered do not appear to be valid.<br/>';
	}
	if(strlen($error_message) > 0) {
		died($error_message);
	}
	$email_message = "Form details below.\n\n";

	function clean_string($string) {
		$bad = array("content-type", "bcc:", "to:", "cc:", "href");
		return str_replace($bad, "", $string);
	}

	$email_message .= "First Name: ".clean_string($first_name)."\n";
	$email_message .= "Last Name: ".clean_string($last_name)."\n";
	$email_message .= "Email: ".clean_string($email_from)."\n";
	$email_message .= "Comments: ".clean_string($comments)."\n";

	// Create email headers
	$headers = 'From: '.$email_from."\r\n".
	'Reply-To: '.$email_from."\r\n" .
	'X-Mailer: PHP/' . phpversion();
	@mail($email_to, $email_subject, $email_message, $headers);
	sleep(1);
}

?>