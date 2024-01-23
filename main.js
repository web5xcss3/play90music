/*
	Drift by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$main = $('#main'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ]
		});

	// Disable animations/transitions until the page has loaded.
		$body.addClass('is-preload');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 1000);
		});

	// Header.
	// If the header is using "alt" styling and #main is present, use scrollwatch
	// to revert it back to normal styling once the user scrolls past the main.
		if ($header.hasClass('alt')
		&&	$main.length > 0) {

			$window.on('load', function() {

				$main.scrollwatch({
					delay:		0,
					range:		0,
					anchor:		'top',
					on:			function() { $header.addClass('alt reveal'); },
					off:		function() { $header.removeClass('alt'); }
				});

			});

		}

		$('#main').simpleIframeView({
			container: '#song-player',
			maxCache: 2
		})

	// Off
		$(document).ready(function(){
			$(document).bind("contextmenu",function(e){
				return false;
			});
		});

		document.onkeydown = function(e) {
			if (e.ctrlKey && 
			(e.keyCode === 85 )) {
				return false;
			}
		};

	// Opened Player Bar.
        $('.image, .fa-play').on('click', function() {

            var openedPlayer = $('#player-bar');

			var showmorePlayer = $('#player-page');

            if (openedPlayer.hasClass('opened')) {
                $(this).attr('Hide');
            }

			else {
                openedPlayer.addClass('opened');
                $(this).attr('Show');
            }

			if (showmorePlayer.hasClass('showmore')) {
				showmorePlayer.removeClass('showmore');
                $(this).attr('Hide');
				$('.icon-arrow-down').css({
                    'transform': 'rotate(180deg)'
                });
            }

			else {
                showmorePlayer.addClass('showmore');
                $(this).attr('Show');
				$('.icon-arrow-down').css({
                    'transform': 'rotate(0deg)'
                });
            }

        });


    // Hide & Show Player Content.
        $('.icon-arrow-down').on('click', function() {

            var showmorePlayer = $('#player-page');

            if (showmorePlayer.hasClass('showmore')) {
                showmorePlayer.removeClass('showmore');
                $(this).attr('Hide');
				$('.icon-arrow-down').css({
                    'transform': 'rotate(180deg)'
                });
            } 

			else {
                showmorePlayer.addClass('showmore');
                $(this).attr('Show');
				$('.icon-arrow-down').css({
                    'transform': 'rotate(0deg)'
                });
            }

        });

})(jQuery);