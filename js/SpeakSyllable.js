/*jslint browser: true*/
/*global SpeechSynthesisUtterance, speechSynthesis, speak*/

// Create a new utterance for the specified text and add it to the queue.
function speak(text) {
    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;

    // Set the attributes.
    msg.volume = 1; // parseFloat(volumeInput.value);
    msg.rate = 0.3; // parseFloat(rateInput.value);
    msg.pitch = 1; // parseFloat(pitchInput.value);

    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google 한국의'; })[0];

    // Queue this utterance.
    window.speechSynthesis.speak(msg);
}