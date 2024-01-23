/**
 * jQuery fillColor Plugin
 * Author: bashkos
 *
 * Based on https://github.com/krustnic/site-preview-yandex-style
 * by Mityakov Aleksandr (krustnic)
 *
 * License: MIT
 *
 * https://github.com/bashkos/jquery.fillcolor
 *
 * Version: 1.0.2
 */

(function($) {

    'use strict';

    $(function() {
        $('.image,.fillcolor').fillColor();
		// $('.image,.fillcolor').fillColor({ type: 'avgYUV' });
    });

})(jQuery);