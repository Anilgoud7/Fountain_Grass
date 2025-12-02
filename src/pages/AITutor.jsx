import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { THEME, Card, Button } from "../components/ui";
import { startAudioPlayerWorklet } from "../utils/audio-player";
import {
  startAudioRecorderWorklet,
  stopMicrophone,
} from "../utils/audio-recorder";

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
      {
        number: 3,
        name: "Chapter 3: COORDINATE GEOMETRY",
        title: "COORDINATE GEOMETRY",
        topics: [
          "1. Introduction to Coordinate Geometry",
          "2. Understanding the Cartesian System",
          "3. Plotting Points in the Cartesian Plane",
        ],
      },
      {
        number: 4,
        name: "Chapter 4: LINEAR EQUATIONS IN TWO VARIABLES",
        title: "LINEAR EQUATIONS IN TWO VARIABLES",
        topics: [
          "1. Introduction to Linear Equations in Two Variables",
          "2. Understanding Linear Equations",
          "3. Solutions of Linear Equations",
          "4. Graphing Linear Equations",
          "5. Lines Parallel to Axes",
        ],
      },
      {
        number: 5,
        name: "Chapter 5: INTRODUCTION TO EUCLID'S GEOMETRY",
        title: "INTRODUCTION TO EUCLID'S GEOMETRY",
        topics: [
          "1. Introduction to Euclid's Geometry",
          "2. Euclid's Definitions",
          "3. Euclid's Axioms",
          "4. Euclid's Postulates",
          "5. Challenges in Definitions",
          "6. Non-Euclidean Geometries",
          "7. Spherical Geometry",
          "8. Equivalent Versions of Euclid's Fifth Postulate",
        ],
      },
      {
        number: 6,
        name: "Chapter 6: LINES AND ANGLES",
        title: "LINES AND ANGLES",
        topics: [
          "Introduction to Lines and Angles",
          "Basic Terms and Definitions of Angles",
          "Intersecting and Non-Intersecting Lines",
          "Pairs of Angles",
          "Parallel Lines and Transversals",
          "Lines Parallel to the Same Line",
          "Angle Sum Property of a Triangle",
        ],
      },
      {
        number: 7,
        name: "Chapter 7: TRIANGLES",
        title: "TRIANGLES",
        topics: [
          "Introduction to Triangles",
          "Congruence of Triangles",
          "Criteria for Congruence of Triangles",
          "Some Properties of Isosceles Triangles",
          "Inequalities in a Triangle",
          "Some More Criteria for Congruence of Triangles",
        ],
      },
      {
        number: 9,
        name: "Chapter 9: AREAS OF PARALLELOGRAMS AND TRIANGLES",
        title: "AREAS OF PARALLELOGRAMS AND TRIANGLES",
        topics: [
          "1.2 Introduction to Areas of Parallelograms and Triangles",
          "2.2 Figures on the Same Base and Between the Same Parallels",
          "3.3 Parallelograms on the Same Base and Between the Same Parallels",
          "4.4 Triangles on the Same Base and Between the Same Parallels",
        ],
      },
      {
        number: 10,
        name: "Chapter 10: CIRCLES",
        title: "CIRCLES",
        topics: [
          "1.2 Introduction to Circles",
          "2.2 Circles and Related Terms",
          "3.3 Angle Subtended by a Chord at a Point",
          "4.4 Perpendicular from the Centre to a Chord",
          "5.5 Circle through Three Points",
          "6.6 Equal Chords and their Distances from the Centre",
          "7.7 Angle Subtended by an Arc of a Circle",
          "8.8 Cyclic Quadrilaterals",
        ],
      },
      {
        number: 11,
        name: "Chapter 11: CONSTRUCTIONS",
        title: "CONSTRUCTIONS",
        topics: [
          "1.2 Introduction to Constructions",
          "2.1 Basic Constructions Overview",
          "3.1 Triangle Constructions Overview",
        ],
      },
      {
        number: 12,
        name: "Chapter 12: HERON'S FORMULA",
        title: "HERON'S FORMULA",
        topics: [
          "1.2 Introduction to Heron's Formula",
          "2.1 Understanding Heron's Formula",
          "3.1 Application of Heron's Formula in Quadrilaterals",
        ],
      },
      {
        number: 13,
        name: "Chapter 13: SURFACE AREAS AND VOLUMES",
        title: "SURFACE AREAS AND VOLUMES",
        topics: [
          "9. Volume of a Sphere",
          "1. Introduction to Surface Areas and Volumes",
          "2. Surface Area of a Cuboid and a Cube",
          "3. Surface Area of a Right Circular Cylinder",
          "4. Surface Area of a Right Circular Cone",
          "5. Surface Area of a Sphere",
          "6. Volume of a Cuboid",
          "7. Volume of a Cylinder",
          "8. Volume of a Right Circular Cone",
        ],
      },
      {
        number: 14,
        name: "Chapter 14: STATISTICS",
        title: "STATISTICS",
        topics: [
          "Introduction",
          "Collection of Data",
          "Presentation of Data",
          "Graphical Representation of Data",
          "Measures of Central Tendency",
        ],
      },
      {
        number: 15,
        name: "Chapter 15: PROBABILITY",
        title: "PROBABILITY",
        topics: [
          "1.2 Introduction to Probability",
          "1.3 Experimental Probability Concepts",
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
          "States of Matter",
          "Effect of Temperature and Pressure on States of Matter",
          "Evaporation and Its Effects",
          "Summary and Exercises",
        ],
      },
      {
        number: 2,
        name: "Chapter 2: What is a Mixture?",
        title: "What is a Mixture?",
        topics: [
          "Introduction to Mixtures",
          "Definition and Types of Mixtures",
          "Activity on Types of Mixtures",
          "Observations on Mixtures",
          "Activity on Solutions, Suspensions, and Colloids",
          "Understanding Solutions",
          "Components and Properties of Solutions",
          "Concentration of Solutions",
          "Methods of Expressing Concentration",
          "Understanding Suspensions",
          "Understanding Colloidal Solutions",
          "Properties of Colloids",
          "Comparison of Mixtures and Compounds",
          "Types of Pure Substances",
          "Properties and Examples of Elements",
          "Understanding Compounds",
          "Summary of Key Concepts",
          "Exercises and Applications",
          "Further Exercises and Group Activity",
        ],
      },
      {
        number: 3,
        name: "Chapter 3: Laws of Chemical Combination",
        title: "Laws of Chemical Combination",
        topics: [
          "Ancient Philosophical Ideas on Matter",
          "Development of Chemical Combination Laws",
          "Laws of Chemical Combination",
          "Law of Conservation of Mass",
          "Law of Constant Proportions",
          "Dalton's Atomic Theory",
          "Understanding Atoms",
          "Modern Day Symbols of Atoms",
          "Naming and Symbols of Elements",
          "Atomic Mass",
          "Existence of Atoms",
          "Molecules",
          "Molecules of Elements",
          "Molecules of Compounds",
          "Ions",
          "Writing Chemical Formulae",
          "Formulas of Simple Compounds",
          "Molecular Mass",
          "Formula Unit Mass",
        ],
      },
      {
        number: 4,
        name: "Chapter 4: Structure of the Atom",
        title: "Structure of the Atom",
        topics: [
          "Introduction to the Structure of the Atom",
          "Charged Particles in Matter",
          "Questions on Charged Particles",
          "The Structure of an Atom",
          "Thomson's Model of an Atom",
          "Rutherford's Model of an Atom",
          "Observations from Rutherford's Experiment",
          "Bohr's Model of Atom",
          "Discovery of Neutrons",
          "Electron Distribution in Different Orbits",
          "Valency",
          "Atomic Number and Mass Number",
          "Isotopes",
          "Isobars",
          "Summary of Atomic Structure",
          "Exercises",
        ],
      },
      {
        number: 5,
        name: "Chapter 5: Cells",
        title: "Cells",
        topics: [
          "Introduction to Cells",
          "What are Living Organisms Made Up of?",
          "Unicellular and Multicellular Organisms",
          "History of Cell Discovery",
          "Cell Structure and Function",
          "Structural Organisation of a Cell",
          "Plasma Membrane or Cell Membrane",
          "Osmosis and Its Effects on Cells",
          "Cell Wall",
          "Nucleus",
          "Cytoplasm",
          "Cell Organelles",
          "Endoplasmic Reticulum (ER)",
          "Golgi Apparatus",
          "Lysosomes",
          "Mitochondria",
          "Plastids",
          "Vacuoles",
          "Cell Division",
          "Summary and Exercises",
        ],
      },
      {
        number: 6,
        name: "Chapter 6: Tissues in Plants and Animals",
        title: "Tissues in Plants and Animals",
        topics: ["Introduction to Tissues"],
      },
      {
        number: 7,
        name: "Chapter 7: Motion in One Dimension",
        title: "Motion in One Dimension",
        topics: [
          "Introduction to Motion",
          "Activities on Motion Perception",
          "Describing Motion",
          "Motion Along a Straight Line",
          "Questions on Motion",
          "Uniform and Non-Uniform Motion",
          "Measuring the Rate of Motion",
          "Speed with Direction",
          "Examples and Questions on Speed and Velocity",
          "Acceleration and Rate of Change of Velocity",
          "Graphical Representation of Motion",
          "Distance-Time and Velocity-Time Graphs",
          "Analyzing Velocity-Time Graphs",
          "Questions on Graphical Representation of Motion",
          "Equations of Motion",
          "Questions on Equations of Motion",
          "Uniform Circular Motion",
          "Exercises on Motion",
          "Additional Exercises on Motion",
        ],
      },
      {
        number: 8,
        name: "Chapter 8: Forces and Motion",
        title: "Forces and Motion",
        topics: [
          "Introduction to Motion and Force",
          "Balanced and Unbalanced Forces",
          "First Law of Motion",
          "Inertia and Mass",
          "Second Law of Motion",
          "Examples and Applications of Second Law of Motion",
          "Third Law of Motion",
          "Applications and Activities Related to Third Law of Motion",
          "Summary of Forces and Motion",
          "Exercises on Forces and Motion",
          "Additional Exercises on Forces and Motion",
        ],
      },
      {
        number: 9,
        name: "Chapter 9: Gravitation and the Universal Law of Gravitation",
        title: "Gravitation and the Universal Law of Gravitation",
        topics: [
          "Introduction to Gravitation",
          "Gravitation",
          "Universal Law of Gravitation",
          "Calculating Gravitational Force",
          "Importance of the Universal Law of Gravitation",
          "Free Fall",
          "Calculating the Value of g",
          "Motion of Objects Under Gravitational Force",
          "Examples of Motion Under Gravity",
          "Mass and Weight",
          "Weight on the Moon",
          "Thrust and Pressure",
          "Pressure in Fluids",
          "Buoyancy",
          "Why Objects Float or Sink",
          "Archimedes' Principle",
          "Summary of Gravitation",
          "Exercises",
        ],
      },
      {
        number: 10,
        name: "Chapter 10: Work, Energy, and Power",
        title: "Work, Energy, and Power",
        topics: [
          "Introduction to Work, Energy, and Power",
          "Concept of Work",
          "Scientific Conception of Work",
          "Work Done by a Constant Force",
          "Introduction to Energy",
          "Forms of Energy",
          "Kinetic Energy",
          "Potential Energy",
          "Potential Energy of an Object at a Height",
          "Interconvertibility of Various Energy Forms",
          "Law of Conservation of Energy",
          "Rate of Doing Work",
          "Summary and Exercises",
        ],
      },
      {
        number: 11,
        name: "Chapter 11: Production of Sound",
        title: "Production of Sound",
        topics: [
          "Introduction to Sound",
          "Production of Sound",
          "Propagation of Sound",
          "Sound Waves as Mechanical Waves",
          "Sound Waves and Mediums",
          "Characteristics of Sound Waves",
          "Longitudinal and Transverse Waves",
          "Speed of Sound in Different Media",
          "Reflection of Sound",
          "Echo and Reverberation",
          "Range of Hearing",
          "Applications of Ultrasound",
        ],
      },
      {
        number: 12,
        name: "Chapter 12: Sustainable Practices in Agriculture and Animal Husbandry",
        title: "Sustainable Practices in Agriculture and Animal Husbandry",
        topics: [
          "Introduction to Sustainable Practices in Agriculture and Animal Husbandry",
          "Improvement in Crop Yields",
          "Crop Variety Improvement",
          "Crop Production Management",
          "Nutrient Management",
          "Manure and Fertilizers",
          "Irrigation",
          "Cropping Patterns",
          "Crop Protection Management",
          "Storage of Grains",
          "Animal Husbandry",
          "Cattle Farming",
          "Poultry Farming",
          "Fish Production",
          "Marine Fisheries",
          "Inland Fisheries",
          "Bee-Keeping",
        ],
      },
    ],
  },
};
const modes = ["quiz", "interview", "flashcard"];

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

  // Hardcoded users
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

  // Toggle audio mode - improved sequence
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
      connectWebSocket();
    } else {
      console.log("=== Enabling Audio Mode ===");

      // Close existing connection
      disconnectWebSocket();

      // Set audio enabled
      setIsAudioEnabled(true);

      // Start audio system
      const audioStarted = await startAudio();

      if (audioStarted) {
        // Wait a bit for audio to fully initialize
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Connect with audio enabled
        connectWebSocket();
      } else {
        setIsAudioEnabled(false);
      }
    }
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
    setIsSessionReady(false);
  };

  // Chapter selection
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter.name.replace(/^Chapter \d+:\s*/, ""));
    setSelectedTopic(null);
    setSelectedMode(null);
    setIsSessionReady(false);
  };

  // Topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedMode(null);
    setIsSessionReady(false);
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

    // Show result analysis for interview mode
    setShowResultAnalysis(mode === "interview");

    setTimeout(() => {
      connectWebSocket();
    }, 300);
  };

  // WebSocket connection - improved
  const connectWebSocket = () => {
    if (!isSessionReady) {
      console.warn("Session not ready");
      return;
    }

    const newSessionId = sessionId || Math.random().toString().substring(10);
    setSessionId(newSessionId);
    localStorage.setItem("currentSessionId", newSessionId);

    const wsUrl = `ws://localhost:8000/ws/${newSessionId}?agent_type=${selectedSubject?.toLowerCase()}&is_audio=${isAudioEnabled}&user_id=${selectedUserId}&subject=${selectedSubject}&chapter=${selectedChapter}&topic=${selectedTopic}&mode=${selectedMode}`;

    console.log("=== Connecting WebSocket ===");
    console.log("URL:", wsUrl);
    console.log("Audio enabled:", isAudioEnabled);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✓ WebSocket connected");
      console.log("WebSocket state:", ws.readyState);
      setIsConnected(true);
      setMessages([
        {
          role: "assistant",
          text: `Hello! I'm your AI Tutor for ${selectedSubject} - ${selectedTopic}. ${
            isAudioEnabled
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
      } else {
        console.log("[AGENT TO CLIENT] Received message:", message);
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
              hasAudio: isAudioEnabled,
            },
          ];
        });
      }

      // Handle audio messages - IMPROVED
      if (message.mime_type === "audio/pcm" && message.data) {
        console.log("[AUDIO PLAYBACK] Attempting to play audio...");

        if (!audioPlayerNodeRef.current) {
          console.error("[AUDIO PLAYBACK] Audio player not initialized!");
          return;
        }

        if (!audioPlayerContextRef.current) {
          console.error("[AUDIO PLAYBACK] Audio context not available!");
          return;
        }

        // Resume audio context if suspended
        if (audioPlayerContextRef.current.state === "suspended") {
          console.log("[AUDIO PLAYBACK] Resuming audio context...");
          audioPlayerContextRef.current.resume().then(() => {
            console.log("[AUDIO PLAYBACK] Audio context resumed");
          });
        }

        try {
          const audioData = base64ToArray(message.data);
          console.log(
            "[AUDIO PLAYBACK] Decoded audio size:",
            audioData.byteLength,
            "bytes"
          );

          // Send audio data to the worklet
          audioPlayerNodeRef.current.port.postMessage(audioData);
          console.log("[AUDIO PLAYBACK] Audio data sent to worklet");
        } catch (error) {
          console.error("[AUDIO PLAYBACK] Error playing audio:", error);
        }
      }
    };

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
                  color: selectedMode === mode ? "#fff" : undefined,
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Connection Status & Audio Controls */}
      {isSessionReady && (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isConnected ? "#4caf50" : "#f44336",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  color: isConnected ? "#4caf50" : "#f44336",
                }}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
              {isRecording && (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#ea4335",
                      marginLeft: 16,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  <span style={{ fontSize: 14, color: "#ea4335" }}>
                    Recording...
                  </span>
                </>
              )}
            </div>
            <Button
              onClick={handleToggleAudio}
              variant={isAudioEnabled ? "solid" : "soft"}
              style={{
                backgroundColor: isAudioEnabled ? "#ea4335" : "#34a853",
                color: "#fff",
              }}
            >
              {isAudioEnabled ? "🔴 Stop Voice" : "🎤 Enable Voice"}
            </Button>
          </div>
        </Card>
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
                  borderLeft:
                    msg.hasAudio && msg.role !== "user"
                      ? "3px solid #34a853"
                      : "none",
                }}
              >
                <strong>{msg.role === "user" ? "You" : "AI Tutor"}:</strong>
                {msg.hasAudio && msg.role !== "user" && (
                  <span style={{ marginLeft: 8 }}>🔊</span>
                )}
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

      {/* Result Analysis Section - Only for Interview Mode */}
      {showResultAnalysis && (
        <Card title="📊 Result Analysis">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button
                onClick={startResultAnalysis}
                disabled={analysisStatus === "loading"}
                style={{ backgroundColor: "#667eea", color: "#fff" }}
              >
                🔍 Start Result Analysis
              </Button>
              {analysisStatus === "success" && (
                <Button
                  onClick={viewResult}
                  style={{ backgroundColor: "#34a853", color: "#fff" }}
                >
                  📈 View Result
                </Button>
              )}
            </div>
            {analysisStatus && (
              <div
                style={{
                  padding: 10,
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor:
                    analysisStatus === "loading"
                      ? "#fff3e0"
                      : analysisStatus === "success"
                      ? "#e8f5e9"
                      : "#ffebee",
                  color:
                    analysisStatus === "loading"
                      ? "#e65100"
                      : analysisStatus === "success"
                      ? "#2e7d32"
                      : "#c62828",
                }}
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

      {/* Result Modal */}
      {showResultModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowResultModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              maxWidth: 700,
              maxHeight: "90vh",
              overflow: "auto",
              padding: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ color: THEME.primary }}>📊 Analysis Results</h2>
              <button
                onClick={() => setShowResultModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 28,
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            {resultData.map((result, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 10,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <h3>Result {index + 1}</h3>
                <p>
                  <strong>User ID:</strong> {result.user_id}
                </p>
                <p>
                  <strong>Subject:</strong> {result.subject}
                </p>
                <p>
                  <strong>Topic:</strong> {result.topic}
                </p>
                {result.interview && (
                  <>
                    <p>
                      <strong>Score:</strong> {result.interview.score}
                    </p>
                    <p>
                      <strong>Weak Areas:</strong>{" "}
                      {result.interview.concepts_weak_in}
                    </p>
                  </>
                )}
              </div>
            ))}
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
