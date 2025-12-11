/**
 * Audio Player Worklet
 */

export async function startAudioPlayerWorklet() {
  // 1. Create an AudioContext
  const audioContext = new AudioContext({
    sampleRate: 24000,
  });

  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === "suspended") {
    await audioContext.resume();
    console.log("AudioContext resumed");
  }

  // 2. Use inline processor (since external file loading might fail)
  const processorCode = `
    class PCMPlayerProcessor extends AudioWorkletProcessor {
      constructor() {
        super();

        // Init buffer
        this.bufferSize = 24000 * 180; // 24kHz x 180 seconds
        this.buffer = new Float32Array(this.bufferSize);
        this.writeIndex = 0;
        this.readIndex = 0;

        // Handle incoming messages from main thread
        this.port.onmessage = (event) => {
          // Reset the buffer when 'endOfAudio' message received
          if (event.data && event.data.command === "endOfAudio") {
            this.readIndex = this.writeIndex;
            console.log("endOfAudio received, clearing the buffer.");
            return;
          }

          try {
            // Decode the data to int16 array
            const int16Samples = new Int16Array(event.data);
            this._enqueue(int16Samples);
          } catch (error) {
            console.error("Error processing audio:", error);
          }
        };
      }

      _enqueue(int16Samples) {
        for (let i = 0; i < int16Samples.length; i++) {
          // Convert 16-bit integer to float in [-1, 1]
          const floatVal = int16Samples[i] / 32768.0;

          // Store in ring buffer
          this.buffer[this.writeIndex] = floatVal;
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;

          // Overflow handling (overwrite oldest samples)
          if (this.writeIndex === this.readIndex) {
            this.readIndex = (this.readIndex + 1) % this.bufferSize;
          }
        }
      }

      process(inputs, outputs, parameters) {
        const output = outputs[0];
        const framesPerBlock = output[0].length;
        
        for (let frame = 0; frame < framesPerBlock; frame++) {
          // Get sample from buffer
          const sample = this.buffer[this.readIndex];
          
          // Write to both channels
          output[0][frame] = sample; // left channel
          if (output.length > 1) {
            output[1][frame] = sample; // right channel
          }

          // Move read index only if we have data
          if (this.readIndex !== this.writeIndex) {
            this.readIndex = (this.readIndex + 1) % this.bufferSize;
          }
        }

        return true;
      }
    }

    registerProcessor("pcm-player-processor", PCMPlayerProcessor);
  `;

  // Create a Blob URL from the processor code
  const blob = new Blob([processorCode], { type: "application/javascript" });
  const workletURL = URL.createObjectURL(blob);

  try {
    await audioContext.audioWorklet.addModule(workletURL);
    console.log("Worklet loaded successfully");
  } catch (error) {
    console.error("Error loading worklet:", error);
    throw error;
  } finally {
    URL.revokeObjectURL(workletURL);
  }

  // 3. Create an AudioWorkletNode
  const audioPlayerNode = new AudioWorkletNode(
    audioContext,
    "pcm-player-processor",
    {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2], // Stereo output
    }
  );

  // 4. Connect to the destination
  audioPlayerNode.connect(audioContext.destination);

  console.log("Audio player connected. State:", audioContext.state);
  console.log("Sample rate:", audioContext.sampleRate);

  return [audioPlayerNode, audioContext];
}

/**
 * Test speaker by playing a 440Hz beep for 1 second
 */
export async function testSpeaker() {
  const audioContext = new AudioContext();

  // Resume context if suspended
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  // Create oscillator (sine wave at 440Hz - A note)
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

  // Set volume
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

  // Connect: oscillator -> gain -> destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Play for 1 second
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);

  // Cleanup
  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
    audioContext.close();
  };

  return true;
}
