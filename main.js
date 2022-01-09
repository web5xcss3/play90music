(function($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $content = $('#content');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px']
    });

    // Play initial animations on page load.
    $body.addClass('is-preload');

    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 5000);
    });
  
    // Header.
    if ($header.hasClass('alt') &&
        $content.length > 0) {

        $window.on('load', function() {

            $content.scrollwatch({
                delay: 0,
                range: 0,
                anchor: 'top',
                on: function() {
                    $header.addClass('alt reveal');
                },
                off: function() {
                    $header.removeClass('alt');
                }
            });

        });

    }

    // Current page.
    $('#nav > ul > li a').on('click', function(event) {

        event.preventDefault();
        $('#nav > ul > li a').removeClass("current-item");
        $(this).addClass("current-item")
    });
  
  // SearchPanel.
		$('#searchPanel')
			.append('<a href="#searchPanel" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'searchPanel-visible'
			});
      
    // Filter Search.
	    $("#txtSearch").keyup(function(){
		    var texto = $(this).val();

		    $("li.list-data-item").css("display", "flex");
		    $("li.list-data-item").each(function(){
			    if($(this).text().toUpperCase().indexOf(texto.toUpperCase()) < 0)
			        $(this).css("display", "none");
		    });
	    });

})(jQuery);
