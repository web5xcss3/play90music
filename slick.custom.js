(function(jQuery) {

    "use strict";

    jQuery(document).ready(function() {

        jQuery('#banner').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.recent'
        });

        jQuery('.recent').slick({
            focusOnSelect: true,
            infinite: true,
            slidesToShow: 4,
            speed: 300,
            slidesToScroll: 1,
            asNavFor: '#banner',
            appendArrows: $('#slick-nav'),
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
                        slidesToScroll: 5,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3.5,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2.2,
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
            slidesToScroll: 6,
            appendArrows: $('#playlists-slick-arrow'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 5,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3.5,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2.2,
                        slidesToScroll: 2,
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
            slidesToScroll: 6,
            appendArrows: $('#artists-slick-arrow'),
            responsive: [{
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 5,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 3.5,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 736,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2.2,
                        slidesToScroll: 2,
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
