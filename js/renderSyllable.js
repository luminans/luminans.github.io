/*jslint browser: true*/
/*global renderSound, renderSpeech, insertPaths4Syllable*/

function code2img(letter) {
    "use strict";

    letter = letter & 0xbf;
    if (letter === 139) { return '8b'; }
    var image = 128 + ((letter - 128) % 5);
    return image.toString(16).padStart(2, '0');
}

// make a sequence of sound sources
function speakSound4Syllable(opening, lasting, closing, interval) {
    "use strict";

    var time = 0, result = [];
    if (opening === 128) { opening = 3; }
    if (opening !== 0) {
        result.push([time, opening]);
        time = interval;
    }
    if (lasting !== 0) {
        if (lasting & 0x10) {
            result.push([time, 0x10]);
            time += interval / 2;
            lasting = lasting & 0xef;
        }
        if (lasting & 0x20) {
            lasting = lasting & 0x1f;
            var flat_lasting = lasting & 0xf7; // lasting sound with flat tongue
            result.push([time, flat_lasting + 2]);
            time += interval / 2;
        }
        result.push([time, lasting]);
        time += interval;
    }
    if (closing !== 0) {
        result.push([time, closing]);
        time += interval;
    }
    return result;
}

// reduce to homorganic articulation
function identicalClosing(sound) {
    "use strict";

    if (sound > 0xca && sound < 0xcf) {
        return sound - 5;
    } else {
        return sound;
    }
}

function renderSound(opening, lasting, closing) {
    "use strict";

    closing = identicalClosing(closing);
    var syllable = speakSound4Syllable(opening, lasting, closing, 500);

    syllable.forEach(function (speech) {
        var hex_name = speech[1].toString(16).padStart(2, '0'),
            snd_name = 'sounds/sound' + hex_name + '.ogg';
        setTimeout(function () {
            var audio = new Audio(snd_name);
            audio.play();
        }, speech[0]);
    });
}

// reduce to homorganic articulation
function homorganicSound(sound) {
    "use strict";

    sound = sound & 0x0f;
    if (sound !== 0x0f) {
        sound = sound % 5;
    }
    return sound | 0x80;
}

// make a sequence of speech articulation
function articulateSpeech4Syllable(opening, lasting, closing, interval) {
    "use strict";

    var time = 0, half_interval = interval / 2, result = [];
    if (opening !== 0) {
        result.push([time, homorganicSound(opening)]); 
        time += half_interval; 
        result.push([time, 0]); 
        time += half_interval; 
    }
    if (lasting !== 0) {
        if (lasting & 0x10) {           // pre-iotized vowels
            result.push([time, 0x01]); 
            time += half_interval;
            lasting = lasting & 0xef;
        }
        if (lasting & 0x20) {
            lasting = lasting & 0x1f;
            var flat_lasting = lasting & 0xf7; // lasting sound with flat tongue
            result.push([time, flat_lasting + 2]);
            time += interval / 2;
        }
        result.push([time, lasting]); 
        time += interval;
    }
    if (closing !== 0) {
        result.push([time, 0]); 
        time += half_interval; 
        result.push([time, homorganicSound(closing)]); 
        time += half_interval; 
    }
    result.push([time, 0]); 
    return result;
}

function renderSpeech(canvas, opening, lasting, closing) {
    "use strict";

    var original = canvas.src, // original image
        syllable = articulateSpeech4Syllable(opening, lasting, closing, 1000);

    syllable.forEach(function (speech) {
        var hex_name = speech[1].toString(16).padStart(2, '0'),
            img_name = 'images/speech' + hex_name + '.svg';
        setTimeout(function () {
            canvas.src = img_name; 
        }, speech[0]);
    });
    setTimeout(function () {
        canvas.src = original;
        isIdleArticulation = true;
    }, syllable.slice(-1)[0][0]);
}

function speakSyllable(canvas, opening, lasting, closing) {
    renderSound(opening, lasting, closing);
    renderSpeech(canvas, opening, lasting, closing);
}

function renderSyllable(canvas, opening, lasting, closing) {
    "use strict";

    var img_canvas = 'img_' + canvas,
        svg_canvas = 'svg_' + canvas;

    renderSound(opening, lasting, closing);
    renderSpeech(img_canvas, opening, lasting, closing);
    insertPaths4Syllable(svg_canvas, opening, lasting, closing);
}