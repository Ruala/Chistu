/*viewport fix*/
(function () {
    updateWidth();

    window.addEventListener('resize', updateWidth);

    function updateWidth(){
        var body = document.body;
        var width = document.documentElement.clientWidth;
        var zoom = 0.67;
        if (width > 1200 && width <= 1920) {
            if (width > 1400) {
                zoom += ((width - 1400) / (520/33)) / 100;
            }
            body.style.zoom = zoom;
        }
        else {
            body.style.zoom = '';
        }
    } 
})();
