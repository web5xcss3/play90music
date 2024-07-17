(function($) {

	var $window = $(window),
		$body = $('body'),
		$banner = $('#banner'),
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
			}, 100);
		});

	// Header.
	// If the header is using "alt" styling and #banner is present, use scrollwatch
	// to revert it back to normal styling once the user scrolls past the banner.
		if ($header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollwatch({
					delay:		0,
					range:		0,
					anchor:		'top',
					on:			function() { $header.addClass('alt reveal'); },
					off:		function() { $header.removeClass('alt'); }
				});

				breakpoints.on('<=medium', function() {
					$banner.scrollwatchSuspend();
				});

				breakpoints.on('>medium', function() {
					$banner.scrollwatchResume();
				});

			});

		}
		
		$('.landing').simpleIframeView( {
			container: '#song-player', 
			maxCache: 1
		});

	// Player Bar Info.
		$('.image').on('click', function(event) {

	        event.preventDefault();

	        var $this = $(this);
	        var title = $this.closest('.post').find('h3').text() || 'No title';
	        var subTitle = $this.closest('.post').find('p').text() || 'Play 90 Music •';
	        var cover = $this.closest('.post').find('img').attr('src') || 'image/vinyl.svg';

	        if (title && cover && subTitle) {
	            $('#artist').text(title);
	            $('#name').text(subTitle);
	            $('#cover').css('background-image', 'url(' + cover + ')');
	        }

	    });

		$('.image img').click(function(){
 			var imgbg = $(this).attr('src');
			//console.log(imgbg);
			$('#bg').css({backgroundImage: "url("+imgbg+")"});
		});

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

	// Default Image.
		$('img').each(function() {
			var img = $(this);
			if (img.attr('src') === '') {
				img.attr('src', 'https://od.lk/s/NV8xOTcxNDEwNzVf/vinyl.svg');
			}
		});

	// Ajax Load.
		$(document).ready(function() {

			$('.image').click(function(e) {
				e.preventDefault();
				loadContent($(this).attr('data-src'));
			});

			function loadContent(url) {
				$.ajax({
					url: url,
					success: function(response) {
						$('#side-panel').html(response);
					},
					error: function(xhr, status, error) {
						console.error(error);
					}
				});
			}

		});

})(jQuery);
