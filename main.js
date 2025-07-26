(function($) {

    var $window = $(window),
        $body = $('body'),
        $banner = $('#banner'),
        $header = $('#header'),
        $menu = $('#menu');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px']
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
    function setupScrollWatch() {

        if (($header.hasClass('alt') || $menu.hasClass('alt')) && $banner.length > 0) {
            $window.on('load', function() {
                $banner.scrollwatch({
                    delay: 0,
                    range: 0,
                    anchor: 'top',
                    on: function() {
                        $header.addClass('alt reveal');
                        $menu.addClass('alt reveal');
                    },
                    off: function() {
                        $header.removeClass('alt');
                        $menu.removeClass('alt');
                    }
                });
            });
        }
    };

    setupScrollWatch();

    // Menu.
    $menu
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-menu-visible'
        });

})(jQuery);
