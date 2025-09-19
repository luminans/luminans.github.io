/*jslint devel: true */
/*global alert, document, initialize, setTimeout, animate */

function splitPath(path) {
    'use strict';

    var separator = /[mM][^mM]+/g,
        match,
        subpaths = [];

    while ((match = separator.exec(path)) !== null) {
        subpaths.push(match[0].trim());
    }

    return subpaths;
}

function makeSVGPath(str, translation) {
    'use strict';

    var ns = 'http://www.w3.org/2000/svg',
        path = document.createElementNS(ns, "path");

    path.setAttribute("d", str);
    if (typeof translation !== "undefined") {
        path.setAttribute("transform", "translate(" + translation[0] + "," + translation[1] + ")");
    }

    return path;
}

// make simple SVG paths from str
function makeSVGPaths(str, translation) {
    'use strict';

    var strsubpaths = splitPath(str),
        subpaths = [];

    if (typeof translation === "undefined") {
        translation = [0, 0];
    }

    strsubpaths.forEach(function (subpath) {
        subpaths.push(makeSVGPath(subpath, translation));
    });

    return subpaths;
}

function makePaths4Syllable(opening, lasting, closing) {
    'use strict';

    var svgobj = document.getElementById('svgGraphoneme'),
        svgdoc, simple_lasting, flat_lasting,
        syllable = [[opening, [0, 0]]], subpaths = [];
    if (lasting & 0x20) {
        simple_lasting = lasting & 0x1f;
        flat_lasting = simple_lasting & 0xf7; // lasting sound with flat tongue
        syllable.push([flat_lasting + 2, [0, 0]]);
        syllable.push([simple_lasting, [0, 0]]);
    } else {
        syllable.push([lasting, [0, 0]]);
    }
    syllable.push([closing, [0, 60]]);

    // get access to the SVG document object
    try {

        svgdoc = svgobj.contentDocument;
    } catch (e1) {
        try {

            svgdoc = svgobj.getSVGDocument();

        } catch (e2) {
            alert("SVG in object not supported in your environment");
        }
    }

    if (!svgdoc) { return; }

    syllable.forEach(function (letter) {
        var code = parseInt(letter[0], 10),
            //            str = 'hangul' + code.toString(16).padStart(2, '0'),
            str = 'layer' + code,
            layer = svgdoc.getElementById(str),
            path = layer.children[0],
            str_path = path.getAttribute('d'),
            letter_subpaths = makeSVGPaths(str_path, letter[1]);
        letter_subpaths.forEach(function (letter_subpath) {
            subpaths.push(letter_subpath);
        });
    });

    return subpaths;
}

function insertPaths4Syllable(svg, opening, lasting, closing) {
    'use strict';

    var subpaths = makePaths4Syllable(opening, lasting, closing & 0xbf);

    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }

    subpaths.forEach(function (subpath) {
        svg.appendChild(subpath);
    });

    window.writing.initialize.call(svg);
    
    setTimeout(function() {
            window.writing.animate.call(svg);
    }, 1); // Delay 1ms. Otherwise, the last subpath is not animated.
}