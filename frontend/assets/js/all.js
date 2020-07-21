(function($) {
    "use strict"; // Start of use strict

    $(window).load(function() {
        $("body").imagesLoaded(function() {
            $(".page-loader div").fadeOut();
            $(".page-loader").delay(200).fadeOut("slow");
        });
    });

    function init_team() {
        $(".team-item").click(function() {
            if ($("html").hasClass("mobile")) {
                $(this).toggleClass("js-active");
            }
        });
    }
})(jQuery);

function init_wow() {
    (function($) {
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 90,
            mobile: false,
            live: true
        });
        if ($("body").hasClass("appear-animate")) {
            wow.init();
        }
    })(jQuery);
}