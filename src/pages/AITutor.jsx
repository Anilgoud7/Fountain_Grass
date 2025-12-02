import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { THEME, Card, Button } from "../components/ui";

// Tree structure data
const treeData = {
  english: {
    name: "English",
    chapters: [
      {
        number: 1,
        name: "Chapter 1: Fiction",
        title: "Fiction",
        topics: [
          "A Dog Named Duke",
          "Best Seller",
          "Keeping It from Harold",
          "The Man Who Knew Too Much",
          "How I Taught My Grandmother to Read",
        ],
      },
      {
        number: 2,
        name: "Chapter 2: Poetry",
        title: "Poetry",
        topics: [
          "Song of the Rain",
          "Oh, I Wish I'd Looked After Me Teeth",
          "The Brook",
          "The Road Not Taken",
          "The Solitary Reaper",
          "The Seven Ages",
        ],
      },
      {
        number: 3,
        name: "Chapter 3: Drama",
        title: "Drama",
        topics: ["Villa for Sale", "The Bishop's Candlesticks"],
      },
    ],
  },
  maths: {
    name: "Mathematics",
    chapters: [
      {
        number: 1,
        name: "Chapter 1: NUMBER SYSTEMS",
        title: "NUMBER SYSTEMS",
        topics: [
          "1. Representing Real Numbers on the Number Line",
          "2. Decimal Expansions of Real Numbers",
          "3. Understanding Irrational Numbers",
          "4. Operations on Real Numbers",
          "5. Laws of Exponents for Real Numbers",
        ],
      },
      {
        number: 2,
        name: "Chapter 2: POLYNOMIALS",
        title: "POLYNOMIALS",
        topics: [
          "Introduction to Polynomials",
          "Algebraic Identities",
          "Zeroes of a Polynomial",
          "Polynomials in One Variable",
          "Remainder Theorem",
          "Factorisation of Polynomials",
        ],
      },
    ],
  },
  physics: {
    name: "Physics",
    chapters: [
      {
        number: 1,
        name: "Chapter 1: Physical Nature of Matter",
        title: "Physical Nature of Matter",
        topics: [
          "Introduction to Matter",
          "Physical Nature of Matter",
          "Characteristics of Particles of Matter",
        ],
      },
    ],
  },
};

const modes = ["quiz", "interview", "flashcard"];

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

  // Hardcoded users (you can fetch from API later)
  const users = {
    user001: "Alice Johnson",
    user002: "Bob Smith",
    user003: "Charlie Brown",
    user004: "Diana Prince",
    user005: "Edward Norton",
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  const connectWebSocket = () => {
    if (!isSessionReady) return;

    const newSessionId = sessionId || Math.random().toString().substring(10);
    setSessionId(newSessionId);
    localStorage.setItem("currentSessionId", newSessionId);

    const wsUrl = `ws://localhost:8000/ws/${newSessionId}?agent_type=${selectedSubject?.toLowerCase()}&is_audio=${isAudioEnabled}&user_id=${selectedUserId}&subject=${selectedSubject}&chapter=${selectedChapter}&topic=${selectedTopic}&mode=${selectedMode}`;

    console.log("Connecting WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setMessages([
        {
          role: "assistant",
          text: `Hello! I'm your AI Tutor for ${selectedSubject} - ${selectedTopic}. How can I help you today?`,
        },
      ]);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.turn_complete) {
        currentMessageIdRef.current = null;
        setIsTyping(false);
        return;
      }

      if (message.mime_type === "text/plain" && message.data) {
        setIsTyping(false);

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          // If last message is from model and we're still streaming, append to it
          if (lastMessage?.role === "model" && lastMessage?.isStreaming) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                text: lastMessage.text + message.data,
              },
            ];
          }

          // Otherwise create new message
          return [
            ...prev,
            {
              role: message.role || "model",
              text: message.data,
              isStreaming: true,
            },
          ];
        });
      }

      if (message.mime_type === "audio/pcm") {
        // Handle audio if needed
        console.log("Received audio data");
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
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
      websocket.close();
      setWebsocket(null);
      setIsConnected(false);
    }
  };

  // Send message
  const handleSend = () => {
    if (!input.trim() || !isConnected) return;

    const userMessage = {
      mime_type: "text/plain",
      data: input,
      role: "user",
    };

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    // Send via WebSocket
    websocket.send(JSON.stringify(userMessage));
    setInput("");
    setIsTyping(true);
  };

  // User selection
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  // Subject selection
  const handleSubjectSelect = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedMode(null);
  };

  // Chapter selection
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter.name.replace(/^Chapter \d+:\s*/, ""));
    setSelectedTopic(null);
    setSelectedMode(null);
  };

  // Topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedMode(null);
  };

  // Mode selection
  const handleModeSelect = (mode) => {
    if (!selectedUserId) {
      alert("Please select a user first!");
      return;
    }

    setSelectedMode(mode);
    setIsSessionReady(true);
    setMessages([]);
    disconnectWebSocket();
    setSessionId(null);

    // Connect after a short delay
    setTimeout(() => {
      connectWebSocket();
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Reconnect when session is ready
  useEffect(() => {
    if (isSessionReady && !websocket) {
      connectWebSocket();
    }
  }, [isSessionReady]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* User Selection */}
      <Card title="👤 Select User">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {modes.map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "solid" : "soft"}
                onClick={() => handleModeSelect(mode)}
                style={{
                  backgroundColor:
                    selectedMode === mode
                      ? mode === "quiz"
                        ? "#4caf50"
                        : mode === "interview"
                        ? "#2196f3"
                        : "#ff9800"
                      : undefined,
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Connection Status */}
      {isSessionReady && (
        <div
          style={{
            padding: 8,
            textAlign: "center",
            fontSize: 14,
            color: isConnected ? "#4caf50" : "#f44336",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isConnected ? "#4caf50" : "#f44336",
              marginRight: 8,
            }}
          />
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      )}

      {/* Chat Interface */}
      {isSessionReady && (
        <Card title="AI Tutor - Chat">
          <div
            style={{
              height: "400px",
              overflowY: "auto",
              background: THEME.bgSoft,
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  background: msg.role === "user" ? THEME.primary : THEME.bg,
                  color: msg.role === "user" ? "#fff" : THEME.text,
                  borderRadius: 8,
                  maxWidth: "80%",
                  marginLeft: msg.role === "user" ? "auto" : 0,
                }}
              >
                <strong>{msg.role === "user" ? "You" : "AI Tutor"}:</strong>
                <p style={{ margin: "4px 0 0", whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </p>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  padding: 12,
                  background: THEME.bg,
                  borderRadius: 8,
                  maxWidth: "80%",
                }}
              >
                <strong>AI Tutor:</strong>
                <p style={{ margin: "4px 0 0" }}>Typing...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              disabled={!isConnected}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${THEME.border}`,
                borderRadius: 6,
                background: THEME.bg,
                color: THEME.text,
              }}
            />
            <Button onClick={handleSend} disabled={!isConnected}>
              Send
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AITutor;
