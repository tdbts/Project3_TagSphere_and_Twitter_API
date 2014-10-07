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

	$('#tagButton').click(function() {
	
		addTag();
	});

	$('#customTag').keydown(function(e) {
		
		if (e.keyCode == 13) {

			addTag();
		}
	});

	function init() {
		var w = document.body.clientWidth, h = document.body.clientHeight;
		var clouder = document.getElementById('clouder');

		clouder.style.borderTop = "1px solid black";
		clouder.style.borderBottom = "1px solid black";
		clouder.style.width = w * 3 / 4;
		clouder.style.height = h * 3 / 4;
		clouder.style.position = "absolute";
		clouder.style.left = w / 6;
		clouder.style.top = h / 2;
		
		window.clouder = new Clouder({
			container: clouder,
			tags: userCloudTags,
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
		
		init();

		scrollDownTo('#clouder', 500);
	});

	$('#clearAll').click(function() {
		
		window.clouder.kill();
		userCloudTags = [];

		scrollUpToTop(500);
	});

});


