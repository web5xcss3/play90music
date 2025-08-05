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

    // Search.
    breakpoints.on('<=small', function() {
        $("#nav ul li a.fa-magnifying-glass").on("click.searchToggle", function(e) {
            e.preventDefault();
            $("#search").show();
            $("#searchInput").focus();
        });

        $(document).on("click.searchOutside", function(e) {
            const $search = $("#search");
            const $toggle = $("#nav ul li a.fa-magnifying-glass");

            if (
                !$search.is(e.target) &&
                $search.has(e.target).length === 0 &&
                !$toggle.is(e.target) &&
                $toggle.has(e.target).length === 0
            ) {
                $search.hide();
            }
        });
    });

    breakpoints.on('>small', function() {
        $("#nav ul li a.fa-magnifying-glass").off(".searchToggle");
        $(document).off(".searchOutside");
        $("#search").show();
    });

    // Menu toogle
    $(document).ready(function() {
        $(".menuToogle").on("click", function(e) {
            e.preventDefault();
            $("body").toggleClass("is-menu-visible");
        });

        $(document).on("click", function(e) {
            const $menu = $("#menu");
            const $toggle = $(".menuToogle");

            if (
                $("body").hasClass("is-menu-visible") &&
                !$menu.is(e.target) &&
                $menu.has(e.target).length === 0 &&
                !$toggle.is(e.target) &&
                $toggle.has(e.target).length === 0
            ) {
                $("body").removeClass("is-menu-visible");
            }
        });

        $("#menu").on("click", function(e) {
            e.stopPropagation();
        });
    });

    $(document).ready(function() {
        $('.toggle-dropdown').click(function(e) {
            e.preventDefault();
            $(this).next('.dropotron').toggleClass('dropdown-active');
            $('.dropotron').not($(this).next('.dropotron')).removeClass('dropdown-active');
        });

        $(document).click(function(e) {
            if (!$(e.target).closest('.toggle-dropdown, .dropotron').length) {
                $('.dropotron').removeClass('dropdown-active');
            }
        });
    });

    $(document).ready(function() {
        $('#toggleBanner').on('click', function() {
            const $image = $('#banner .image');
            $image.toggleClass('hidden');

            // Atualiza o texto do botão
            if ($image.hasClass('hidden')) {
                $(this).text('background Color');
            } else {
                $(this).text('background Image');
            }
        });
    });

})(jQuery);
