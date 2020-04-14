(function($) {

    $.randomImage = {
        defaults: {

            path: 'https://i.ibb.co',
            myImages: [{
                    src: '/mHfPDR4/ace-of-base.jpg',
                    title: "Ace Of Base"
                },
                {
                    src: '/ZdnXw9q/2-unlimited.jpg',
                    title: "2 Unlimited"
                },
                {
                    src: '/FXvbbtc/aqua.jpg',
                    title: "Aqua"
                },
                {
                    src: '/wSLF4HD/cappella.jpg',
                    title: "Cappella"
                },
                {
                    src: '/qj0gmG7/culture-beat.jpg',
                    title: "Culture Beat"
                },
                {
                    src: '/5jjkRp7/dj-bobo.jpg',
                    title: "DJ Bobo"
                },
                {
                    src: '/qrLcRqD/e-rotic.jpg',
                    title: "E-Rotic"
                },
                {
                    src: '/f9nJhgr/dr-alban.jpg',
                    title: "Dr.Alban"
                },
                {
                    src: '/DtRvFxQ/e-type.jpg',
                    title: "E-Type"
                },
                {
                    src: '/Hpks31b/ice-mc.jpg',
                    title: "Ice Mc"
                },
                {
                    src: '/6JMYjR5/haddaway.jpg',
                    title: "Haddaway"
                },
                {
                    src: '/xhNzj79/labouche.jpg',
                    title: "Labouche"
                },
                {
                    src: '/vjgCmGd/masterboy.jpg',
                    title: "Masterboy"
                },
                {
                    src: '/sVf86Dc/vengaboys.jpg',
                    title: "Vengaboys"
                }
            ]

        }
    }

    $.fn.extend({
        randomImage: function(config) {
            var config = $.extend({}, $.randomImage.defaults, config);

            return this.each(function() {

                var imageNames = config.myImages;
                var imageNamesSize = imageNames.length;
                var lotteryNumber = Math.floor(Math.random() * imageNamesSize);
                var winnerImage = imageNames[lotteryNumber].src;
                this.title = config.myImages[lotteryNumber].title;
                $(this).after("<h2>" + this.title + "</h2>");
                var fullPath = config.path + winnerImage;

                $(this).attr({
                    src: fullPath,
                    alt: winnerImage
                });

            });
        }
    });

})(jQuery);

$(".artists").randomImage();
