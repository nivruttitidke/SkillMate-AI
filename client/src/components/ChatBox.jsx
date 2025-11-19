import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChatBox() {
  const navigate = useNavigate();
  const practice = JSON.parse(localStorage.getItem("practice"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [summaryMode, setSummaryMode] = useState(false);
  const [summary, setSummary] = useState([]);

  const language = practice?.language || "English";
   
  // LANGUAGE MAP
  
  const langMap = {
    English: "en-US",
    Hindi: "hi-IN",
    Marathi: "mr-IN",
  };

  const selectedLang = langMap[language] || "en-US";

     //REFS

  const answersRef = useRef([]);
  const chatEndRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false); // NEW — for STOP SPEAK
  const voicesLoadedRef = useRef(false);

  // LOAD VOICES (Important for Marathi)
  
  const loadVoices = () => {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();

      if (voices.length !== 0) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  };
 
      //SPEAK FUNCTION (MARATHI SUPPORT)

 const speak = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = selectedLang;

  const voices = speechSynthesis.getVoices();

  let voice = null;

  //  Marathi voices 
  if (selectedLang === "mr-IN") {
    voice =
      voices.find(v => v.name.toLowerCase().includes("marathi")) ||
      voices.find(v => v.lang === "mr-IN") ||
      voices.find(v => v.name.includes("Google हिन्दी")); 
  }

  //  Hindi voices
  if (selectedLang === "hi-IN") {
    voice =
      voices.find(v => v.name.includes("Google हिन्दी")) ||
      voices.find(v => v.lang === "hi-IN");
  }

  //  English voices
  if (selectedLang === "en-US") {
    voice =
      voices.find(v => v.name.includes("Google US English")) ||
      voices.find(v => v.lang === "en-US");
  }

  if (voice) utter.voice = voice;

  utter.rate = 1;
  utter.pitch = 1;

  window.speechSynthesis.speak(utter);
 };


  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

        //SPEECH RECOGNITION

  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLang;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };

    recognition.onend = () => setListening(false);
  }

  const startListening = () => {
    if (!recognition) return alert("Speech Recognition Not Supported");
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

   //SCROLL BOTTOM

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

       // LOAD FIRST QUESTION
 
  useEffect(() => {
    if (!practice?.questions) return navigate("/dashboard");

    answersRef.current = Array(practice.questions.length).fill("");

    setMessages([
      { role: "bot", text: `Starting your interview (${language})...` },
      { role: "bot", text: practice.questions[0] },
    ]);
    loadVoices();
  }, []);

        //PUSH MESSAGE
 
  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // SEND ANSWER
  
  const sendAnswer = () => {
    if (!input.trim()) return;

    answersRef.current[currentQ] = input.trim();

    pushMessage({ role: "user", text: input.trim() });
    setInput("");

    if (currentQ + 1 < practice.questions.length) {
      const nextIndex = currentQ + 1;
      setCurrentQ(nextIndex);

      setTimeout(() => {
        pushMessage({
          role: "bot",
          text: practice.questions[nextIndex],
        });
      }, 300);
    } else {
      finishInterview();
    }
  };

   //FINISH INTERVIEW
  
  const finishInterview = async () => {
    pushMessage({ role: "bot", text: "Interview complete! " });

    const score = Math.min(
      100,
      Math.round(
        answersRef.current.reduce((sum, a) => sum + (a.length || 0), 0) / 5
      )
    );

    try {
      await axios.post(
        "/api/user/history",
        { category: practice.category, score },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch {}

    try {
      const res = await axios.post("/api/chat/upgrade-answers", {
        questions: practice.questions,
        answers: answersRef.current,
        language,
      });

      setSummary(
        practice.questions.map((q, i) => ({
          question: q,
          userAnswer: answersRef.current[i],
          improved: res.data.upgradedAnswers[i].bestAnswer,
        }))
      );
    } catch {
      setSummary(
        practice.questions.map((q, i) => ({
          question: q,
          userAnswer: answersRef.current[i],
          improved: "Improved answer unavailable.",
        }))
      );
    }

    setSummaryMode(true);
  };

      // SUMMARY MODE
  
  if (summaryMode) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">
          Interview Summary ({language})
        </h2>

        {summary.map((item, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg mb-4 shadow">
            <p className="font-semibold">
              Q{i + 1}: {item.question}
            </p>

            <p className="mt-3 font-bold">Your Answer:</p>
            <p>{item.userAnswer}</p>

            <p className="mt-3 font-bold text-blue-700">Improved Answer:</p>
            <p className="text-blue-700">{item.improved}</p>

            {/* LISTEN improved answer */}
            <button
              onClick={() => speak(item.improved)}
              className="mt-3 px-3 py-1 bg-purple-600 text-white rounded"
            >
               Listen
            </button>

            {/* STOP speaking */}
            <button
              onClick={stopSpeaking}
              className="mt-3 ml-2 px-3 py-1 bg-red-600 text-white rounded"
            >
               Stop
            </button>
          </div>
        ))}

        {/* STOP MIC IF ANY */}
        {listening && (
          <button
            onClick={stopListening}
            className="px-4 py-2 mt-4 bg-red-600 text-white rounded"
          >
            Stop Mic
          </button>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

       // MAIN INTERVIEW UI
  
  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-bold">
          Interview Practice ({language})
        </h2>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Stop Interview
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-gray-100 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[75%] text-sm ${
              m.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap mt-4 gap-2">
        {/* LISTEN QUESTION */}
        {!speaking ? (
          <button
            onClick={() => speak(practice.questions[currentQ])}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
             Listen
          </button>
        ) : (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
             Stop
          </button>
        )}

        {/* MIC */}
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded-full text-white transition-all ${
            listening
              ? "bg-red-600 animate-pulse scale-110"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {listening ? "Listening..." : "Speak"}
        </button>

        {/* INPUT */}
        <input
          className="flex-1 px-4 py-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
          placeholder="Type your answer..."
        />

        {/* NEXT */}
        <button
          onClick={sendAnswer}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg w-full sm:w-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
}
