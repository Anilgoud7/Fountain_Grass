// src/pages/VoiceTutorPage.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * VoiceTutorPage.jsx
 * React port of your working app.js (adk-streaming sample)
 *
 * Notes:
 * - Adjust WS_BASE if backend is not on same host/port.
 * - Uses MediaRecorder for audio capture and sends base64 audio chunks in JSON
 *   similar to your original worklet-based client.
 */

const WS_BASE = (typeof window !== "undefined" ? `ws://${window.location.host}/ws/` : "ws://localhost:8000/ws/");

// Hardcoded users (same as your HTML)
const DEFAULT_USERS = {
  user001: "Alice Johnson",
  user002: "Bob Smith",
  user003: "Charlie Brown",
  user004: "Diana Prince",
  user005: "Edward Norton",
};

// treeData: copy from your app.js (trimmed slightly for brevity, keep as-is or replace)
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
      // ... (keep rest if you want)
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
          "Representing Real Numbers on the Number Line",
          "Decimal Expansions of Real Numbers",
          "Understanding Irrational Numbers",
        ],
      },
      // ... (rest omitted for brevity)
    ],
  },
  physics: {
    name: "Physics",
    chapters: [
      {
        number: 1,
        name: "Chapter 1: Physical Nature of Matter",
        title: "Physical Nature of Matter",
        topics: ["Introduction to Matter", "Physical Nature of Matter"],
      },
    ],
  },
};

const MODES = ["quiz", "interview", "flashcard"];

export default function VoiceTutorPage() {
  // selection state
  const [users] = useState(DEFAULT_USERS);
  const [selectedUserId, setSelectedUserId] = useState(Object.keys(DEFAULT_USERS)[0]);
  const [currentSubjectKey, setCurrentSubjectKey] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  // ws & session
  const wsRef = useRef(null);
  const sessionIdRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // messages & UI
  const [messages, setMessages] = useState([]); // { id, role, text, hasAudio }
  const messagesRef = useRef(null);
  const [typingVisible, setTypingVisible] = useState(false);
  const currentMessageIdRef = useRef(null);

  // media
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const pendingChunksRef = useRef([]);

  // text input
  const [textInput, setTextInput] = useState("");

  // generate session id
  function newSessionId() {
    return Math.random().toString(36).slice(2, 11);
  }

  // helper: push message
  function pushMessage(role, text, hasAudio = false) {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages((m) => [...m, { id, role, text, hasAudio }]);
    // keep track if it's a model message (for streaming parts)
    if (role === "model") currentMessageIdRef.current = id;
    return id;
  }

  // scroll messages when changed
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typingVisible]);

  // Build ws url from current selection
  function buildWsUrl(sid, overrideIsAudio = false) {
    const params = new URLSearchParams({
      session_id: sid,
      agent_type: currentSubjectKey ? mapAgentType(currentSubjectKey) : "math",
      is_audio: String(overrideIsAudio ? overrideIsAudio : recording),
      user_id: selectedUserId || "",
      subject: currentSubjectKey ? treeData[currentSubjectKey]?.name || "" : "",
      chapter: currentChapterIndex != null ? (treeData[currentSubjectKey]?.chapters?.[currentChapterIndex]?.name || "") : "",
      topic: currentTopicIndex != null ? (treeData[currentSubjectKey]?.chapters?.[currentChapterIndex]?.topics?.[currentTopicIndex] || "") : "",
      mode: selectedMode || "",
    });
    const base = WS_BASE.endsWith("/") ? WS_BASE.slice(0, -1) : WS_BASE;
    return `${base}/${sid}?${params.toString()}`;
  }

  function mapAgentType(subjectKey) {
    // mirror mapping used in your app.js
    const map = {
      english: "english",
      maths: "math",
      physics: "physics",
    };
    return map[subjectKey] || subjectKey;
  }

  // connect websocket
  function connectWebsocket(opts = {}) {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      console.debug("Websocket already open or connecting");
      return;
    }

    const sid = newSessionId();
    sessionIdRef.current = sid;
    pushMessage("system", `Opening session ${sid}`);
    const url = buildWsUrl(sid, opts.forceIsAudio);
    try {
      const ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        setConnected(true);
        pushMessage("system", `Connected to ${url}`);
      };

      ws.onmessage = (ev) => {
        // server may send JSON text frames or binary frames
        if (typeof ev.data === "string") {
          try {
            const parsed = JSON.parse(ev.data);
            handleServerJson(parsed);
          } catch (err) {
            pushMessage("agent", ev.data);
          }
        } else {
          // binary frame (treat as audio blob)
          const blob = ev.data instanceof Blob ? ev.data : new Blob([ev.data]);
          playBlobAudio(blob);
          pushMessage("agent", "[audio]", true);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        pushMessage("system", "Socket closed — will not auto-reconnect (select mode to start new session).");
        setTypingVisible(false);
      };

      ws.onerror = (e) => {
        console.error("ws error", e);
        pushMessage("system", "WebSocket error — see console");
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("connectWebsocket failed", err);
      pushMessage("system", `Connect failed: ${err.message || err}`);
    }
  }

  // handle server JSON messages (text/audio metadata)
  function handleServerJson(msg) {
    // msg shape expected:
    // { mime_type: 'text/plain'|'audio/pcm', data: '...', role: 'model'|'user', turn_complete: true/false, ... }
    if (!msg) return;

    if (msg.type === "error") {
      pushMessage("system", `Server error: ${msg.error || JSON.stringify(msg)}`);
      return;
    }

    if (msg.type === "typing" || msg.typing) {
      setTypingVisible(true);
      // auto-hide
      setTimeout(() => setTypingVisible(false), 1400);
      return;
    }

    if (msg.turn_complete) {
      currentMessageIdRef.current = null;
      setTypingVisible(false);
      return;
    }

    if (msg.mime_type && msg.data) {
      if (msg.mime_type.startsWith("audio/")) {
        // base64 audio in msg.data
        try {
          const arr = base64ToArrayBuffer(msg.data);
          const blob = new Blob([arr], { type: msg.mime_type });
          playBlobAudio(blob);
          pushMessage("agent", "[audio]", true);
        } catch (err) {
          console.warn("failed to play base64 audio", err);
        }
        return;
      } else if (msg.mime_type === "text/plain") {
        // streaming text segments might append to same turn; follow same logic as HTML client:
        const role = msg.role || "model";
        // If there is a current model message element (turn), append text to it (simulate)
        if (role === "model" && currentMessageIdRef.current) {
          // append by replacing last message with appended text
          setMessages((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((m) => m.id === currentMessageIdRef.current);
            if (idx !== -1) {
              copy[idx] = { ...copy[idx], text: copy[idx].text + (msg.data || "") };
              return copy;
            }
            // fallback create new
            const id = Math.random().toString(36).slice(2, 9);
            return [...copy, { id, role: "agent", text: msg.data || "", hasAudio: false }];
          });
          return;
        }
        // else create a new message
        pushMessage(role === "user" ? "user" : "agent", String(msg.data || ""));
        return;
      }
    }

    // Fallback: show JSON
    pushMessage("agent", JSON.stringify(msg));
  }

  // stop ws
  function closeWebsocket() {
    try {
      if (wsRef.current) wsRef.current.close();
    } catch (err) {
      console.warn("close ws failed", err);
    } finally {
      wsRef.current = null;
      setConnected(false);
    }
  }

  // send JSON to server
  function sendJson(obj) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      pushMessage("system", "Socket not open — start session first.");
      return false;
    }
    try {
      wsRef.current.send(JSON.stringify(obj));
      return true;
    } catch (err) {
      console.warn("sendJson failed", err);
      pushMessage("system", "Send failed — see console");
      return false;
    }
  }

  // text message send (form)
  function handleSendText(e) {
    e?.preventDefault?.();
    const text = (textInput || "").trim();
    if (!text) return;
    // push user message locally
    pushMessage("user", text);
    // send structured JSON like your HTML app
    sendJson({ mime_type: "text/plain", data: text, role: "user" });
    setTextInput("");
    setTypingVisible(true);
  }

  // start session control
  function startSession() {
    if (!sessionIdRef.current) sessionIdRef.current = newSessionId();
    const payload = {
      type: "start_session",
      session_id: sessionIdRef.current,
      user_id: selectedUserId,
      subject: currentSubjectKey ? treeData[currentSubjectKey].name : "",
      chapter: currentChapterIndex != null ? treeData[currentSubjectKey].chapters[currentChapterIndex].name : "",
      topic: currentTopicIndex != null ? treeData[currentSubjectKey].chapters[currentChapterIndex].topics[currentTopicIndex] : "",
      mode: selectedMode,
    };
    sendJson(payload);
    pushMessage("system", `start_session sent`);
  }

  // audio: start recording via MediaRecorder
  async function startAudio() {
    // ensure websocket connected with is_audio param: reconnect forcing is_audio = true
    // close existing and re-open with force param
    closeWebsocket();
    connectWebsocket({ forceIsAudio: "true" });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;
      pendingChunksRef.current = [];

      recorder.ondataavailable = async (ev) => {
        if (!ev.data || ev.data.size === 0) return;

        // read blob -> arrayBuffer -> base64 and send as JSON to server
        const buf = await ev.data.arrayBuffer();
        const b64 = arrayBufferToBase64(buf);
        // send as audio chunk JSON (mirrors your original client worklet)
        sendJson({ mime_type: "audio/webm", data: b64, role: "user" });
      };

      recorder.onstart = () => {
        setRecording(true);
        pushMessage("system", "Recording started");
      };

      recorder.onstop = () => {
        setRecording(false);
        pushMessage("system", "Recording stopped");
        // send final marker
        try {
          sendJson({ type: "audio_chunk_final", is_final_chunk: true });
        } catch (err) {}
        try {
          mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        } catch (err) {}
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
      };

      recorder.onerror = (ev) => {
        console.error("recorder error", ev);
        pushMessage("system", "Recorder error — see console");
      };

      // start with timeslice for streaming
      recorder.start(250);
    } catch (err) {
      console.error("startAudio getUserMedia error", err);
      pushMessage("system", "Microphone permission denied or error");
    }
  }

  function stopAudio() {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      } else {
        setRecording(false);
      }
    } catch (err) {
      console.warn("stopAudio failed", err);
      setRecording(false);
    }
  }

  // helper to play audio blob
  function playBlobAudio(blob) {
    try {
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      a.play().catch((err) => console.warn("audio play failed", err));
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.warn("playBlobAudio error", err);
    }
  }

  // base64 <-> arraybuffer helpers
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
  function base64ToArrayBuffer(b64) {
    const binary = window.atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  // UI selection handlers (mirror HTML logic)
  function handleSelectUser(userId) {
    setSelectedUserId(userId);
    // if already connected - close and reconnect to include user_id in query
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      closeWebsocket();
      connectWebsocket();
    }
  }

  function handleSelectSubject(key) {
    setCurrentSubjectKey(key);
    setCurrentChapterIndex(null);
    setCurrentTopicIndex(null);
    // close existing connection: new session will be created when mode is selected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      closeWebsocket();
    }
  }

  function handleSelectChapter(index) {
    setCurrentChapterIndex(index);
    setCurrentTopicIndex(null);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      closeWebsocket();
    }
  }

  function handleSelectTopic(index) {
    setCurrentTopicIndex(index);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      closeWebsocket();
    }
  }

  function handleSelectMode(mode) {
    setSelectedMode(mode);

    // set subject/chapter/topic strings used in queries are already derived in buildWsUrl
    // Recreate websocket (or connect if none) to start session for this mode
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      closeWebsocket();
      // on close we don't auto-reconnect here, so create new connection:
      connectWebsocket();
    } else {
      connectWebsocket();
    }

    // clear messages for new session — match HTML behavior
    setMessages([]);
  }

  // convenience: auto build UI lists arrays
  const subjectKeys = Object.keys(treeData);

  // JSX render
  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto", fontFamily: "Inter, system-ui, -apple-system" }}>
      <header style={{ marginBottom: 18, borderBottom: "1px solid #E8EAED", paddingBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, color: "#4285F4" }}>Voice Assistant</h1>
            <div style={{ color: "#5F6368" }}>Interactive voice & chat tutoring</div>
          </div>
          <div>
            <button onClick={() => { window.location.href = "/recommendations"; }} style={{ padding: "8px 16px", borderRadius: 20, background: "linear-gradient(135deg,#34A853 0%,#2E7D32 100%)", color: "#fff", border: "none" }}>📊 View Student Recommendations</button>
          </div>
        </div>
      </header>

      {/* Users */}
      <section style={{ background: "#fff", padding: 12, borderRadius: 12, marginBottom: 16 }}>
        <strong style={{ marginRight: 8 }}>Select User:</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {Object.entries(users).map(([id, name]) => (
            <button key={id} onClick={() => handleSelectUser(id)} style={{
              padding: "8px 12px",
              borderRadius: 18,
              border: selectedUserId === id ? "2px solid #4285F4" : "1px solid #E8EAED",
              background: selectedUserId === id ? "#4285F4" : "#fff",
              color: selectedUserId === id ? "#fff" : "#222"
            }}>
              <span style={{ marginRight: 8, width: 28, height: 28, borderRadius: "50%", background: "#E8EAED", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{name.split(" ").map(s => s[0]).slice(0, 2).join("")}</span>
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Tree selection */}
      <section style={{ background: "#fff", padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#4285F4", marginBottom: 8 }}>Select: Subject → Chapter → Topic → Mode</div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5F6368", marginBottom: 8 }}>1. Subject</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {subjectKeys.map((k) => (
                <button key={k} onClick={() => handleSelectSubject(k)} style={{ padding: "8px 12px", borderRadius: 8, border: currentSubjectKey === k ? "2px solid #4285F4" : "1px solid #E8EAED", background: currentSubjectKey === k ? "#E8F0FF" : "#fff" }}>
                  {treeData[k].name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5F6368", marginBottom: 8 }}>2. Chapter</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 220 }}>
              {(currentSubjectKey != null ? treeData[currentSubjectKey].chapters : []).map((ch, idx) => (
                <button key={idx} onClick={() => handleSelectChapter(idx)} style={{ padding: "8px 12px", borderRadius: 8, border: currentChapterIndex === idx ? "2px solid #4285F4" : "1px solid #E8EAED", background: currentChapterIndex === idx ? "#E8F0FF" : "#fff" }}>
                  {ch.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5F6368", marginBottom: 8 }}>3. Topic</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 240 }}>
              {(currentSubjectKey != null && currentChapterIndex != null ? (treeData[currentSubjectKey].chapters[currentChapterIndex].topics || []) : []).map((t, idx) => (
                <button key={idx} onClick={() => handleSelectTopic(idx)} style={{ padding: "8px 12px", borderRadius: 8, border: currentTopicIndex === idx ? "2px solid #4285F4" : "1px solid #E8EAED", background: currentTopicIndex === idx ? "#E8F0FF" : "#fff" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5F6368", marginBottom: 8 }}>4. Mode</div>
            <div style={{ display: "flex", gap: 8 }}>
              {MODES.map((m) => (
                <button key={m} onClick={() => handleSelectMode(m)} style={{ padding: "8px 12px", borderRadius: 8, border: selectedMode === m ? "2px solid #4285F4" : "1px solid #E8EAED", background: selectedMode === m ? "#E8F0FF" : "#fff" }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chat area */}
      <section style={{ background: "#fff", borderRadius: 12, padding: 0, overflow: "hidden" }}>
        <div ref={messagesRef} style={{ height: 360, overflowY: "auto", padding: 16 }}>
          {typingVisible && <div style={{ display: "inline-flex", gap: 6, padding: 10, background: "#E8EAED", borderRadius: 8, marginBottom: 8 }}> <span style={{width:8,height:8,background:"#70757A",borderRadius:"50%"}}></span><span style={{width:8,height:8,background:"#70757A",borderRadius:"50%"}}></span><span style={{width:8,height:8,background:"#70757A",borderRadius:"50%"}}></span></div>}
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 10, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#4285F4" : "#E8EAED", color: m.role === "user" ? "#fff" : "#000", padding: "10px 14px", borderRadius: 8, maxWidth: "85%" }}>
              {m.hasAudio && <span style={{ marginRight: 8 }}>🔊</span>}
              <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendText} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #E8EAED", alignItems: "center" }}>
          <input value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type your message here..." style={{ flex: 1, padding: 10, borderRadius: 24, border: "1px solid #BDC1C6" }} />
          <button type="button" onClick={handleSendText} disabled={!connected || !textInput.trim()} style={{ padding: "8px 14px", borderRadius: 20, background: connected ? "#4285F4" : "#BDC1C6", color: "#fff", border: "none" }}>Send</button>

          {!recording ? (
            <button type="button" onClick={startAudio} style={{ padding: "8px 14px", borderRadius: 20, background: "#34A853", color: "#fff", border: "none" }}>Enable Voice</button>
          ) : (
            <button type="button" onClick={stopAudio} style={{ padding: "8px 14px", borderRadius: 20, background: "#EA4335", color: "#fff", border: "none" }}>Stop Voice</button>
          )}
        </form>
      </section>

      {/* Status & controls */}
      <section style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: connected ? "#34A853" : "#BDC1C6" }} />
          <div>{connected ? "Connected" : "Disconnected"}</div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => connectWebsocket()} disabled={connected} style={{ padding: 8, borderRadius: 8 }}>Start Socket</button>
          <button onClick={() => closeWebsocket()} disabled={!connected} style={{ padding: 8, borderRadius: 8 }}>Stop Socket</button>
          <button onClick={() => startSession()} disabled={!connected} style={{ padding: 8, borderRadius: 8 }}>Start Session</button>
        </div>
      </section>
    </div>
  );
}
