/**
 * Audio Recorder Worklet
 */

let micStream;

export async function startAudioRecorderWorklet(audioRecorderHandler) {
  // Create an AudioContext
  const audioRecorderContext = new AudioContext({ sampleRate: 16000 });
  console.log(
    "Recorder AudioContext sample rate:",
    audioRecorderContext.sampleRate
  );

  // Inline processor code
  const processorCode = `
    class PCMRecorderProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
      }

      process(inputs, outputs, parameters) {
        if (inputs.length > 0 && inputs[0].length > 0) {
          const inputChannel = inputs[0][0];
          const inputCopy = new Float32Array(inputChannel);
          this.port.postMessage(inputCopy);
        }
        return true;
      }
    }

    registerProcessor("pcm-recorder-processor", PCMRecorderProcessor);
  `;

  const blob = new Blob([processorCode], { type: "application/javascript" });
  const workletURL = URL.createObjectURL(blob);

  try {
    await audioRecorderContext.audioWorklet.addModule(workletURL);
    console.log("Audio recorder worklet loaded successfully");
  } catch (error) {
    console.error("Error loading recorder worklet:", error);
    throw error;
  } finally {
    URL.revokeObjectURL(workletURL);
  }

  // Request access to the microphone
  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    console.log("Microphone access granted");
  } catch (error) {
    console.error("Error accessing microphone:", error);
    throw new Error("Microphone access denied or not available");
  }

  const source = audioRecorderContext.createMediaStreamSource(micStream);

  // Create an AudioWorkletNode
  const audioRecorderNode = new AudioWorkletNode(
    audioRecorderContext,
    "pcm-recorder-processor"
  );

  // Connect the microphone source to the worklet
  source.connect(audioRecorderNode);

  audioRecorderNode.port.onmessage = (event) => {
    // Convert to 16-bit PCM
    const pcmData = convertFloat32ToPCM(event.data);

    // Send the PCM data to the handler
    audioRecorderHandler(pcmData);
  };

  console.log("Audio recorder connected and ready");
  return [audioRecorderNode, audioRecorderContext, micStream];
}

/**
 * Stop the microphone.
 */
export function stopMicrophone(micStream) {
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    console.log("Microphone stopped.");
  }
}

// Convert Float32 samples to 16-bit PCM
function convertFloat32ToPCM(inputData) {
  const pcm16 = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    // Clamp the value between -1 and 1
    const clamped = Math.max(-1, Math.min(1, inputData[i]));
    // Multiply by 0x7fff (32767) to scale to 16-bit PCM range
    pcm16[i] = Math.round(clamped * 0x7fff);
  }
  return pcm16.buffer;
}
