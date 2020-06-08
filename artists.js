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
                },
				{
                    src: '/8b8wbJj/2-Eivissa.jpg',
                    title: "2 Eivissa"
                },
				{
                    src: '/tPXTm7n/2-Brothers-On-The-4th-Floor.jpg',
                    title: "2 Brothers On The 4th Floor"
                },
				{
                    src: '/cNCWm5t/2-Fabiola.jpg',
                    title: "2 Fabiola"
                },
				{
                    src: '/GsWBqss/2-For-Love.jpg',
                    title: "2 For Love"
                },
				{
                    src: '/gvnS3Qn/2-Raff.jpg',
                    title: "2 Raff"
                },
				{
                    src: '/WgVDQX9/3-O-Matic.jpg',
                    title: "3-O Matic"
                },
				{
                    src: '/C26Rtdw/20-Fingers.jpg',
                    title: "20 Fingers"
                },
				{
                    src: '/HY1fC4h/740-Boyz.jpg',
                    title: "740 Boyz"
                },
				{
                    src: '/cxMXcRt/AB-Logic.jpg',
                    title: "AB Logic"
                },
				{
                    src: '/645HR1y/Activate.jpg',
                    title: "Activate"
                },
				{
                    src: '/pjLC9jb/Alexia.jpg',
                    title: "Alexia"
                },
				{
                    src: '/f9xd8Sy/Amber.jpg',
                    title: "Amber"
                },
				{
                    src: '/Qr5Pwj7/Antares.jpg',
                    title: "Antares"
                },
				{
                    src: '/cXYYxQ6/B-G-The-Prince-Of-Rap.jpg',
                    title: "B.G. The Prince Of Rap"
                },
				{
                    src: '/nR9P0bB/Bad-Boys-Blue.jpg',
                    title: "Bad Boys Blue"
                },
				{
                    src: '/n6FVcBh/Bananarama.jpg',
                    title: "Bananarama"
                },
				{
                    src: '/P1ZbBrH/Basic-Element.jpg',
                    title: "Basic Element"
                },
				{
                    src: '/WPcYnFW/Bass-Bumpers.jpg',
                    title: "Bass Bumpers"
                },
				{
                    src: '/Ydv8kxR/Black-Box.jpg',
                    title: "Black Box"
                },
				{
                    src: '/ftMtmjq/Blue-System.jpg',
                    title: "Blue System"
                },
				{
                    src: '/RPBcfdV/Bushman.jpg',
                    title: "Bushman"
                },
				{
                    src: '/dJMzNPh/C-C-Music-Factory.jpg',
                    title: "C+C Music Factory"
                },
				{
                    src: '/7W13tnY/Cabballero.jpg',
                    title: "Cabballero"
                },
				{
                    src: '/SydmwTF/Captain-Hollywood-Project.jpg',
                    title: "Captain Hollywood Project"
                },
				{
                    src: '/d0M351s/Captain-Jack.jpg',
                    title: "Captain Jack"
                },
				{
                    src: '/TK3CWrQ/Captain-Sound.jpg',
                    title: "Captain Sound"
                },
				{
                    src: '/nP35qGB/Cardenia.jpg',
                    title: "Cardenia"
                },
				{
                    src: '/V2ZTHG8/Cartouche.jpg',
                    title: "Cartouche"
                },
				{
                    src: '/7bbvxBJ/CB-Milton.jpg',
                    title: "CB Milton"
                },
				{
                    src: '/tqDgYGK/Centory.jpg',
                    title: "Centory"
                },
				{
                    src: '/M7LhLnq/Clock.jpg',
                    title: "Clock"
                },
				{
                    src: '/Kj7xdrV/Cool-James-amp-Black-Teacher.jpg',
                    title: "Cool James & Black Teacher"
                },
				{
                    src: '/NVYyFkT/Corona.jpg',
                    title: "Corona"
                },
				{
                    src: '/Bz0Kw63/Da-Blitz.jpg',
                    title: "Da Blitz"
                },
				{
                    src: '/jJT78wQ/Dj-Company.jpg',
                    title: "Dj Company"
                },
				{
                    src: '/TRPwPfH/Double-Vision.jpg',
                    title: "Double Vision"
                },
				{
                    src: '/9GyvpHM/Double-You.jpg',
                    title: "Double You"
                },
				{
                    src: '/vkbG1tV/Emjay.jpg',
                    title: "Emjay"
                },
				{
                    src: '/LtKCHzL/Eurogroove.jpg',
                    title: "Eurogroove"
                },
				{
                    src: '/grDXdxG/Fish-In-Zone.jpg',
                    title: "Fish In Zone"
                },
				{
                    src: '/5KMcbGT/Fourteen-14.jpg',
                    title: "Fourteen 14"
                },
				{
                    src: '/j5ydWG7/Flexx.jpg',
                    title: "Flexx"
                },
				{
                    src: '/mBx46Ch/Fun-Factory.jpg',
                    title: "Fun Factory"
                },
				{
                    src: '/7WPbtc7/General-Base.jpg',
                    title: "General Base"
                },
				{
                    src: '/FswcdZf/Gottsha.jpg',
                    title: "Gottsha"
                },
				{
                    src: '/JcN4tvt/Indiana.jpg',
                    title: "Indiana"
                },
				{
                    src: '/RSNv5vY/J-K.jpg',
                    title: "J.K"
                },
				{
                    src: '/L6k9tpc/Janal.jpg',
                    title: "Janal"
                },
				{
                    src: '/WkgzLV6/Jinny.jpg',
                    title: "Jinny"
                },
				{
                    src: '/1ZvKwJw/JK.jpg',
                    title: "J.K"
                },
				{
                    src: '/2FvT8tk/Joy-Salinas.jpg',
                    title: "Joy Salinas"
                },
				{
                    src: '/9VrZZG0/Ken-Laszlo.jpg',
                    title: "Ken Laszlo"
                },
				{
                    src: '/nCQLK3R/Kikka.jpg',
                    title: "Kikka"
                },
				{
                    src: '/H2sByxq/Kim-Sanders.jpg',
                    title: "Kim Sanders"
                },
				{
                    src: '/n3RhfwR/Le-Click.jpg',
                    title: "Le Click"
                },
				{
                    src: '/GsVrtfC/Loft.jpg',
                    title: "Loft"
                },
				{
                    src: '/CHBXhHC/M-C-Sar-amp-The-Real-Mc-Coy.jpg',
                    title: "M.C. Sar & The Real McCoy"
                },
				{
                    src: '/jRyPHZb/Magic-Affair.jpg',
                    title: "Magic Affair"
                },
				{
                    src: '/9hM4crw/Max.jpg',
                    title: "Maxx"
                },
				{
                    src: '/n0JTwMT/MC-Eric-amp-Barbara.jpg',
                    title: "MC Eric & Barbara"
                },
				{
                    src: '/QfB8JRH/Me-amp-My.jpg',
                    title: "Me & My"
                },
				{
                    src: '/fYGWgDy/Modern-Talking.jpg',
                    title: "Modern Talking"
                },
				{
                    src: '/tHQ705Z/Mo-Do.jpg',
                    title: "Mo-Do"
                },
				{
                    src: '/xSvYDHn/Mr-John.jpg',
                    title: "Mr. John"
                },
				{
                    src: '/8YTKrWX/Mr-President.jpg',
                    title: "Mr. President"
                },
				{
                    src: '/DpKzCKH/New-Limit.jpg',
                    title: "New Limit"
                },
				{
                    src: '/yXt1Hrg/Night-People.jpg',
                    title: "Night People"
                },
				{
                    src: '/MVNZbzf/No-Mercy.jpg',
                    title: "No Mercy"
                },
				{
                    src: '/f1MKWQQ/Odyssey.jpg',
                    title: "Odyssey"
                },
				{
                    src: '/9YZhgby/Outta-Control.jpg',
                    title: "Outta Control"
                },
				{
                    src: '/8K3kPd4/Pharao.jpg',
                    title: "Pharao"
                },
				{
                    src: '/GnFQDtM/Playahitty.jpg',
                    title: "Playahitty"
                },
				{
                    src: '/bRnJMGF/Prince-Ital-Joy-Feat-Marky-Mark.jpg',
                    title: "Prince Ital Joy Feat. Marky Mark"
                },
				{
                    src: '/2c0gjpj/Radiorama.jpg',
                    title: "Radiorama"
                },
				{
                    src: '/tHGzXWn/Rama.jpg',
                    title: "Rama"
                },
				{
                    src: '/FH2Hy4L/Rednex.jpg',
                    title: "Rednex"
                },
				{
                    src: '/R747YDj/Reel-2-Real.jpg',
                    title: "Reel 2 Real"
                },
				{
                    src: '/vJDSnBq/Roxxy.jpg',
                    title: "Roxxy"
                },
				{
                    src: '/zNpZgdH/S-e-x-Appeal.jpg',
                    title: "S.e.x. Appeal"
                },
				{
                    src: '/jvJTx0g/Scatman-John.jpg',
                    title: "Scatman John"
                },
				{
                    src: '/Q8RYM0H/Smile-dk.jpg',
                    title: "Smile.dk"
                },
				{
                    src: '/tYkDPQ2/Solid-Base.jpg',
                    title: "Solid Base"
                },
				{
                    src: '/FDxc5KX/Solina.jpg',
                    title: "Solina"
                },
				{
                    src: '/VNmxr8R/Tatjana.jpg',
                    title: "Tatjana"
                },
				{
                    src: '/GRTnfFZ/Technotronic.jpg',
                    title: "Technotronic"
                },
				{
                    src: '/CBBfDZg/Ten-Minutes.jpg',
                    title: "Ten Minutes"
                },
				{
                    src: '/MDSL450/Th-Express.jpg',
                    title: "Th Express"
                },
				{
                    src: '/Cw7r3yF/The-Outhere-Brothers.jpg',
                    title: "The Outhere Brothers"
                },
				{
                    src: '/xzw4znN/The-Real-Mc-Mcoy.jpg',
                    title: "The Real Mc Mcoy"
                },
				{
                    src: '/HC2qf1Y/T-Spoon.jpg',
                    title: "T-Spoon"
                },
				{
                    src: '/kJLCFM3/Twenty-4-Seven.jpg',
                    title: "Twenty 4 Seven"
                },
				{
                    src: '/t3SHjHR/Unique-II.jpg',
                    title: "Unique II"
                },
				{
                    src: '/m9nKJgX/Whigfield.jpg',
                    title: "Whigfield"
                },
				{
                    src: '/DCB4hy5/Wildside.jpg',
                    title: "Wildside"
                },
				{
                    src: '/Px7qXsR/X-Pression.jpg',
                    title: "X-Pression"
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

$(".artists-random-photo").randomImage();
