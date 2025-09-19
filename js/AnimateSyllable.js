/*jslint browser: true*/

(function () {
    'use strict';

    function initializeSVG(svg) {
        var delay = 0, speed = 0.2, duration = 0,
            paths = svg.querySelectorAll('path'), length;
        
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            length = path.getTotalLength();
            duration = length / speed;
            path.style.transition = 'none';
            path.setAttribute('data-duration', duration);
            path.setAttribute('data-delay', delay);
            path.setAttribute('stroke-dashoffset', length);
            path.setAttribute('stroke-dasharray', length + ',' + length);
            delay += duration + 100;
        }
    }

    function animateSVG(svg) {
        var delay, duration, length,
            paths = svg.querySelectorAll('path');
        
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            delay = path.getAttribute('data-delay');
            duration = path.getAttribute('data-duration');
            length = path.getAttribute('stroke-dashoffset');
            path.style.transition = 'stroke-dashoffset ' + duration + 'ms ' + delay + 'ms linear';
            path.setAttribute('stroke-dashoffset', '0');
        }
    }

    // Create global writing object
    window.writing = {
        initialize: function () {
            initializeSVG(this);
        },
        animate: function () {
            animateSVG(this);
        }
    };

    // Initialize when page loads
    function initializeLetterFormations() {
        var letterFormations = document.querySelectorAll('.letterformation');
        for (var i = 0; i < letterFormations.length; i++) {
            var element = letterFormations[i];
            if (element && element.querySelectorAll('path').length > 0) {
                try {
                    window.writing.initialize.call(element);
                } catch (e) {
                    console.log('Error initializing SVG:', e);
                }
            }
        }
    }

    // Set up button click handlers
    function setupButtonHandlers() {
        var buttons = document.querySelectorAll('button');
        var letterFormations = document.querySelectorAll('.letterformation');
        
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                for (var j = 0; j < letterFormations.length; j++) {
                    var element = letterFormations[j];
                    if (element && element.querySelectorAll('path').length > 0) {
                        try {
                            window.writing.initialize.call(element);
                            setTimeout(function () {
                                window.writing.animate.call(element);
                            }, 1);
                        } catch (e) {
                            console.log('Error on button click:', e);
                        }
                    }
                }
            });
        }
    }

    // Initialize everything after a delay to avoid conflicts
    setTimeout(function() {
        initializeLetterFormations();
        setupButtonHandlers();
    }, 200);

    // Animate on window load
    window.addEventListener('load', function () {
        var letterFormations = document.querySelectorAll('.letterformation');
        for (var i = 0; i < letterFormations.length; i++) {
            var element = letterFormations[i];
            if (element && element.querySelectorAll('path').length > 0) {
                try {
                    window.writing.animate.call(element);
                } catch (e) {
                    console.log('Error animating SVG:', e);
                }
            }
        }
    });

})();