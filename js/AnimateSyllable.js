/*jslint browser: true*/
/*global $*/

function initialize(svg) {
    var delay = 0, speed = 0.2, duration = 0,
        paths = $('path', svg), length;
    Array.from(paths).forEach(function (path) {
        delay += duration + 100;
        length = path.getTotalLength();
        duration = length / speed;
        $(path).css('transition', 'none').attr('data-duration', duration).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length);
    });
}

function animate(svg) {
    var delay, length, duration,
        paths = $('path', svg);
    Array.from(paths).forEach(function (path) {
        delay = $(path).attr('data-delay');
        duration = $(path).attr('data-duration');
        length = $(path).attr('stroke-dashoffset');
        $(path).css('transition', 'stroke-dashoffset ' + duration + 'ms ' + delay + 'ms linear').attr('stroke-dashoffset', '0');
    });
}

(function () {
    'use strict';

    window.writing = {
        initialize: function () {
            initialize(this);
        },
        animate: function () {
            animate(this);
        }
    };

    $(document).ready(function () {
        window.writing.initialize();
        return $('button').on('click', function () {
            window.writing.initialize();
            return setTimeout(function () {
                return window.writing.animate();
            }, 1);

        });
    });

    $(window).load(function () {
        return window.writing.animate();
    });

}).call(this);