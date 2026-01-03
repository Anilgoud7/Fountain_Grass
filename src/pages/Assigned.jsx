// src/pages/Assigned.jsx
import React from "react";
import { treeData, users } from "../data/treeData";
import {
  FaClipboardList,
  FaBook,
  FaBullseye,
  FaTimes,
  FaCheck,
  FaInfoCircle,
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MODES = ["quiz", "flashcard"];
const CLASSES = ["8", "9", "10"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const DIFFICULTIES_DISPLAY = { easy: "Easy", medium: "Medium", hard: "Hard" };
const QUESTION_COUNTS = ["5", "10", "15", "20"];
// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "http://13.235.33.59:8000";

// Generate random session ID (8 digits)
const generateSessionId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Quiz display component
function QuizDisplay({
  data,
  mode,
  onClose,
  sessionId,
  selectedClass,
  selectedSubject,
  selectedChapter,
  selectedTopic,
  selectedDifficulty,
  selectedQuestionCount,
}) {
  const [userAnswers, setUserAnswers] = React.useState({});
  const [showResults, setShowResults] = React.useState(false);
  const [resultData, setResultData] = React.useState(null);
  const [flippedCards, setFlippedCards] = React.useState({});
  const [analysisLoading, setAnalysisLoading] = React.useState(false);

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async () => {
    setAnalysisLoading(true);

    try {
      // Step 1: Prepare user response data
      const userResponse = data.map((question, index) => ({
        question: question.question || question.front,
        user_answer: userAnswers[index] || "",
        options: question.options || null,
        topic: question.topic,
        concept: question.concept,
        difficulty: question.difficulty,
      }));

      // Step 2: Call analysis API
      const analysisParams = new URLSearchParams({
        session_type: mode,
        user_response: JSON.stringify(userResponse),
      });

      const analysisUrl = `${API_BASE_URL}/api/analyse_text/${sessionId}?${analysisParams.toString()}`;
      console.log("Calling analysis API:", analysisUrl);

      const analysisResponse = await fetch(analysisUrl, {
        method: "GET",
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis API Error: ${analysisResponse.status}`);
      }

      const analysisResult = await analysisResponse.json();
      console.log("Analysis result:", analysisResult);

      // Step 3: Fetch results from get result API
      const resultUrl = `${API_BASE_URL}/result/${sessionId}`;
      console.log("Fetching results:", resultUrl);

      const resultResponse = await fetch(resultUrl);

      if (!resultResponse.ok) {
        throw new Error(`Result API Error: ${resultResponse.status}`);
      }

      const resultJson = await resultResponse.json();
      console.log("Result data:", resultJson);

      // Handle result data - could be array or single object
      const results = Array.isArray(resultJson) ? resultJson : [resultJson];
      setResultData(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error in analysis/result:", error);
      alert(
        `Error: ${error.message}\n\nPlease check if backend API is running.`
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Check if this is flashcard or quiz format
  const isFlashcard = data[0]?.front !== undefined;

  const isAnswered = (index) => userAnswers[index] !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 pt-8">
        <div className="bg-white rounded-lg w-full max-w-4xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "quiz" ? "Quiz" : "Flashcard"} Review
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Show Results */}
          {showResults && resultData ? (
            <div className="space-y-6">
              {resultData.map((result, index) => {
                const isQuiz = result.quiz !== undefined;
                const isFlashcard = result.flashcard !== undefined;

                return (
                  <div key={index} className="space-y-6">
                    {/* Session Info */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200">
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
                    {isQuiz && result.quiz && (
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

                        {/* Correct/Wrong Stats */}
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

                        {/* Weak Concepts */}
                        {result.quiz.concepts_weak_in &&
                          result.quiz.concepts_weak_in.length > 0 && (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div className="w-full">
                                  <h4 className="font-semibold text-yellow-800 mb-2">
                                    Areas to Improve
                                  </h4>
                                  <ul className="space-y-2">
                                    {Array.isArray(
                                      result.quiz.concepts_weak_in
                                    ) ? (
                                      result.quiz.concepts_weak_in.map(
                                        (concept, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm text-yellow-700 flex items-start gap-2"
                                          >
                                            <span className="text-yellow-500 mt-1">
                                              •
                                            </span>
                                            <span>{concept}</span>
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="text-sm text-yellow-700">
                                        {result.quiz.concepts_weak_in}
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Flashcard Results */}
                    {isFlashcard && result.flashcard && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                          📚 Flashcard Review
                        </h3>

                        {/* Score Display */}
                        {result.flashcard.score && (
                          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-indigo-200">
                            <div className="text-center">
                              <span className="text-sm font-semibold text-gray-600 mb-2 block">
                                Your Score
                              </span>
                              <div className="text-5xl font-bold text-indigo-600 mb-2">
                                {result.flashcard.score}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {(() => {
                                  const [correct, total] =
                                    result.flashcard.score
                                      .split("/")
                                      .map(Number);
                                  return `${Math.round(
                                    (correct / total) * 100
                                  )}% Correct`;
                                })()}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Focus Areas */}
                        {result.flashcard.concepts_weak_in &&
                          result.flashcard.concepts_weak_in.length > 0 && (
                            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">🎯</span>
                                <div className="w-full">
                                  <h4 className="font-semibold text-purple-800 mb-2">
                                    Focus Areas
                                  </h4>
                                  <ul className="space-y-2 mb-4">
                                    {Array.isArray(
                                      result.flashcard.concepts_weak_in
                                    ) ? (
                                      result.flashcard.concepts_weak_in.map(
                                        (concept, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm text-purple-700 flex items-start gap-2"
                                          >
                                            <span className="text-purple-500 mt-1">
                                              •
                                            </span>
                                            <span>{concept}</span>
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="text-sm text-purple-700">
                                        {result.flashcard.concepts_weak_in}
                                      </li>
                                    )}
                                  </ul>
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

              {/* Action Button */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={onClose}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : isFlashcard ? (
            // FLASHCARD MODE
            <>
              <div className="space-y-6 mb-8">
                {data.map((card, index) => (
                  <div key={index}>
                    {/* Flashcard - Show Question Only */}
                    <div className="relative h-48 mb-4 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-sm font-semibold mb-2 opacity-75">
                          Question {index + 1}
                        </p>
                        <p className="text-xl font-bold">{card.front}</p>
                        <p className="text-sm mt-4 opacity-75 flex items-center justify-center gap-1">
                          <FaInfoCircle /> Answer will be revealed after
                          submission
                        </p>
                      </div>
                    </div>

                    {/* Input for answer verification */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Answer:
                      </label>
                      <input
                        type="text"
                        value={userAnswers[index] || ""}
                        onChange={(e) =>
                          handleAnswerSelect(index, e.target.value)
                        }
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Info */}
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-xs text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaBook className="text-blue-600" />{" "}
                          <strong>{card.topic}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBullseye className="text-indigo-600" />{" "}
                          <strong>{card.concept}</strong>
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            card.difficulty === "easy"
                              ? "bg-green-200 text-green-800"
                              : card.difficulty === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {card.difficulty}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(userAnswers).length !== data.length ||
                    analysisLoading
                  }
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {analysisLoading
                    ? "Analyzing..."
                    : `Submit Flashcards (${Object.keys(userAnswers).length}/${
                        data.length
                      } answered)`}
                </button>
              </div>
            </>
          ) : (
            // QUIZ MODE
            <>
              {/* Questions Display */}
              <div className="space-y-6 mb-8">
                {data.map((question, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gray-50">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Q{index + 1}. {question.question}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            question.difficulty === "easy"
                              ? "bg-green-200 text-green-800"
                              : question.difficulty === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FaBook className="text-blue-600" /> {question.topic}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBullseye className="text-indigo-600" />{" "}
                          {question.concept}
                        </span>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {Object.entries(question.options).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition hover:bg-white"
                          style={{
                            borderColor:
                              userAnswers[index] === key
                                ? "#4f46e5"
                                : "#e5e7eb",
                            backgroundColor:
                              userAnswers[index] === key
                                ? "#eef2ff"
                                : "#f9fafb",
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={key}
                            checked={userAnswers[index] === key}
                            onChange={(e) =>
                              handleAnswerSelect(index, e.target.value)
                            }
                            className="w-4 h-4 accent-indigo-600"
                          />
                          <span className="ml-3 font-medium text-gray-900">
                            <span className="font-bold">
                              {key.toUpperCase()}.
                            </span>{" "}
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(userAnswers).length !== data.length ||
                    analysisLoading
                  }
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {analysisLoading
                    ? "Analyzing..."
                    : `Submit Quiz (${Object.keys(userAnswers).length}/${
                        data.length
                      } answered)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Assigned({ activeSubject }) {
  const [selectedClass, setSelectedClass] = React.useState("9");
  const [selectedSubject, setSelectedSubject] = React.useState("maths");
  const [selectedChapter, setSelectedChapter] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("easy");
  const [selectedMode, setSelectedMode] = React.useState("quiz");
  const [selectedQuestionCount, setSelectedQuestionCount] =
    React.useState("10");
  const [loading, setLoading] = React.useState(false);
  const [quizData, setQuizData] = React.useState(null);
  const [sessionId, setSessionId] = React.useState("");

  // Get chapters for selected subject
  const chapters = React.useMemo(() => {
    const subjectData = treeData[selectedSubject];
    return subjectData ? subjectData.chapters : [];
  }, [selectedSubject]);

  // Get topics for selected chapter
  const topics = React.useMemo(() => {
    const chapter = chapters.find(
      (ch) => ch.number === parseInt(selectedChapter)
    );
    return chapter ? chapter.topics : [];
  }, [chapters, selectedChapter]);

  // Reset chapter and topic when subject changes
  React.useEffect(() => {
    if (chapters.length > 0) {
      setSelectedChapter(chapters[0].number.toString());
      setSelectedTopic("");
    }
  }, [chapters]);

  // Reset topic when chapter changes
  React.useEffect(() => {
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
    }
  }, [topics]);

  const handleStartQuiz = async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedChapter ||
      !selectedTopic ||
      !selectedMode ||
      !selectedQuestionCount
    ) {
      alert("Please select all options");
      return;
    }

    setLoading(true);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    try {
      // Get chapter name
      const chapter = chapters.find(
        (ch) => ch.number === parseInt(selectedChapter)
      );
      const chapterName = chapter?.title || "";

      // Build query parameters
      const params = new URLSearchParams({
        mode: selectedMode,
        user_id: "user005",
        subject: selectedSubject,
        chapter: chapterName,
        topic: selectedTopic,
        class_no: selectedClass,
        number: selectedQuestionCount,
        difficulty: selectedDifficulty,
      });

      // Build complete API URL with session_id in path
      const apiUrl = `${API_BASE_URL}/api/text/${newSessionId}?${params.toString()}`;

      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `API response is not valid JSON. Expected JSON but received: ${contentType}`
        );
      }

      const result = await response.json();

      if (result.status === "success" && result.response) {
        // Handle both cases: response can be a string (flashcards) or object (quiz)
        let responseData = result.response;

        // If response is a string (stringified JSON), parse it
        if (typeof responseData === "string") {
          responseData = JSON.parse(responseData);
        }

        // Check if responseData is already an array (direct quiz data)
        if (Array.isArray(responseData)) {
          setQuizData(responseData);
        }
        // Or if it's an object with "quiz" or "flashcard" key
        else if (typeof responseData === "object") {
          const quizContent =
            responseData["quiz"] ||
            responseData["flashcard"] ||
            responseData[selectedMode];

          if (quizContent) {
            setQuizData(quizContent);
          } else {
            throw new Error(
              `No data found in response. Available keys: ${Object.keys(
                responseData
              ).join(", ")}`
            );
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Invalid response structure from API");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert(
        `⚠️ Error: ${error.message}\n\nPlease check:\n1. Backend API is running at http://localhost:8000\n2. API endpoint exists: /api/text/{session_id}\n3. Check browser console for full error details`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Quiz Modal */}
      {quizData && (
        <QuizDisplay
          data={quizData}
          mode={selectedMode}
          onClose={() => setQuizData(null)}
          sessionId={sessionId}
          selectedClass={selectedClass}
          selectedSubject={selectedSubject}
          selectedChapter={
            chapters.find((ch) => ch.number === parseInt(selectedChapter))
              ?.title || ""
          }
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          selectedQuestionCount={selectedQuestionCount}
        />
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FaClipboardList /> Quiz & Flashcards
          </h2>
          <p className="text-blue-100">
            Select a topic and test your knowledge
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Class Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {Object.entries(treeData).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {chapters.map((ch) => (
                  <option key={ch.number} value={ch.number}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {DIFFICULTIES_DISPLAY[diff]}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Questions Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={selectedQuestionCount}
                onChange={(e) => setSelectedQuestionCount(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-medium"
              >
                {QUESTION_COUNTS.map((count) => (
                  <option key={count} value={count}>
                    {count} Questions
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selector */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mode
              </label>
              <div className="flex gap-3">
                {MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition capitalize border-2 ${
                      selectedMode === mode
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {selectedTopic && (
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Ready to start?
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>{treeData[selectedSubject]?.name}</strong> •{" "}
                {
                  chapters.find((ch) => ch.number === parseInt(selectedChapter))
                    ?.name
                }{" "}
                • <strong>{selectedTopic}</strong>
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Questions: <strong>{selectedQuestionCount}</strong> •
                Difficulty:{" "}
                <strong className="capitalize">{selectedDifficulty}</strong> •
                Mode: <strong className="capitalize">{selectedMode}</strong>
              </p>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={loading || !selectedTopic}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <FaPlay />
                Start{" "}
                {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
