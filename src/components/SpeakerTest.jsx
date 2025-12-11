import React, { useState } from "react";
import { testSpeaker } from "../utils/audio-player";

function SpeakerTest() {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      await testSpeaker();
      alert("✅ Speaker test completed! Did you hear the beep?");
    } catch (error) {
      console.error("Speaker test failed:", error);
      alert("❌ Speaker test failed. Check console for errors.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <button
      onClick={handleTest}
      disabled={testing}
      style={{
        padding: "10px 20px",
        backgroundColor: testing ? "#ccc" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: testing ? "not-allowed" : "pointer",
        fontSize: "16px",
      }}
    >
      {testing ? "🔊 Testing..." : "🔊 Test Speaker"}
    </button>
  );
}

export default SpeakerTest;
