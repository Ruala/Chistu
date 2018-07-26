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

});
