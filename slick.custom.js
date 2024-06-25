(function(jQuery) {

    "use strict";

    jQuery(document).ready(function() {

       const $recent = $('.recent');
	const $banner = $('#banner');

	function updateBgImage(slick, currentSlide) {
		const imgbg = slick.$slides.eq(currentSlide).find('img').attr('src');
		$banner.fadeOut('fast', function() {
			$banner.css('background-image', 'url(' + imgbg + ')');
			$banner.fadeIn('slow');
		});
	}

	$recent.on('init', function(event, slick) {
		setBackgroundImage(slick, 0);
	});

	$recent.on('afterChange', function(event, slick, currentSlide) {
		setBackgroundImage(slick, currentSlide);
	});

        jQuery('.recent').slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 4,
            speed: 300,
            slidesToScroll: 1,
            appendArrows: $('#slick-nav'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                }
            ],
            nextArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_right</span></a></li></ul>',
            prevArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_left</span></a></li></ul>',
        });

        jQuery('.timeline').slick({
            infinite: false,
            slidesToShow: 5,
            speed: 300,
            slidesToScroll: 1,
            appendArrows: $('#timeline-slick-nav'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                }
            ],
            nextArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_right</span></a></li></ul>',
            prevArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_left</span></a></li></ul>',
        });

        jQuery('.playlists').slick({
            infinite: false,
            slidesToShow: 6,
            speed: 300,
            slidesToScroll: 1,
            appendArrows: $('#playlists-slick-arrow'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                }
            ],
            nextArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_right</span></a></li></ul>',
            prevArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_left</span></a></li></ul>',
        });

        jQuery('.artists').slick({
            infinite: false,
            slidesToShow: 6,
            speed: 300,
            slidesToScroll: 1,
            appendArrows: $('#artists-slick-arrow'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                }
            ],
            nextArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_right</span></a></li></ul>',
            prevArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_left</span></a></li></ul>',
        });

        jQuery('.t').slick({
            infinite: false,
            slidesToShow: 2,
            speed: 300,
            slidesToScroll: 2,
            appendArrows: $('#top-nav'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.2,
                        slidesToScroll: 1,
                        // vertical: true,
                        // verticalSwiping: true,
                    }
                }
            ],
			nextArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_right</span></a></li></ul>',
            prevArrow: '<ul class="icons"><li><a class="md-ripples ripples-light material"><span class="material-symbols-outlined">chevron_left</span></a></li></ul>',
        });

    });

})(jQuery);
