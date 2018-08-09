jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

var getURLParams = function() {
    var temp = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
        var decode = function(s) {
            return decodeURIComponent(s.split("+").join(" "));
        };
        temp[decode(arguments[1])] = decode(arguments[2]);
    });
    return temp;
};

var $_GET = getURLParams();

if (typeof $_GET["utm_source"] == 'string' && $_GET["utm_source"] != '') {
    $.cookie('utmMedium', $_GET["utm_medium"] || '');
    $.cookie('utmSource', $_GET["utm_source"] || '');
    $.cookie('utmCampaign', $_GET["utm_campaign"] || '');
    $.cookie('utmTerm', $_GET["utm_term"] || '');
    $.cookie('utmContent', $_GET["utm_content"] || '');

    $.cookie('pmSource', $_GET["pm_source"] || '');
    $.cookie('pmBlock', $_GET["pm_block"] || '');
    $.cookie('pmPosition', $_GET["pm_position"] || '');
}

$(document).ready(function(){
    if (typeof ymaps != 'undefined') {
        ymaps.ready(init);
        function init() {
            $.cookie('y_city', ymaps.geolocation.city);
            $.cookie('y_region', ymaps.geolocation.region);
            $.cookie('y_country', ymaps.geolocation.country);
        }
    }
});

