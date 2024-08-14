class SpeechRecognizer {
    constructor(outputElement) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            throw new Error('Speech Recognition API not supported in this browser.');
        }

        this.baseRecognizer = new SpeechRecognition();
        this.baseRecognizer.lang = 'en-US';
        this.baseRecognizer.interimResults = true;
        this.baseRecognizer.continuous = true;

        this.output = outputElement;
        this.currentTranscript = '';
    }

    start() {
        this.baseRecognizer.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.currentTranscript += ' ' + finalTranscript;
                this.output.textContent = this.currentTranscript.trim();
            }

            if (interimTranscript) {
                this.output.textContent = this.currentTranscript + ' ' + interimTranscript;
            }
        };

        this.baseRecognizer.onerror = (event) => {
            console.error('Error occurred in speech recognition:', event.error);
            this.output.textContent = 'Error occurred: ' + event.error;
        };

        this.baseRecognizer.onend = () => {
            if (this.baseRecognizer.continuous) {
                this.baseRecognizer.start();
            }
        };

        this.baseRecognizer.start();
        this.output.textContent = 'Listening...';
    }

    stop() {
        this.baseRecognizer.stop();
        this.output.textContent = 'Recognition stopped.';
        this.currentTranscript = '';
    }
}