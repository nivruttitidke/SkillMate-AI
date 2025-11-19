import axios from "axios";

export const startInterview = async (req, res) => {
  try {
    const { category, level, count, language } = req.body;  
    console.log("START INTERVIEW INPUT:", { category, level, count, language });
      const prompt = `
         Generate ${count} interview questions in ${language}.
         Category: ${category}
         Difficulty: ${level}

          Return:
          - ONLY a valid JSON array of ${count} strings
         - ONLY in ${language}
         - NO numbering
         - NO explanations
         - NO translations
         - NO markdown/backticks
    `;
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API}` } }
    );

    let output = response.data.choices[0].message.content.trim();

    output = output.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(output);
    res.json({ questions });

  } catch (error) {
    console.error("GROQ QUESTION ERROR:", error.response?.data || error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

   //CHAT AI 
   
export const chatAI = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }],
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API}` } }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("GROQ ERROR:", error.response?.data || error);
    res.status(500).json({ message: "Chat error" });
  }
};

   //UPGRADE ANSWERS 
   
export const upgradeAnswers = async (req, res) => {
  try {
    const { questions, answers, language } = req.body;

    // NEW → Default language = English
    const lang = language || "English";

    // NEW → Language instructions
    const langMap = {
      English: "Write the improved answer in professional English.",
      Hindi: "उन्नत उत्तर हिन्दी में पेशेवर तरीके से लिखें।",
      Marathi: "सुधारित उत्तर व्यावसायिक मराठीत लिहा.",
    };

    const langInstruction = langMap[lang] || langMap["English"];

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid questions or answers" });
    }

    const upgraded = [];

    // Loop per question
    for (let i = 0; i < questions.length; i++) {
      const prompt = `
Improve this interview answer.  
${langInstruction}

Return ONLY in this format (NO JSON):

Best Answer: <text>

Question: ${questions[i]}
User Answer: ${answers[i] || "No answer provided"}
      `;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        },
        { headers: { Authorization: `Bearer ${process.env.GROQ_API}` } }
      );

      let aiText = response.data.choices[0].message.content.trim();

      aiText = aiText.replace(/```/g, "").trim();
      aiText = aiText.replace(/^Best Answer:/i, "").trim();

      upgraded.push({
        question: questions[i],
        bestAnswer: aiText,
        language: lang,   // NEW
      });
    }

    return res.json({ upgradedAnswers: upgraded });

  } catch (error) {
    console.error("UPGRADE ANSWER ERROR:", error.response?.data || error);
    return res.status(500).json({ message: "Failed to upgrade answers" });
  }
};
