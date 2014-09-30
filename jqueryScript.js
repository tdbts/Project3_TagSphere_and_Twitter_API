$(document).ready(function() {
	var userCloudTags = [];

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

		var w = document.body.clientWidth;
		var h = document.body.clientHeight;
		var clouder = document.getElementById('clouder');

		clouder.style.border = "1px solid black";
		clouder.style.width = w * 2 / 3;
		clouder.style.height = h * 2 / 3;
		clouder.style.position = "absolute";
		clouder.style.left = w / 6;
		clouder.style.top = h / 6;
		
		window.clouder = new Clouder({
			container: clouder,
			tags: userCloudTags
		});
	}

	$('#drawCloud').click(function() {
		
		init();
	});

});


