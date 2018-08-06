'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*helpers*/
var M = {};
var getTime = void 0;

(function () {
    M.keys = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

    /**
     * Get time in ms
     * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
     * @type {function}
     * @return {number}
     */
    var getTime = Date.now || function () {
        return new Date().getTime();
    };

    /**
     * Returns a function, that, when invoked, will only be triggered at most once
     * during a given window of time. Normally, the throttled function will run
     * as much as it can, without ever going more than once per `wait` duration;
     * but if you'd like to disable the execution on the leading edge, pass
     * `{leading: false}`. To disable execution on the trailing edge, ditto.
     * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
     * @param {function} func
     * @param {number} wait
     * @param {Object=} options
     * @returns {Function}
     */
    M.throttle = function (func, wait, options) {
        var context = void 0,
            args = void 0,
            result = void 0;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function later() {
            previous = options.leading === false ? 0 : getTime();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };
        return function () {
            var now = getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
})();

/*carousel*/
(function ($) {
    'use strict';

    var _defaults = {
        duration: 200, // ms
        dist: -100, // zoom scale TODO: make this more intuitive as an option
        shift: 0, // spacing for center image
        padding: 0, // Padding between non center items
        numVisible: 5, // Number of visible items in carousel
        fullWidth: false, // Change to full width styles
        indicators: false, // Toggle indicators
        noWrap: false, // Don't wrap around and cycle through items.
        onCycleTo: null, // Callback for when a new slide is cycled to.
        getIndicators: null, // get custom indicators func
        getNavPrev: null, //get custom prev button func
        getNavNext: null //get custom next button func
    };

    /**
     * @class
     *
     */

    var Carousel = function () {
        /**
         * Construct Carousel instance
         * @constructor
         * @param {Element} el
         * @param {Object} options
         */
        function Carousel(options) {
            var _this = this;

            _classCallCheck(this, Carousel);

            var el = options.el;
            // Display error if el is valid HTML Element
            if (!(el instanceof Element)) {
                console.error(Error(el + ' is not an HTML Element'));
            }

            this.el = el;
            this.$el = $(el);

            // this.el.M_Carousel = this;

            /**
             * Options for the carousel
             * @member Carousel#options
             * @prop {Number} duration
             * @prop {Number} dist
             * @prop {Number} shift
             * @prop {Number} padding
             * @prop {Number} numVisible
             * @prop {Boolean} fullWidth
             * @prop {Boolean} indicators
             * @prop {Boolean} noWrap
             * @prop {Function} onCycleTo
             * @prop {Function} getIndicators
             * @prop {Function} getNavPrev
             * @prop {Function} getNavNext
             */
            this.options = $.extend({}, Carousel.defaults, options);

            // Setup
            this.hasMultipleSlides = this.$el.find('.carousel-item').length > 1;
            this.showIndicators = this.options.indicators && this.hasMultipleSlides;
            this.noWrap = this.options.noWrap || !this.hasMultipleSlides;
            this.pressed = false;
            this.dragged = false;
            this.offset = this.target = 0;
            this.images = [];
            this.itemWidth = this.$el.find('.carousel-item').first().innerWidth();
            this.itemHeight = this.$el.find('.carousel-item').first().innerHeight();
            this.dim = this.itemWidth * 2 + this.options.padding || 1; // Make sure dim is non zero for divisions.
            this._autoScrollBound = this._autoScroll.bind(this);
            this._trackBound = this._track.bind(this);

            // Full Width carousel setup
            if (this.options.fullWidth) {
                this.options.dist = 0;
                this._setCarouselHeight();

                // Offset fixed items when indicators.
                if (this.showIndicators) {
                    this.$el.find('.carousel-fixed-item').addClass('with-indicators');
                }
            }

            // Iterate through slides
            var appendIndicator = false;
            if (this.$el.find('.indicators').length) {
                this.$indicators = this.$el.find('.indicators');
            } else if (typeof this.options.getIndicators === 'function') {
                this.$indicators = this.options.getIndicators(this.$el);
            } else {
                this.$indicators = $('<ul class="indicators"></ul>');
                appendIndicator = true;
            }
            this.$el.find('.carousel-item').each(function (i, el) {
                _this.images.push(el);
                if (_this.showIndicators) {
                    var $indicator = $('<li class="indicator-item"><a href="#"></a></li>');

                    // Add active to first by default.
                    if (i === 0) {
                        $indicator[0].classList.add('active');
                    }

                    _this.$indicators.append($indicator);
                }
            });
            if (this.showIndicators && appendIndicator) {
                this.$el.append(this.$indicators);
            }
            this.count = this.images.length;

            // Get arrows
            this.$prev = this.$el.find('.carousel-prev');
            this.$next = this.$el.find('.carousel-next');

            if (typeof this.options.getNavPrev === 'function') {
                this.$prev = this.$prev.add(this.options.getNavPrev(this.$el));
            }

            if (typeof this.options.getNavNext === 'function') {
                this.$next = this.$next.add(this.options.getNavNext(this.$el));
            }

            // Cap numVisible at count
            this.options.numVisible = Math.min(this.count, this.options.numVisible);

            // Setup cross browser string
            this.xform = 'transform';
            ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                var e = prefix + 'Transform';
                if (typeof document.body.style[e] !== 'undefined') {
                    _this.xform = e;
                    return false;
                }
                return true;
            });

            this._setupEventHandlers();
            this._scroll(this.offset);
        }

        _createClass(Carousel, [{
            key: 'destroy',


            /**
             * Teardown component
             */
            value: function destroy() {
                this._removeEventHandlers();
                this.el.M_Carousel = undefined;
            }

            /**
             * Setup Event Handlers
             */

        }, {
            key: '_setupEventHandlers',
            value: function _setupEventHandlers() {
                var _this2 = this;

                this._handleCarouselTapBound = this._handleCarouselTap.bind(this);
                this._handleCarouselDragBound = this._handleCarouselDrag.bind(this);
                this._handleCarouselReleaseBound = this._handleCarouselRelease.bind(this);
                this._handleCarouselClickBound = this._handleCarouselClick.bind(this);
                this._handleCarouselPrevBound = M.throttle(this._handleCarouselPrev, 200).bind(this);
                this._handleCarouselNextBound = M.throttle(this._handleCarouselNext, 200).bind(this);

                if (typeof window.ontouchstart !== 'undefined') {
                    this.el.addEventListener('touchstart', this._handleCarouselTapBound);
                    this.el.addEventListener('touchmove', this._handleCarouselDragBound);
                    this.el.addEventListener('touchend', this._handleCarouselReleaseBound);
                }

                this.el.addEventListener('mousedown', this._handleCarouselTapBound);
                this.el.addEventListener('mousemove', this._handleCarouselDragBound);
                this.el.addEventListener('mouseup', this._handleCarouselReleaseBound);
                this.el.addEventListener('mouseleave', this._handleCarouselReleaseBound);
                this.el.addEventListener('click', this._handleCarouselClickBound);
                this.$prev.on('click', this._handleCarouselPrevBound);
                this.$next.on('click', this._handleCarouselNextBound);

                if (this.showIndicators && this.$indicators) {
                    this._handleIndicatorClickBound = this._handleIndicatorClick.bind(this);
                    this.$indicators.find('.indicator-item').each(function (i, el) {
                        el.addEventListener('click', _this2._handleIndicatorClickBound);
                    });
                }

                // Resize
                var throttledResize = M.throttle(this._handleResize, 200);
                this._handleThrottledResizeBound = throttledResize.bind(this);

                window.addEventListener('resize', this._handleThrottledResizeBound);
            }

            /**
             * Remove Event Handlers
             */

        }, {
            key: '_removeEventHandlers',
            value: function _removeEventHandlers() {
                var _this3 = this;

                if (typeof window.ontouchstart !== 'undefined') {
                    this.el.removeEventListener('touchstart', this._handleCarouselTapBound);
                    this.el.removeEventListener('touchmove', this._handleCarouselDragBound);
                    this.el.removeEventListener('touchend', this._handleCarouselReleaseBound);
                }
                this.el.removeEventListener('mousedown', this._handleCarouselTapBound);
                this.el.removeEventListener('mousemove', this._handleCarouselDragBound);
                this.el.removeEventListener('mouseup', this._handleCarouselReleaseBound);
                this.el.removeEventListener('mouseleave', this._handleCarouselReleaseBound);
                this.el.removeEventListener('click', this._handleCarouselClickBound);
                this.$prev.off('click', this._handleCarouselPrevBound);
                this.$next.off('click', this._handleCarouselNextBound);

                if (this.showIndicators && this.$indicators) {
                    this.$indicators.find('.indicator-item').each(function (i, el) {
                        el.removeEventListener('click', _this3._handleIndicatorClickBound);
                    });
                }

                window.removeEventListener('resize', this._handleThrottledResizeBound);
            }
        }, {
            key: '_handleCarouselPrev',
            value: function _handleCarouselPrev(e) {
                e.preventDefault();
                e.stopPropagation();
                this.prev();
            }
        }, {
            key: '_handleCarouselNext',
            value: function _handleCarouselNext(e) {
                e.preventDefault();
                e.stopPropagation();
                this.next();
            }

            /**
             * Handle Carousel Tap
             * @param {Event} e
             */

        }, {
            key: '_handleCarouselTap',
            value: function _handleCarouselTap(e) {
                // Fixes firefox draggable image bug
                if (e.type === 'mousedown' && $(e.target).is('img')) {
                    e.preventDefault();
                }
                this.pressed = true;
                this.dragged = false;
                this.verticalDragged = false;
                this.reference = this._xpos(e);
                this.referenceY = this._ypos(e);

                this.velocity = this.amplitude = 0;
                this.frame = this.offset;
                this.timestamp = Date.now();
                clearInterval(this.ticker);
                this.ticker = setInterval(this._trackBound, 100);
            }

            /**
             * Handle Carousel Drag
             * @param {Event} e
             */

        }, {
            key: '_handleCarouselDrag',
            value: function _handleCarouselDrag(e) {
                var x = void 0,
                    y = void 0,
                    delta = void 0,
                    deltaY = void 0;
                if (this.pressed) {
                    x = this._xpos(e);
                    y = this._ypos(e);
                    delta = this.reference - x;
                    deltaY = Math.abs(this.referenceY - y);
                    if (deltaY < 30 && !this.verticalDragged) {
                        // If vertical scrolling don't allow dragging.
                        if (delta > 2 || delta < -2) {
                            this.dragged = true;
                            this.reference = x;
                            this._scroll(this.offset + delta);
                        }
                    } else if (this.dragged) {
                        // If dragging don't allow vertical scroll.
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    } else {
                        // Vertical scrolling.
                        this.verticalDragged = true;
                    }
                }

                if (this.dragged) {
                    // If dragging don't allow vertical scroll.
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }

            /**
             * Handle Carousel Release
             * @param {Event} e
             */

        }, {
            key: '_handleCarouselRelease',
            value: function _handleCarouselRelease(e) {
                if (this.pressed) {
                    this.pressed = false;
                } else {
                    return;
                }

                clearInterval(this.ticker);
                this.target = this.offset;
                if (this.velocity > 10 || this.velocity < -10) {
                    this.amplitude = 0.9 * this.velocity;
                    this.target = this.offset + this.amplitude;
                }
                this.target = Math.round(this.target / this.dim) * this.dim;

                // No wrap of items.
                if (this.noWrap) {
                    if (this.target >= this.dim * (this.count - 1)) {
                        this.target = this.dim * (this.count - 1);
                    } else if (this.target < 0) {
                        this.target = 0;
                    }
                }
                this.amplitude = this.target - this.offset;
                this.timestamp = Date.now();
                requestAnimationFrame(this._autoScrollBound);

                if (this.dragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return false;
            }

            /**
             * Handle Carousel CLick
             * @param {Event} e
             */

        }, {
            key: '_handleCarouselClick',
            value: function _handleCarouselClick(e) {
                // Disable clicks if carousel was dragged.
                if (this.dragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                } else if (!this.options.fullWidth) {
                    var clickedIndex = $(e.target).closest('.carousel-item').index();
                    var diff = this._wrap(this.center) - clickedIndex;

                    // Disable clicks if carousel was shifted by click
                    if (diff !== 0) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    this._cycleTo(clickedIndex);
                }
            }

            /**
             * Handle Indicator CLick
             * @param {Event} e
             */

        }, {
            key: '_handleIndicatorClick',
            value: function _handleIndicatorClick(e) {
                e.stopPropagation();
                e.preventDefault();

                var indicator = $(e.target).closest('.indicator-item');
                if (indicator.length) {
                    this._cycleTo(indicator.index());
                }
            }

            /**
             * Handle Throttle Resize
             * @param {Event} e
             */

        }, {
            key: '_handleResize',
            value: function _handleResize(e) {
                if (this.options.fullWidth) {
                    this.itemWidth = this.$el.find('.carousel-item').first().innerWidth();
                    this.imageHeight = this.$el.find('.carousel-item.active').height();
                    this.dim = this.itemWidth * 2 + this.options.padding;
                    this.offset = this.center * 2 * this.itemWidth;
                    this.target = this.offset;
                    this._setCarouselHeight(true);
                } else {
                    this._scroll();
                }
            }

            /**
             * Set carousel height based on first slide
             * @param {Booleam} imageOnly - true for image slides
             */

        }, {
            key: '_setCarouselHeight',
            value: function _setCarouselHeight(imageOnly) {
                var _this4 = this;

                var firstSlide = this.$el.find('.carousel-item.active').length ? this.$el.find('.carousel-item.active').first() : this.$el.find('.carousel-item').first();
                var firstImage = firstSlide.find('img').first();
                if (firstImage.length) {
                    if (firstImage[0].complete) {
                        // If image won't trigger the load event
                        var imageHeight = firstImage.height();
                        if (imageHeight > 0) {
                            this.$el.css('height', imageHeight + 'px');
                        } else {
                            // If image still has no height, use the natural dimensions to calculate
                            var naturalWidth = firstImage[0].naturalWidth;
                            var naturalHeight = firstImage[0].naturalHeight;
                            var adjustedHeight = this.$el.width() / naturalWidth * naturalHeight;
                            this.$el.css('height', adjustedHeight + 'px');
                        }
                    } else {
                        // Get height when image is loaded normally
                        firstImage.one('load', function (el, i) {
                            _this4.$el.css('height', el.offsetHeight + 'px');
                        });
                    }
                } else if (!imageOnly) {
                    var slideHeight = firstSlide.height();
                    this.$el.css('height', slideHeight + 'px');
                }
            }

            /**
             * Get x position from event
             * @param {Event} e
             */

        }, {
            key: '_xpos',
            value: function _xpos(e) {
                // touch event
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return e.targetTouches[0].clientX;
                }

                // mouse event
                return e.clientX;
            }

            /**
             * Get y position from event
             * @param {Event} e
             */

        }, {
            key: '_ypos',
            value: function _ypos(e) {
                // touch event
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return e.targetTouches[0].clientY;
                }

                // mouse event
                return e.clientY;
            }


            /**
             * Wrap index
             * @param {Number} x
             */

        }, {
            key: '_wrap',
            value: function _wrap(x) {
                return x >= this.count ? x % this.count : x < 0 ? this._wrap(this.count + x % this.count) : x;
            }

            /**
             * Tracks scrolling information
             */

        }, {
            key: '_track',
            value: function _track() {
                var now = void 0,
                    elapsed = void 0,
                    delta = void 0,
                    v = void 0;

                now = Date.now();
                elapsed = now - this.timestamp;
                this.timestamp = now;
                delta = this.offset - this.frame;
                this.frame = this.offset;

                v = 1000 * delta / (1 + elapsed);
                this.velocity = 0.8 * v + 0.2 * this.velocity;
            }

            /**
             * Auto scrolls to nearest carousel item.
             */

        }, {
            key: '_autoScroll',
            value: function _autoScroll() {
                var elapsed = void 0,
                    delta = void 0;

                if (this.amplitude) {
                    elapsed = Date.now() - this.timestamp;
                    delta = this.amplitude * Math.exp(-elapsed / this.options.duration);
                    if (delta > 2 || delta < -2) {
                        this._scroll(this.target - delta);
                        requestAnimationFrame(this._autoScrollBound);
                    } else {
                        this._scroll(this.target);
                    }
                }
            }

            /**
             * Scroll to target
             * @param {Number} x
             */

        }, {
            key: '_scroll',
            value: function _scroll(x) {
                var _this5 = this;

                // Track scrolling state
                if (!this.$el.hasClass('scrolling')) {
                    this.el.classList.add('scrolling');
                }
                if (this.scrollingTimeout != null) {
                    window.clearTimeout(this.scrollingTimeout);
                }
                this.scrollingTimeout = window.setTimeout(function () {
                    _this5.$el.removeClass('scrolling');
                }, this.options.duration);

                // Start actual scroll
                var i = void 0,
                    half = void 0,
                    delta = void 0,
                    dir = void 0,
                    tween = void 0,
                    el = void 0,
                    alignment = void 0,
                    zTranslation = void 0,
                    tweenedOpacity = void 0,
                    centerTweenedOpacity = void 0;
                var lastCenter = this.center;
                var numVisibleOffset = 1 / this.options.numVisible;

                this.offset = typeof x === 'number' ? x : this.offset;
                this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
                delta = this.offset - this.center * this.dim;
                dir = delta < 0 ? 1 : -1;
                tween = -dir * delta * 2 / this.dim;
                half = this.count >> 1;

                if (this.options.fullWidth) {
                    alignment = 'translateX(0)';
                    centerTweenedOpacity = 1;
                } else {
                    alignment = 'translateX(' + (this.el.clientWidth - this.itemWidth) / 2 + 'px) ';
                    alignment += 'translateY(' + (this.el.clientHeight - this.itemHeight) / 2 + 'px)';
                    centerTweenedOpacity = 1 - numVisibleOffset * tween;
                }

                // Set indicator active
                if (this.showIndicators) {
                    var diff = this.center % this.count;
                    var activeIndicator = this.$indicators.find('.indicator-item.active');
                    if (activeIndicator.index() !== diff) {
                        activeIndicator.removeClass('active');
                        this.$indicators.find('.indicator-item').eq(diff)[0].classList.add('active');
                    }
                }

                // center
                // Don't show wrapped items.
                if (!this.noWrap || this.center >= 0 && this.center < this.count) {
                    el = this.images[this._wrap(this.center)];

                    // Add active class to center item.
                    if (!$(el).hasClass('active')) {
                        this.$el.find('.carousel-item').removeClass('active');
                        el.classList.add('active');
                    }
                    var transformString = alignment + ' translateX(' + -delta / 2 + 'px) translateX(' + dir * this.options.shift * tween * i + 'px) translateZ(' + this.options.dist * tween + 'px)';
                    this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
                }

                for (i = 1; i <= half; ++i) {
                    // right side
                    if (this.options.fullWidth) {
                        zTranslation = this.options.dist;
                        tweenedOpacity = i === half && delta < 0 ? 1 - tween : 1;
                    } else {
                        zTranslation = this.options.dist * (i * 2 + tween * dir);
                        tweenedOpacity = 1 - numVisibleOffset * (i * 2 + tween * dir);
                    }
                    // Don't show wrapped items.
                    if (!this.noWrap || this.center + i < this.count) {
                        el = this.images[this._wrap(this.center + i)];
                        var _transformString = alignment + ' translateX(' + (this.options.shift + (this.dim * i - delta) / 2) + 'px) translateZ(' + zTranslation + 'px)';
                        this._updateItemStyle(el, tweenedOpacity, -i, _transformString);
                    }

                    // left side
                    if (this.options.fullWidth) {
                        zTranslation = this.options.dist;
                        tweenedOpacity = i === half && delta > 0 ? 1 - tween : 1;
                    } else {
                        zTranslation = this.options.dist * (i * 2 - tween * dir);
                        tweenedOpacity = 1 - numVisibleOffset * (i * 2 - tween * dir);
                    }
                    // Don't show wrapped items.
                    if (!this.noWrap || this.center - i >= 0) {
                        el = this.images[this._wrap(this.center - i)];
                        var _transformString2 = alignment + ' translateX(' + (-this.options.shift + (-this.dim * i - delta) / 2) + 'px) translateZ(' + zTranslation + 'px)';
                        this._updateItemStyle(el, tweenedOpacity, -i, _transformString2);
                    }
                }

                // center
                // Don't show wrapped items.
                if (!this.noWrap || this.center >= 0 && this.center < this.count) {
                    el = this.images[this._wrap(this.center)];
                    var _transformString3 = alignment + ' translateX(' + -delta / 2 + 'px) translateX(' + dir * this.options.shift * tween + 'px) translateZ(' + this.options.dist * tween + 'px)';
                    this._updateItemStyle(el, centerTweenedOpacity, 0, _transformString3);
                }

                // onCycleTo callback
                var $currItem = this.$el.find('.carousel-item').eq(this._wrap(this.center));
                if (lastCenter !== this.center && typeof this.options.onCycleTo === 'function') {
                    this.options.onCycleTo.call(this, $currItem[0], this.dragged);
                }

                // One time callback
                if (typeof this.oneTimeCallback === 'function') {
                    this.oneTimeCallback.call(this, $currItem[0], this.dragged);
                    this.oneTimeCallback = null;
                }
            }

            /**
             * Cycle to target
             * @param {Element} el
             * @param {Number} opacity
             * @param {Number} zIndex
             * @param {String} transform
             */

        }, {
            key: '_updateItemStyle',
            value: function _updateItemStyle(el, opacity, zIndex, transform) {
                el.style[this.xform] = transform;
                el.style.zIndex = zIndex;
                el.style.opacity = opacity;
                el.style.visibility = 'visible';
            }

            /**
             * Cycle to target
             * @param {Number} n
             * @param {Function} callback
             */

        }, {
            key: '_cycleTo',
            value: function _cycleTo(n, callback) {
                var diff = this.center % this.count - n;

                // Account for wraparound.
                if (!this.noWrap) {
                    if (diff < 0) {
                        if (Math.abs(diff + this.count) < Math.abs(diff)) {
                            diff += this.count;
                        }
                    } else if (diff > 0) {
                        if (Math.abs(diff - this.count) < diff) {
                            diff -= this.count;
                        }
                    }
                }

                this.target = this.dim * Math.round(this.offset / this.dim);
                // Next
                if (diff < 0) {
                    this.target += this.dim * Math.abs(diff);

                    // Prev
                } else if (diff > 0) {
                    this.target -= this.dim * diff;
                }

                // Set one time callback
                if (typeof callback === 'function') {
                    this.oneTimeCallback = callback;
                }

                // Scroll
                if (this.offset !== this.target) {
                    this.amplitude = this.target - this.offset;
                    this.timestamp = Date.now();
                    requestAnimationFrame(this._autoScrollBound);
                }
            }

            /**
             * Cycle to next item
             * @param {Number} [n]
             */

        }, {
            key: 'next',
            value: function next(n) {
                if (n === undefined || isNaN(n)) {
                    n = 1;
                }

                var index = this.center + n;
                if (index >= this.count || index < 0) {
                    if (this.noWrap) {
                        return;
                    }

                    index = this._wrap(index);
                }
                this._cycleTo(index);
            }

            /**
             * Cycle to previous item
             * @param {Number} [n]
             */

        }, {
            key: 'prev',
            value: function prev(n) {
                if (n === undefined || isNaN(n)) {
                    n = 1;
                }

                var index = this.center - n;
                if (index >= this.count || index < 0) {
                    if (this.noWrap) {
                        return;
                    }

                    index = this._wrap(index);
                }

                this._cycleTo(index);
            }

            /**
             * Cycle to nth item
             * @param {Number} [n]
             * @param {Function} callback
             */

        }, {
            key: 'set',
            value: function set(n, callback) {
                if (n === undefined || isNaN(n)) {
                    n = 0;
                }

                if (n > this.count || n < 0) {
                    if (this.noWrap) {
                        return;
                    }

                    n = this._wrap(n);
                }

                this._cycleTo(n, callback);
            }
        }], [{
            key: 'init',
            value: function init(els, options) {
                return _get(Carousel.__proto__ || Object.getPrototypeOf(Carousel), 'init', this).call(this, this, els, options);
            }

            /**
             * Get Instance
             */

        }, {
            key: 'getInstance',
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Carousel;
            }
        }, {
            key: 'defaults',
            get: function get() {
                return _defaults;
            }
        }]);

        return Carousel;
    }();

    $.fn.carousel = function () {
        var _ = this;
        var options = arguments[0] || {};
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < _.length; i++) {
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                options.el = _[i];
                _[i].M_Carousel = new Carousel(options);
            } else {
                var result = _[i].M_Carousel[options].call(_[i].M_Carousel, args);

                if (typeof result !== 'undefined') return result;
            }
        }

        return _;
    };
})(jQuery);