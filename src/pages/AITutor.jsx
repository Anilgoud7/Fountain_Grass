import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Button } from "../components/ui";
import { startAudioPlayerWorklet, testSpeaker } from "../utils/audio-player";
import {
  startAudioRecorderWorklet,
  stopMicrophone,
} from "../utils/audio-recorder";
import { treeData, modes, users } from "../data/treeData";

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArray(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function AITutor() {
  const { student, activeSubject } = useOutletContext();

  // WebSocket and messaging state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentMessageIdRef = useRef(null);

  // Selection state
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Audio state
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const audioPlayerNodeRef = useRef(null);
  const audioPlayerContextRef = useRef(null);
  const audioRecorderNodeRef = useRef(null);
  const audioRecorderContextRef = useRef(null);
  const micStreamRef = useRef(null);

  // Result Analysis state
  const [showResultAnalysis, setShowResultAnalysis] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState([]);

  // Add speaker test state
  const [isTesting, setIsTesting] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio recorder handler - with better error handling
  const audioRecorderHandler = useRef((pcmData) => {
    if (!isRecording) {
      console.warn("Not recording");
      return;
    }

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready, state:", websocket?.readyState);
      return;
    }

    try {
      const base64Data = arrayBufferToBase64(pcmData);

      websocket.send(
        JSON.stringify({
          mime_type: "audio/pcm",
          data: base64Data,
        })
      );

      // Log occasionally
      if (Math.random() < 0.02) {
        console.log(
          "[CLIENT TO AGENT] sent audio data, size:",
          pcmData.byteLength
        );
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  });

  // Update the handler ref when dependencies change
  useEffect(() => {
    audioRecorderHandler.current = (pcmData) => {
      if (!isRecording) {
        return;
      }

      if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        return;
      }

      try {
        const base64Data = arrayBufferToBase64(pcmData);

        websocket.send(
          JSON.stringify({
            mime_type: "audio/pcm",
            data: base64Data,
          })
        );

        if (Math.random() < 0.02) {
          console.log(
            "[CLIENT TO AGENT] sent audio, size:",
            pcmData.byteLength
          );
        }
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    };
  }, [isRecording, websocket]);

  // Start audio - improved
  const startAudio = async () => {
    try {
      console.log("=== Starting Audio System ===");

      // 1. Start audio player first
      console.log("Starting audio player...");
      const [playerNode, playerCtx] = await startAudioPlayerWorklet();
      audioPlayerNodeRef.current = playerNode;
      audioPlayerContextRef.current = playerCtx;
      console.log("✓ Audio player started, sample rate:", playerCtx.sampleRate);

      // 2. Start audio recorder
      console.log("Starting audio recorder...");
      const [recorderNode, recorderCtx, stream] =
        await startAudioRecorderWorklet((pcmData) =>
          audioRecorderHandler.current(pcmData)
        );
      audioRecorderNodeRef.current = recorderNode;
      audioRecorderContextRef.current = recorderCtx;
      micStreamRef.current = stream;
      console.log(
        "✓ Audio recorder started, sample rate:",
        recorderCtx.sampleRate
      );

      // 3. Set recording state
      setIsRecording(true);
      console.log("=== Audio System Started Successfully ===");

      return true;
    } catch (error) {
      console.error("=== Error Starting Audio ===", error);
      alert(
        `Failed to start audio: ${error.message}\n\nPlease check microphone permissions.`
      );
      setIsAudioEnabled(false);
      return false;
    }
  };

  // Stop audio - improved
  const stopAudio = () => {
    console.log("=== Stopping Audio System ===");

    try {
      if (audioRecorderNodeRef.current) {
        audioRecorderNodeRef.current.disconnect();
        audioRecorderNodeRef.current = null;
        console.log("✓ Audio recorder disconnected");
      }

      if (audioRecorderContextRef.current) {
        audioRecorderContextRef.current
          .close()
          .catch((err) => console.warn("Error closing recorder context:", err));
        audioRecorderContextRef.current = null;
        console.log("✓ Audio recorder context closed");
      }

      if (micStreamRef.current) {
        stopMicrophone(micStreamRef.current);
        micStreamRef.current = null;
        console.log("✓ Microphone stopped");
      }

      if (audioPlayerNodeRef.current) {
        audioPlayerNodeRef.current.disconnect();
        audioPlayerNodeRef.current = null;
        console.log("✓ Audio player disconnected");
      }

      if (audioPlayerContextRef.current) {
        audioPlayerContextRef.current
          .close()
          .catch((err) => console.warn("Error closing player context:", err));
        audioPlayerContextRef.current = null;
        console.log("✓ Audio player context closed");
      }

      setIsRecording(false);
      console.log("=== Audio System Stopped ===");
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  // Toggle audio mode - FIXED VERSION
  const handleToggleAudio = async () => {
    if (!isSessionReady) {
      alert("Please select all options first!");
      return;
    }

    if (isAudioEnabled) {
      console.log("=== Disabling Audio Mode ===");

      // Stop audio first
      stopAudio();
      setIsAudioEnabled(false);

      // Reconnect without audio
      disconnectWebSocket();
      await new Promise((resolve) => setTimeout(resolve, 500));

      // CRITICAL FIX: Pass false explicitly
      connectWebSocket(false);
    } else {
      console.log("=== Enabling Audio Mode ===");

      // Set audio enabled (but it won't update immediately)
      setIsAudioEnabled(true);

      // Start audio system
      const audioStarted = await startAudio();

      if (audioStarted) {
        // Close existing connection
        disconnectWebSocket();

        // Wait a bit for audio to fully initialize
        await new Promise((resolve) => setTimeout(resolve, 500));

        // CRITICAL FIX: Pass true explicitly
        connectWebSocket(true);
      } else {
        setIsAudioEnabled(false);
      }
    }
  };

  // WebSocket connection - FIXED to check audio state
  const connectWebSocket = (forceAudioState = null) => {
    if (!isSessionReady) {
      console.warn("Session not ready");
      return;
    }

    const newSessionId = sessionId || Math.random().toString().substring(10);
    setSessionId(newSessionId);
    localStorage.setItem("currentSessionId", newSessionId);

    // CRITICAL FIX: Use explicit state instead of isAudioEnabled
    const effectiveAudioState =
      forceAudioState !== null ? forceAudioState : isAudioEnabled;

    const wsUrl = `ws://localhost:8000/ws/${newSessionId}?agent_type=${selectedSubject?.toLowerCase()}&is_audio=${effectiveAudioState}&user_id=${selectedUserId}&subject=${selectedSubject}&chapter=${selectedChapter}&topic=${selectedTopic}&mode=${selectedMode}`;

    console.log("=== Connecting WebSocket ===");
    console.log("URL:", wsUrl);
    console.log("Audio enabled:", effectiveAudioState);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✓ WebSocket connected");
      console.log("WebSocket state:", ws.readyState);

      // CRITICAL: Resume audio context after WebSocket connection
      if (effectiveAudioState && audioPlayerContextRef.current) {
        if (audioPlayerContextRef.current.state === "suspended") {
          audioPlayerContextRef.current.resume().then(() => {
            console.log("✓ AudioContext resumed after connection");
          });
        }
      }

      setIsConnected(true);
      setMessages([
        {
          role: "assistant",
          text: `Hello! I'm your AI Tutor for ${selectedSubject} - ${selectedTopic}. ${
            effectiveAudioState
              ? "Voice mode is enabled. You can speak to me!"
              : "How can I help you today?"
          }`,
        },
      ]);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Log messages for debugging
      if (message.mime_type === "audio/pcm") {
        console.log(
          "[AGENT TO CLIENT] Received AUDIO, data length:",
          message.data?.length || 0
        );
      } else if (message.mime_type === "text/plain") {
        console.log(
          "[AGENT TO CLIENT] Received TEXT:",
          message.data?.substring(0, 50)
        );
      }

      if (message.turn_complete) {
        console.log("[AGENT TO CLIENT] Turn complete");
        currentMessageIdRef.current = null;
        setIsTyping(false);
        return;
      }

      // Handle text messages
      if (message.mime_type === "text/plain" && message.data) {
        setIsTyping(false);

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          if (lastMessage?.role === "model" && lastMessage?.isStreaming) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                text: lastMessage.text + message.data,
              },
            ];
          }

          return [
            ...prev,
            {
              role: message.role || "model",
              text: message.data,
              isStreaming: true,
              hasAudio: effectiveAudioState,
            },
          ];
        });
      }

      // Handle audio messages
      if (message.mime_type === "audio/pcm" && message.data) {
        console.log("[AUDIO PLAYBACK] Attempting to play audio...");

        if (!audioPlayerNodeRef.current) {
          console.error("[AUDIO PLAYBACK] ❌ Audio player not initialized!");
          return;
        }

        if (!audioPlayerContextRef.current) {
          console.error("[AUDIO PLAYBACK] ❌ Audio context not available!");
          return;
        }

        console.log(
          "[AUDIO PLAYBACK] Audio context state:",
          audioPlayerContextRef.current.state
        );
        console.log(
          "[AUDIO PLAYBACK] Sample rate:",
          audioPlayerContextRef.current.sampleRate
        );

        // CRITICAL: Always try to resume before playing
        if (audioPlayerContextRef.current.state === "suspended") {
          console.log("[AUDIO PLAYBACK] ⚠️ Context suspended, resuming...");
          audioPlayerContextRef.current
            .resume()
            .then(() => {
              console.log("[AUDIO PLAYBACK] ✓ Context resumed");
              playAudioData(message.data);
            })
            .catch((err) => {
              console.error("[AUDIO PLAYBACK] ❌ Failed to resume:", err);
            });
        } else {
          playAudioData(message.data);
        }
      }
    };

    // Helper function to play audio data - WITH SAFETY CHECK
    function playAudioData(base64Data) {
      try {
        let audioData = base64ToArray(base64Data);

        // SAFETY CHECK: Int16Array requires even byte length
        if (audioData.byteLength % 2 !== 0) {
          console.warn("[AUDIO PLAYBACK] ⚠️ Odd byte length, trimming 1 byte");
          audioData = audioData.slice(0, audioData.byteLength - 1);
        }

        console.log(
          "[AUDIO PLAYBACK] ✓ Decoded audio size:",
          audioData.byteLength,
          "bytes"
        );

        // Send audio data to the worklet
        audioPlayerNodeRef.current.port.postMessage(audioData);
        console.log("[AUDIO PLAYBACK] ✓ Audio data sent to worklet");
      } catch (error) {
        console.error("[AUDIO PLAYBACK] ❌ Error playing audio:", error);
      }
    }

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setWebsocket(ws);
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (websocket) {
      console.log("Closing WebSocket...");
      websocket.close();
      setWebsocket(null);
      setIsConnected(false);
    }
  };

  // Send message via WebSocket
  const sendMessage = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {
      console.error("Cannot send message, WebSocket not open");
    }
  };

  // Send text message
  const handleSend = () => {
    if (!input.trim() || !isConnected) return;

    const userMessage = {
      mime_type: "text/plain",
      data: input,
      role: "user",
    };

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    sendMessage(userMessage);
    setInput("");
    setIsTyping(true);
  };

  // Add speaker test function
  const handleTestSpeaker = async () => {
    setIsTesting(true);
    try {
      await testSpeaker();
      alert("✅ Speaker test completed! Did you hear the beep?");
    } catch (error) {
      console.error("Speaker test failed:", error);
      alert("❌ Speaker test failed. Check console for errors.");
    } finally {
      setIsTesting(false);
    }
  };

  // Result Analysis functions
  const startResultAnalysis = async () => {
    const currentSessionId = localStorage.getItem("currentSessionId");

    if (!currentSessionId) {
      alert("No active session found. Please start an interview first.");
      return;
    }

    setAnalysisStatus("loading");

    try {
      const response = await fetch("http://localhost:8000/api/analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: currentSessionId,
        }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        setAnalysisStatus("success");
        console.log("Analysis completed for session:", currentSessionId);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      setAnalysisStatus("error");
    }
  };

  const viewResult = async () => {
    const currentSessionId = localStorage.getItem("currentSessionId");

    if (!currentSessionId) {
      alert("No session ID found. Please complete the analysis first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/result/${currentSessionId}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setResultData(data);
        setShowResultModal(true);
      } else {
        alert("No results found for this session.");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Failed to fetch results. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
      stopAudio();
    };
  }, []);

  // Selection handlers
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    console.log("Selected user:", userId, users[userId]);

    // If already connected, reconnect with new user
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      disconnectWebSocket();
      setTimeout(() => {
        if (isSessionReady) {
          connectWebSocket();
        }
      }, 500);
    }
  };

  const handleSubjectSelect = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedMode(null);
    setIsSessionReady(false);

    // Close existing connection
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      disconnectWebSocket();
    }

    console.log("Selected subject:", treeData[subjectKey].name);
  };

  const handleChapterSelect = (chapter) => {
    // Extract chapter name without "Chapter X: " prefix
    const chapterName = chapter.name.replace(/^Chapter \d+:\s*/, "");
    setSelectedChapter(chapterName);
    setSelectedTopic(null);
    setSelectedMode(null);
    setIsSessionReady(false);

    // Close existing connection
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      disconnectWebSocket();
    }

    console.log("Selected chapter:", chapterName);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedMode(null);
    setIsSessionReady(false);

    // Close existing connection
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      disconnectWebSocket();
    }

    console.log("Selected topic:", topic);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setIsSessionReady(true);

    // CHANGED: Show result analysis section for ALL modes
    setShowResultAnalysis(true);

    console.log("Selected mode:", mode);
    console.log("Session ready - connecting WebSocket...");

    // Clear messages and connect
    setMessages([]);

    // Close existing connection and create new session
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      disconnectWebSocket();
    }

    // Connect after a short delay (no audio state passed, defaults to false)
    setTimeout(() => {
      connectWebSocket();
    }, 500);
  };

  return (
    <div className="grid gap-4 p-4">
      {/* User Selection */}
      <Card title="👤 Select User">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(users).map(([userId, userName]) => (
            <Button
              key={userId}
              variant={selectedUserId === userId ? "solid" : "soft"}
              onClick={() => handleUserSelect(userId)}
            >
              {userName}
            </Button>
          ))}
        </div>
      </Card>

      {/* Subject Selection */}
      <Card title="📚 Select Subject">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(treeData).map(([key, subject]) => (
            <Button
              key={key}
              variant={selectedSubject === key ? "solid" : "soft"}
              onClick={() => handleSubjectSelect(key)}
            >
              {subject.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Chapter Selection */}
      {selectedSubject && (
        <Card title="📖 Select Chapter">
          <div className="flex gap-2 flex-wrap">
            {treeData[selectedSubject].chapters.map((chapter) => (
              <Button
                key={chapter.number}
                variant={
                  selectedChapter ===
                  chapter.name.replace(/^Chapter \d+:\s*/, "")
                    ? "solid"
                    : "soft"
                }
                onClick={() => handleChapterSelect(chapter)}
              >
                {chapter.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Topic Selection */}
      {selectedChapter && selectedSubject && (
        <Card title="📝 Select Topic">
          <div className="flex gap-2 flex-wrap">
            {treeData[selectedSubject].chapters
              .find((c) => c.name.includes(selectedChapter))
              ?.topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "solid" : "soft"}
                  onClick={() => handleTopicSelect(topic)}
                >
                  {topic}
                </Button>
              ))}
          </div>
        </Card>
      )}

      {/* Mode Selection */}
      {selectedTopic && (
        <Card title="🎯 Select Mode">
          <div className="flex gap-2 flex-wrap">
            {modes.map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "solid" : "soft"}
                onClick={() => handleModeSelect(mode)}
                className={`${
                  selectedMode === mode
                    ? mode === "quiz"
                      ? "bg-green-500 text-white"
                      : mode === "interview"
                      ? "bg-blue-500 text-white"
                      : "bg-orange-500 text-white"
                    : ""
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* SPEAKER TEST SECTION - Before session starts */}
      {selectedMode && !isConnected && (
        <Card title="🔊 Speaker Test">
          <div className="flex flex-col gap-3">
            <p className="text-gray-600 text-sm mb-2">
              Test your speakers before starting the session to ensure you can
              hear the AI tutor.
            </p>
            <Button
              onClick={handleTestSpeaker}
              disabled={isTesting}
              className={`${
                isTesting ? "bg-gray-400" : "bg-green-600"
              } text-white py-3 px-6 text-base font-semibold`}
            >
              {isTesting ? "🔊 Testing..." : "🔊 Test Speaker (Beep)"}
            </Button>
          </div>
        </Card>
      )}

      {/* Connection Status & Audio Controls */}
      {isSessionReady && (
        <Card>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  isConnected ? "text-green-500" : "text-red-500"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
              {isRecording && (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 ml-4 animate-pulse" />
                  <span className="text-sm text-red-600">Recording...</span>
                </>
              )}
            </div>
            <Button
              onClick={handleToggleAudio}
              variant={isAudioEnabled ? "solid" : "soft"}
              className={`${
                isAudioEnabled ? "bg-red-600" : "bg-green-600"
              } text-white`}
            >
              {isAudioEnabled ? "🔴 Stop Voice" : "🎤 Enable Voice"}
            </Button>
          </div>
        </Card>
      )}

      {/* Chat Interface */}
      {isSessionReady && (
        <Card title="AI Tutor - Chat">
          <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white text-gray-900"
                } ${
                  msg.hasAudio && msg.role !== "user"
                    ? "border-l-4 border-green-500"
                    : ""
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "AI Tutor"}:</strong>
                {msg.hasAudio && msg.role !== "user" && (
                  <span className="ml-2">🔊</span>
                )}
                <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}

            {isTyping && (
              <div className="p-3 bg-white rounded-lg max-w-[80%]">
                <strong>AI Tutor:</strong>
                <p className="mt-1">Typing...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              disabled={!isConnected}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <Button onClick={handleSend} disabled={!isConnected}>
              Send
            </Button>
          </div>
        </Card>
      )}

      {/* Result Analysis Section - Only for Interview Mode */}
      {showResultAnalysis && (
        <Card title="📊 Result Analysis">
          <div className="flex flex-col gap-3">
            <p className="text-gray-600 text-sm mb-2">
              Analyze your performance in {selectedMode} mode and view detailed
              results.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={startResultAnalysis}
                disabled={analysisStatus === "loading"}
                className="bg-indigo-600 text-white"
              >
                🔍 Start Result Analysis
              </Button>
              {analysisStatus === "success" && (
                <Button
                  onClick={viewResult}
                  className="bg-green-600 text-white"
                >
                  📈 View Result
                </Button>
              )}
            </div>
            {analysisStatus && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  analysisStatus === "loading"
                    ? "bg-orange-50 text-orange-700"
                    : analysisStatus === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {analysisStatus === "loading" && "Running analysis..."}
                {analysisStatus === "success" &&
                  "✅ Analysis completed successfully!"}
                {analysisStatus === "error" &&
                  "❌ Analysis failed. Please try again."}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Result Modal - Already using Tailwind */}
      {showResultModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResultModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  {selectedMode === "quiz" && "🎯"}
                  {selectedMode === "interview" && "💼"}
                  {selectedMode === "flashcard" && "📚"}
                  {selectedMode?.charAt(0).toUpperCase() +
                    selectedMode?.slice(1)}{" "}
                  Results
                </h2>
                <p className="text-blue-100 mt-1">
                  Detailed Performance Analysis
                </p>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
              >
                <span className="text-3xl">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {resultData.map((result, index) => {
                const mode = result.quiz
                  ? "quiz"
                  : result.interview
                  ? "interview"
                  : "flashcard";

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Session Info Card */}
                    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase font-semibold">
                            User
                          </span>
                          <span className="text-sm font-bold text-gray-800 mt-1">
                            {users[result.user_id] || result.user_id}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase font-semibold">
                            Subject
                          </span>
                          <span className="text-sm font-bold text-gray-800 mt-1 capitalize">
                            {result.subject}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase font-semibold">
                            Topic
                          </span>
                          <span className="text-sm font-bold text-gray-800 mt-1">
                            {result.topic}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase font-semibold">
                            Date
                          </span>
                          <span className="text-sm font-bold text-gray-800 mt-1">
                            {new Date(result.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Results */}
                    {result.quiz && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                          🎯 Quiz Performance
                        </h3>

                        {/* Score Progress Bar */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-600">
                              Overall Score
                            </span>
                            <span className="text-2xl font-bold text-blue-600">
                              {result.quiz.correctly_answered}/
                              {result.quiz.total_questions}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  (result.quiz.correctly_answered /
                                    result.quiz.total_questions) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {Math.round(
                              (result.quiz.correctly_answered /
                                result.quiz.total_questions) *
                                100
                            )}
                            % Correct
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                            <div className="text-green-600 text-3xl mb-2">
                              ✓
                            </div>
                            <div className="text-2xl font-bold text-green-700">
                              {result.quiz.correctly_answered}
                            </div>
                            <div className="text-sm text-green-600">
                              Correct Answers
                            </div>
                          </div>
                          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="text-red-600 text-3xl mb-2">✗</div>
                            <div className="text-2xl font-bold text-red-700">
                              {result.quiz.wrongly_answered}
                            </div>
                            <div className="text-sm text-red-600">
                              Wrong Answers
                            </div>
                          </div>
                        </div>

                        {/* Weak Areas */}
                        {result.quiz.concepts_weak_in &&
                          result.quiz.concepts_weak_in !== "None" && (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                  <h4 className="font-semibold text-yellow-800 mb-2">
                                    Areas to Improve
                                  </h4>
                                  <p className="text-sm text-yellow-700">
                                    {result.quiz.concepts_weak_in}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Interview Results */}
                    {result.interview && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                          💼 Interview Assessment
                        </h3>

                        {/* Score Display (if available) */}
                        {result.interview.score && (
                          <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="text-center">
                              <div className="text-5xl font-bold text-blue-600 mb-2">
                                {result.interview.score}
                              </div>
                              <p className="text-gray-600">Interview Score</p>
                            </div>
                          </div>
                        )}

                        {/* Weak Concepts */}
                        {result.interview.concepts_weak_in &&
                          result.interview.concepts_weak_in.length > 0 && (
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                              <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">📌</span>
                                <h4 className="font-semibold text-orange-800 text-lg">
                                  Concepts to Review
                                </h4>
                              </div>
                              <ul className="space-y-3 ml-10">
                                {Array.isArray(
                                  result.interview.concepts_weak_in
                                ) ? (
                                  result.interview.concepts_weak_in.map(
                                    (concept, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-orange-700 flex items-start gap-2"
                                      >
                                        <span className="text-orange-500 mt-1">
                                          •
                                        </span>
                                        <span>{concept}</span>
                                      </li>
                                    )
                                  )
                                ) : (
                                  <li className="text-sm text-orange-700">
                                    {result.interview.concepts_weak_in}
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Flashcard Results */}
                    {result.flashcard && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                          📚 Flashcard Review
                        </h3>

                        {/* Weak Concepts */}
                        {result.flashcard.concepts_weak_in && (
                          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">🎯</span>
                              <div>
                                <h4 className="font-semibold text-purple-800 mb-2">
                                  Focus Areas
                                </h4>
                                <p className="text-sm text-purple-700">
                                  {result.flashcard.concepts_weak_in}
                                </p>
                                <div className="mt-4 bg-purple-100 rounded-lg p-3">
                                  <p className="text-xs text-purple-600">
                                    💡 <strong>Tip:</strong> Review these
                                    concepts using the flashcard mode to
                                    strengthen your understanding.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-100 p-4 rounded-b-2xl border-t-2 border-gray-200">
              <button
                onClick={() => setShowResultModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
        `}
      </style>
    </div>
  );
}

export default AITutor;
