/*viewport fix*/
(function () {
    updateWidth();

    window.addEventListener('resize', updateWidth);

    function updateWidth(){
        var body = document.body;
        var width = document.documentElement.clientWidth;
        var zoom = 0.67;
        if (width > 1200 && width <= 1920 && getIEVersion() === 0) {
            if (width > 1400) {
                zoom += ((width - 1400) / (520/33)) / 100;
            }
            body.style.zoom = zoom;
        }
        else {
            body.style.zoom = '';
        }
    }

    function getIEVersion() {
        var sAgent = window.navigator.userAgent;
        var Idx = sAgent.indexOf("MSIE");
      
        // If IE, return version number.
        if (Idx > 0) 
          return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
      
        // If IE 11 then look for Updated user agent string.
        else if (!!navigator.userAgent.match(/Trident\/7\./)) 
          return 11;
      
        else
          return 0; //It is not IE
    }

})();
