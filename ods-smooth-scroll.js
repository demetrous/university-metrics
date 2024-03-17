$(document).ready(function () {


    // init nav object from dom
    var nav = $('#navbar-top');

    //additional offset from top
    var additOffset = 100;

    // get heigth of the nav
    var navHeight = nav.outerHeight() + additOffset;



    // Select all links with hashes
    $('.child-list-container.right-side .child-list a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - navHeight
                    }, 800
                            /*, function () {

                            // Callback after animation
                            // Must change focus!
                            var $target = $(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            };
                        }*/
                    );
                }
            }
        });

    //$('.child-list-container').animate({
    //    scrollTop: ($('.current-page').offset().top)
    //}, 500);

    //$(".child-list-container").scrollTop($('.current-page').parent().offset().top-700);

    //$

    //console.log($('.current-page').parent().offset());
});

