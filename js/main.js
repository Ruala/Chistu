$(document).ready(function () {

    //Валидатор
    (function () {

        $.validator.setDefaults({
            submitHandler: function (form) {
                $(form).ajaxSubmit();
            }
        });

        $("#orderForm").validate({
            rules: {
                name: "required",
                phone: {
                    required: true,
                    minlength: 7
                }
            },
            messages: {
                name: "Пожалуйста, введите своё имя",
                phone: {
                    required: "Пожалуйста, введите свой номер телефона",
                    minlength: "Ваш номер телефона слишком короткий"
                }
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");

                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.parent("label"));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-error").removeClass("has-success");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-success").removeClass("has-error");
            }
        });

        $("#variantsForm").validate({
            rules: {
                name: "required",
                phone: {
                    required: true,
                    minlength: 7
                },
                email: {
                    required: false,
                    email: true
                }
            },
            messages: {
                name: "Пожалуйста, введите своё имя",
                phone: {
                    required: "Пожалуйста, введите свой номер телефона",
                    minlength: "Ваш номер телефона слишком короткий"
                }
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");

                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.parent("label"));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-error").removeClass("has-success");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-success").removeClass("has-error");
            }
        });

        $("#questionForm").validate({
            rules: {
                name: "required",
                phone: {
                    required: true,
                    minlength: 7
                },
                email: {
                    required: false,
                    email: true
                },
                message: {
                    required: true,
                }
            },
            messages: {
                name: "Пожалуйста, введите своё имя",
                phone: {
                    required: "Пожалуйста, введите свой номер телефона",
                    minlength: "Ваш номер телефона слишком короткий"
                },
                message: "Пожалуйста, введите вопрос."
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");

                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.parent("label"));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-error").removeClass("has-success");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents(".tm-highlight").addClass("has-success").removeClass("has-error");
            }
        });

    })();

    //Up-Down Button

    (function () {
        const $updownElem = $('#btnUpDown');
        const optionToTopBtn = 1;
        const showToTopBtnOn = document.documentElement.clientHeight * optionToTopBtn;
        let pageYLabel = 0;

        $(window).scroll(function () {

            if($updownElem.hasClass("upBtn")) {
                if ($(window).scrollTop() < showToTopBtnOn) {
                    $updownElem.removeClass("upBtn");
                    $updownElem.fadeOut();
                }
            }
            else if($updownElem.hasClass("downBtn")) {
                if ($(window).scrollTop() > showToTopBtnOn) {
                    $updownElem.removeClass("downBtn").addClass("upBtn");
                }
            }
            else {
                if ($(window).scrollTop() > showToTopBtnOn && !($updownElem.hasClass("downBtn"))) {
                    $updownElem.fadeIn();
                    $updownElem.addClass("upBtn");
                }
            }

        });

        $updownElem.click(function () {

            if($updownElem.hasClass("upBtn")) {
                pageYLabel = $(window).scrollTop();
                $('body,html').animate({scrollTop: 0}, 800, function() {
                    $updownElem.removeClass("upBtn").addClass("downBtn");
                    $updownElem.fadeIn();
                });
            }
            else if($updownElem.hasClass("downBtn")) {
                $('body,html').animate({scrollTop: pageYLabel}, 800, function() {
                    $updownElem.removeClass("downBtn").addClass("upBtn");
                });
            }
        });

    })();

    /*carousel init*/
    (function () {
        const $caruosel = $('.carousel');
        const $carouselHeader = $('#carousel-header');
        const options = {
            indicators: true,
            dist: -150,
            shift: -100,
            padding: -300,
            getIndicators: () => $carouselHeader.find('.indicators'),
            getNavPrev: () => $carouselHeader.find('.carousel-prev'),
            getNavNext: () => $carouselHeader.find('.carousel-next'),
        };

        $caruosel.carousel(options);
        $carouselHeader.on('click', e => e.stopPropagation());
    })();
});
