$(document).ready(function() {
	var userCloudTags = [];

	$('#header').fadeOut(700).fadeIn(700);

	// if (typeof(Storage) !== "undefined") {

	// }
	// else {
	// 	alert("Your browser does not support local storage.  \n
	// 		Some parts of this webpage may not work for you.")
	// }
	
	$('#tagButton').click(function() {
		
		var userText = $('#customTag').val();
		console.log("You typed: " + userText);

		if (typeof(Storage) !== "undefined") {
			if (userText.length !== 0) {
				var newUserLittleObject = createObjectForCloud(userText, userCloudTags);
				console.log("newUserLittleObject is: ");
				console.log(newUserLittleObject);
				userCloudTags.push(newUserLittleObject);
				localStorage.setItem("cloudTags", userCloudTags);
			}
		}
		else {
			// Alternative code here...
		}

	});

});

// $(document).ready(function() {

// 	// function init() {
// 	// 	var w = document.body.clientWidth, h = document.body.clientHeight;
// 	// 	var clouder = document.getElementById('clouder');

// 	// 	clouder.style.border = "1px solid black";
// 	// 	clouder.style.width = w * 2 / 3;
// 	// 	clouder.style.height = h * 2 / 3;
// 	// 	clouder.style.position = "absolute";
// 	// 	clouder.style.left = w / 6;
// 	// 	clouder.style.top = h / 6;

// 	$('#tagButton').click(function() {
// 		alert("You typed: " + $('#customTag').val());
// 	});

// 	}

// });