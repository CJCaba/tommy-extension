export function SpeechText() {
    var recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "us_en";

    let capturing = false;
    let finalTranscript = '';
    let lastTimestamp = 0;

    recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                finalTranscript.toLowerCase();
            } else {
                interimTranscript += event.results[i][0].transcript;
                interimTranscript.toLowerCase();
            }
        }
        const triggerPhrases = ["hi Tom", "hey Tom", "hey Tommy", "hi Tommy", "okay Tommy"];
        const foundTrigger = triggerPhrases.some(phrase => interimTranscript.includes(phrase));
        console.log(foundTrigger)
        // Check for the trigger phrase in the latest transcript.
        if (foundTrigger && !capturing) {
            capturing = true;
            finalTranscript = ''; // Reset the final transcript for new capture
            console.log(foundTrigger);
        }

        if (capturing) {
            // Update the last timestamp when speech was detected
            lastTimestamp = Date.now();
        }

        dispatchSpeechData(finalTranscript, capturing);
    };

// Check every half second to see if there's been a 2-second pause
    setInterval(() => {
        if (capturing && (Date.now() - lastTimestamp) > 1000) {
            capturing = false;
            //recognition.stop(); // Or handle the captured text as needed

            //we need to return the string but still have the funciton running

            //
            console.log("Captured after trigger:", finalTranscript);
            recognition.stop()
            // Process the finalTranscript as needed
        }
    }, 500);

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
    };

    recognition.start();

}

function dispatchSpeechData(finalTranscript: string, capturing: any) {
    const event = new CustomEvent('myExtensionSpeechData', {
        detail: {finalTranscript, capturing}
    });
    window.dispatchEvent(event);
}