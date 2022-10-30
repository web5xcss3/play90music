; (function ($) {
    $.fn.infiniteScroll = function (options) {

        var observer, filesControl = 0, settings;
        settings = $.extend({
            files: [],
            preloaderColor: "#fff",
            fadeDuration: 300,
            beforeLoadNewContent: function () { },
            processData: function(data){               
                var content = $(`<ul class="list-data" style='opacity:0'>${data}</ul>`);
                $('.' + settings.markSelector).before(content);
                content.fadeTo(settings.fadeDuration, 1);
            },
            afterLoadNewContent: function () { },
            onEnd: function () { }
        }, options);
        settings.markSelector;

        infiniteContentLoader = function (entry) {
            if (entry[0].isIntersecting && !$(".infiniteContentPreloader").is(":visible") && filesControl < settings.files.length) {
                $(".infiniteContentPreloader").toggle();
                $.ajax({
                    type: "GET", 
                    url:settings.files[filesControl], 
                    dataType: "html", 
                    success:function (data) {                  
                        settings.beforeLoadNewContent();
                        $(".infiniteContentPreloader").toggle();                   
                        settings.processData(data);
                        filesControl++;
                        settings.afterLoadNewContent();
                    }
                });
            } else if(entry[0].isIntersecting && !$(".infiniteContentPreloader").is(":visible") && filesControl >= settings.files.length) {
                observer.disconnect();
                settings.onEnd();
            }
        }

        infiniteScroll = function (element) {
            settings.markSelector = "infiniteContentMark_" + Date.now();
            var mark = `<div class="${settings.markSelector}" style="width: 100%;"></div>`
            $(element).append(mark);

            $(document).ready(function () {
                $('.' + settings.markSelector).html(`<div class="infiniteContentPreloader" style="display: none;">
                
                <div class="loader">
				    <svg class="circular-loader"viewBox="25 25 50 50" >
				        <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#aaa" stroke-width="4" />
				    </svg>
				</div>
                
                </div>`);

                if (!('IntersectionObserver' in window)) {
                    console.log("Intersection Observer API is not available");
                } else {
                    var options = {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0
                    }
                    observer = new IntersectionObserver(infiniteContentLoader, options);
                    var infiniteContentMark = $('.' + settings.markSelector).toArray()[0];
                    observer.observe(infiniteContentMark);
                }
            });
        }

        if (this.length > 0) {
            return infiniteScroll(this);
        }
    };
})(window.jQuery || window.Zepto || window.$);
