
export function SpeechText() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
        window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    const recognition = new SpeechRecognition();

    // Controls whether continuous results are captured (true), 
    //or just a single result each time recognition is started (false)
    recognition.continuous = false;

    // Sets the language of the recognition.
    recognition.lang = "en-US";

    // Defines whether the speech recognition system should return interim results, or just final results. 
    //Final results are good enough for this simple demo.
    recognition.interimResults = false;

    // Sets the number of alternative potential matches that should be returned per result.
    recognition.maxAlternatives = 1;

    // Start obtaining input
    recognition.start();

    recognition.onresult = function(event){
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        var text = event.results[0][0].transcript;
        console.log(text);
    }

    recognition.onspeechend = function() {
        recognition.stop();
    }

    recognition.onnomatch = function(event) {

    }
      
    recognition.onerror = function(event) {

    }
}