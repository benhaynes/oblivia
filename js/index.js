//////////////////////////////////////////////////////////////////////////////

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('load', this.onLoad, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	onLoad: function() {
		app.receivedEvent('onload');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
		console.log('Received Event: ' + id);
	}
};

//////////////////////////////////////////////////////////////////////////////

$(function() {

	// Variables
	var dots = [],
		questions_easy = [{question: 'Taphophobia is the fear of being what?', answers: ['Being buried alive', 'Being alone forever', 'Being wrapped in taffy', 'Being still']},
					{question: 'Which US state is named on the label of a Jack Daniels bottle?', answers: ['Tennessee', 'Kentucky', 'Indiana', 'Virginia']},
					{question: 'In US law enforcement agencies, what do the initials stand for in SWAT team?', answers: ['Special Weapons And Tactics', 'Special War Against Terror', 'Special Women\'s Assimilation Test', 'Special Wrongdoers\' Arrest Treatment']},
					{question: 'What is the van called in the Scooby Doo cartoon series?', answers: ['Mystery Machine', 'Adventure Wagon', 'Chiller Camper', 'Riddle Roadster']},
					{question: 'What is the name of Batman\'s butler?', answers: ['Alfred', 'Archibald', 'Wilfred', 'Jeeves']},
					{question: 'Which Apollo mission landed the first humans on the Moon?', answers: ['Apollo 11', 'Apollo 7', 'Apollo 9', 'Apollo 13']}]
		questions_moderate = [{question: 'Who starred in the 1959 epic film Ben-Hur?', answers: ['Charlton Heston', 'Clark Gable', 'Errol Flynn', 'Lee Marvin']},
					{question: 'What is the International Air Transport Association airport code for Heathrow Airport?', answers: ['LHR', 'HRW', 'HTR', 'LHW']},
					{question: 'Which spirit is used to make a Lemon Drop cocktail?', answers: ['Vodka', 'Gin', 'Rum', 'Tequila']},
					{question: 'Who plays the title role in the 2008 superhero film Iron Man?', answers: ['Robert Downey Jr', 'Christian Bale', 'Brendan Fraser', 'Mark Wahlberg']},
					{question: 'Something described as \'tactile\' means that it relates to which of the senses?', answers: ['Touch', 'Taste', 'Sight', 'Hearing']},
					{question: 'Who plays Lara Croft in the Tomb Raider series of films?', answers: ['Angelina Jolie', 'Jennifer Aniston', 'Megan Fox', 'Natalie Portman']}]
		questions_difficult = [{question: 'What is the deepest part of the Atlantic Ocean called?', answers: ['The Puerto Rico Trench', 'The Panama Trench', 'The Paraguay Trench', 'The Peruvian Trench']},
					{question: 'Within which Italian city does the Vatican City lie?', answers: ['Rome', 'Milan', 'Naples', 'Venice']},
					{question: 'What is the name of the fictional manager in The Office?', answers: ['David Brent', 'Peter Gent', 'Michael Trent', 'Roger Lent']},
					{question: 'Oceans hold what percentage of the Earth\'s surface water?', answers: ['97%', '87%', '77%', '67%']},
					{question: 'Vermillion is a shade of which color?', answers: ['Red', 'Green', 'Blue', 'Yellow']},
					{question: 'If something coruscates, what does it do?', answers: ['Sparkles', 'Shrinks', 'Fades', 'Expands']},
					{question: 'Which monarch was on the throne during the Great Fire of London?', answers: ['Charles II', 'Charles I', 'James II', 'William III']},
					{question: 'Yellow Egg is a variety of which fruit?', answers: ['Plum', 'Apricot', 'Melon', 'Lemon']},
					{question: 'From which language do we get the word \'safari\'?', answers: ['Swahili', 'Greek', 'Latin', 'Turkish']},
					{question: 'In Greek mythology, Erebus was the god of what?', answers: ['Darkness', 'Forests', 'Mountains', 'Water']}]
		screen_width = $(window).width(),
		screen_height = $(window).height(),
		drawer_height = 74, // Height of normal drawer in px
		level_width = 9, // Dots in level
		level_height = 14, // Dots in level
		world_width = 3, // Level in world
		world_height = 3, // Level in world
		dot_cols = level_width * world_width, // Dots in world
		dot_rows = level_height * world_height, // Dots in world
		dot_padding = 10,
		world_width_px = ((screen_width * world_width) - 40),
		world_height_px = (((screen_height - drawer_height) * world_height) - 20),
		dot_container_width = world_width_px / dot_cols, // Calculate dot size and dimensions
		dot_container_height = world_height_px / dot_rows, // Calculate dot size and dimensions
		dot_container_size = Math.min(dot_container_width, dot_container_height), // Size dots based on screen ratio (what fits)
		dot_size = Math.round(dot_container_size - dot_padding),
		dot_spacing = Math.round(dot_size),
		map = $('.map'),
		avatar = 'chuck',
		mapSpawn = false,
		playerPosition = {"col":3, "row":1},
		playerMove = {"col":3, "row":1},
		fogRange = 5,
		loader = document.getElementById('timer'), 
		α = 360, 
		π = Math.PI, 
		timerSpeed = 1000,
		gamePause = false; // 300 = 5 min

	//////////////////////////////////////////////////////////////////////////////

	// Map setup
	map.css('width', (dot_cols * dot_container_size) + 10)
	   .css('height', (dot_rows * dot_container_size) + 10);

	// Dots setup
	for (var row = 1; row <= dot_rows; row++) {
		dots[row] = [];
		for (var col = 1; col <= dot_cols; col++) {
			var dot = $('<div class="dot default" data-row="'+row+'" data-col="'+col+'"></div>');
			var rand_opacity = (Math.floor(Math.random() * 100) + 1) / 100;
			rand_opacity = 0.2;
			dots[row][col] = [];
			dots[row][col]['dot'] = dot;
			map.append(dot);
			dot.css('top', (row-1)*dot_container_size)
			   .css('left', (col-1)*dot_container_size)
			   .css('width', dot_size)
			   .css('height', dot_size)
			   .css('opacity', rand_opacity);
		}
	};

	// Intro transitions
	$(window).load(function() {
		$('.fade-in-1').removeClass('nopacity');
		setTimeout(function(){
			$('.choose-character-title').removeClass('nopacity');
			$('.choose-character').scrollLeft(400);
			$('.choose-character').animate({scrollLeft: 0}, 1000);
			$('.drawer').removeClass('drawer-full').addClass('drawer-peek');
			hideElement($(this));
		},1000);
	});

	// Player has chosen an avatar
	$('.character-start').on("click", function() {
		avatar = $(this).data('avatar');
		showAlert('<h1>Hurry '+capitalizeFirstLetter(avatar)+'!</h1>Time\'s running out – get to that yellow thing before it leaves you behind!<br><br>Remember, while it\'s easy to travel across grass, swimming is a bit trickier, and the stone mountains can be quite difficult – so choose your path wisely!<button class="red start-game">Got it!</button>');
	});

	$('.alert').on("click", '.start-game', function() {
		hideAlert();

		positionPlayer();
		toggleGlobal();
		$('.choose-character-title').addClass('nopacity');
		$('.drawer').removeClass('drawer-peek');
		$('.planet').removeClass('hidden');
		$('.timer-bg').removeClass('hidden');
		hideElement($('.tagline'));
		hideElement($('.choose-character'));

		setTimeout(function(){
			toggleGlobal();
			startTimer();
		}, 4000);
	});

	// Toggles the global map
	$('.planet').on("click", function() {
		toggleGlobal();
	});

	// Player clicks an adjacent dot (not completed)
	$('.map').on("click", ".dot.active", function() {
		playerMove = {"col":$(this).data('col'), "row":$(this).data('row')};
		loadQuestion();
	});

	// Player gives their quiz answer
	$('.answer').on("click", function() {
		$('.quiz').addClass('answered');
		if($(this).hasClass('correct')){
			playerPosition = playerMove;
			positionPlayer();
		} else {
			dots[playerMove.row][playerMove.col]['dot'].addClass('incorrect');
			playerMove = playerPosition;
			positionPlayer();
		}
		setTimeout(function(){
			$('.drawer').removeClass('drawer-peek');
			hideElement($('.quiz'));
			$('.quiz').removeClass('answered');
		}, 2000);
	});

	//////////////////////////////////////////////////////////////////////////////
	// Game timer

	function startTimer() {
		α--;
		α %= 360;
		var r = ( α * π / 180 ), 
			x = Math.sin( r ) * 125, 
			y = Math.cos( r ) * - 125, 
			mid = ( α > 180 ) ? 1 : 0, 
			anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' +  x  + ' ' +  y  + ' z';
		//[x,y].forEach(function( d ){
		//  d = Math.round( d * 1e3 ) / 1e3;
		//});

		loader.setAttribute('d', anim);
		if (gamePause){
			// TODO
		} else if(α <= 0){
			α = 360;
			showAlert('<h1>Time\'s Up!</h1>The boat has left... without you. Would you like to try again?<button class="red">Play Again</button>');
			$('.time-left').text('').addClass('hidden');
		} else {
			//if(α < 30){
				$('.time-left').text(formatSeconds(α)).removeClass('hidden');
			//}
			setTimeout(startTimer, timerSpeed); // Redraw
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// Alert

	function showAlert(txt) {
		$('.alert').html(txt).removeClass('hidden');
		$('.alert-bg').removeClass('hidden');
	}

	function hideAlert() {
		$('.alert').addClass('hidden');
		$('.alert-bg').addClass('hidden');
	}

	//////////////////////////////////////////////////////////////////////////////
	// Win

	function youWin() {
		gamePause = true;
		showAlert('<h1>You Won!</h1>Congratulations, you\'ve made it to the boat before it left! Would you like to play again?<button class="red">Play Again</button>');
	}

	//////////////////////////////////////////////////////////////////////////////
	// Toggle global map

	function toggleGlobal() {
		$('.map').toggleClass('global');

		if($('.map').hasClass('global')){
			$('.player').addClass('animate').removeClass('opacity').addClass('nopacity').addClass('hidden');
			$('.planet').attr('src', 'img/images-svg/character_'+avatar+'.svg').addClass('small');
		} else {
			$('.planet').attr('src', 'img/images-svg/planet.svg').removeClass('small');
			showElement($('.player'), 500);
		}
	}
	//////////////////////////////////////////////////////////////////////////////
	// Load Question

	function loadQuestion() {
		// Difficulty
		if(dots[playerMove.row][playerMove.col]['dot'].hasClass('win')){
			youWin();
			return false;
		} else if(dots[playerMove.row][playerMove.col]['dot'].hasClass('stone')){
			questions = questions_difficult;
		} else if(dots[playerMove.row][playerMove.col]['dot'].hasClass('water')) {
			questions = questions_moderate;
		} else {
			questions = questions_easy;
		}

		// Randomize qnswer order
		var answerOrder = [1,2,3,4];
		shuffle(answerOrder);

		// Clear old answers
		$('.answer').removeClass('correct');

		// Get random question from difficulty level
		var question = questions[Math.floor(Math.random()*questions.length)];

		// Fill in the question/answers
		$('.question').text(question.question);
		$('.answer-'+answerOrder[0]+' .answer-text').text(question.answers[0]).parent().addClass('correct');
		$('.answer-'+answerOrder[1]+' .answer-text').text(question.answers[1]);
		$('.answer-'+answerOrder[2]+' .answer-text').text(question.answers[2]);
		$('.answer-'+answerOrder[3]+' .answer-text').text(question.answers[3]);

		$('.title').addClass('sticky');
		$('.drawer').addClass('drawer-peek');
		showElement($('.quiz'), 100);
		$('.title').addClass('sticky');
	}

	//////////////////////////////////////////////////////////////////////////////
	// Position player

	function positionPlayer(active) {
		// Defaults
		active = typeof active !== 'undefined' ? active : true;

		// playerPosition = {"col":col, "row":row};
		row = playerPosition.row;
		col = playerPosition.col;

		// Update avatar
		$('.player img').attr('src', 'img/images-svg/character_'+avatar+'.svg');
		
		// Position
		$('.player').css('top', (row-1)*dot_container_size + 30)
			   .css('left', (col-1)*dot_container_size + 20)
			   .css('width', dot_size)
			   .css('height', dot_size);
		$('.player .character-bg').css('width', dot_size)
			   .css('height', dot_size);

		dots[row][col]['dot'].addClass('won');

		// Reveal adjacent map (fog of war)
		fogOfWar(fogRange);

	}

	//////////////////////////////////////////////////////////////////////////////
	// Build map

	var mapData = [];

	function loadMap(mapData) {
		// for (var row = 1; row <= dot_rows; row++) {
		// 	for (var col = 1; col <= dot_cols; col++) {
		// 		var dot = dots[row][col]['dot'];
		// 		var terrain_chance = (Math.floor(Math.random() * 100) + 1);
		// 		if(terrain_chance < 50){
		// 			var terrain = 'grass';
		// 		} else if(terrain_chance < 90){
		// 			var terrain = 'water';
		// 		} else {
		// 			var terrain = 'stone';
		// 		}
		// 		dot.css('opacity', 1).addClass(terrain);
		// 	}
		// };

		if($('.dot.win').length <= 0){
			var win_row = Math.floor(Math.random() * dot_rows) + 1;
			var win_col = Math.floor(Math.random() * dot_cols) + 1;
			var win_dot = dots[win_row][win_col]['dot'];

			win_dot.addClass('win').css('opacity', 1);
		}

		mapSpawn = setInterval(function(){
			var terrain_chance = (Math.floor(Math.random() * 100) + 1);
			if(terrain_chance < 70){
				var terrain = 'grass';
			} else if(terrain_chance < 90){
				var terrain = 'water';
			} else {
				var terrain = 'stone';
			}
			var dot = $('.dot.default.visible').random();
			dot.removeClass('default').addClass(terrain).css('opacity', 1);

			if($('.dot.default.visible').length <= 0){
				clearInterval(mapSpawn);
			}
		}, 100);
	}

	function fogOfWar(max_range){
		$('.dot').removeClass('active').removeClass('fringe');
		for(row = 1; row <= dot_rows; row++){
			for(col = 1; col <= dot_cols; col++){
				var range = Math.abs(row - playerPosition.row) + Math.abs(col - playerPosition.col);
				if(range <= max_range){

					// Round fog corners
					if (Math.abs(row - playerPosition.row) != max_range && Math.abs(col - playerPosition.col) != max_range){

						dots[row][col]['dot'].addClass('visible').attr('data-range', range);
						if(range == 1){
							if(!dots[row][col]['dot'].hasClass('won')){
								if(!dots[row][col]['dot'].hasClass('incorrect')){
									dots[row][col]['dot'].addClass('active');
								}
							}
						}
						if(range == max_range || Math.abs(row - playerPosition.row) == (max_range-1) || Math.abs(col - playerPosition.col) == (max_range-1)){
							dots[row][col]['dot'].addClass('fringe');
						}
					}
				}
			}
		}
		loadMap(1);
	}

	//////////////////////////////////////////////////////////////////////////////
	// Helper functions

	function shuffle(o){
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	$.fn.random = function() {
		return this.eq(Math.floor(Math.random() * this.length));
	}

	function formatSeconds(sec_num) {
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		//if (hours   < 10) {hours   = "0"+hours;}
		//if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = minutes+':'+seconds; // hours+':'+
		return time;
	}

	function hideElement(el){
		el.addClass('animate').removeClass('opacity').addClass('nopacity');
		setTimeout(function(){
			el.addClass('hidden');
		}, 400); // Must >= the fadeout value
	}
	function showElement(el, delay){
		delay = typeof delay !== 'undefined' ? delay : 0;
		el.removeClass('hidden');
		setTimeout(function(){
			el.removeClass('nopacity');
		}, delay); // Delay until show
	}

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	//////////////////////////////////////////////////////////////////////////////
	// Replace all SVG images with data for color changes

	// jQuery('img.svg').each(function(){
	// 	var $img = jQuery(this);
	// 	var imgID = $img.attr('id');
	// 	var imgClass = $img.attr('class');
	// 	var imgURL = $img.attr('src');

	// 	jQuery.get(imgURL, function(data) {
	// 		// Get the SVG tag, ignore the rest
	// 		var $svg = jQuery(data).find('svg');

	// 		// Add replaced image's ID to the new SVG
	// 		if(typeof imgID !== 'undefined') {
	// 			$svg = $svg.attr('id', imgID);
	// 		}
	// 		// Add replaced image's classes to the new SVG
	// 		if(typeof imgClass !== 'undefined') {
	// 			$svg = $svg.attr('class', imgClass+' replaced-svg');
	// 		}

	// 		// Remove any invalid XML tags as per http://validator.w3.org
	// 		$svg = $svg.removeAttr('xmlns:a');

	// 		// Replace image with new SVG
	// 		$img.replaceWith($svg);

	// 	}, 'xml');

	// });

	//////////////////////////////////////////////////////////////////////////////
});

