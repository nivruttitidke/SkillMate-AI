import axios from "axios";

export const translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    const prompt = `Translate this text to ${target} only:\n${text}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API}` } }
    );

    const translated = response.data.choices[0].message.content.trim();
    res.json({ translated });
  } catch (err) {
    console.error("Translate Error:", err.response?.data || err);
    res.json({ translated: text }); 
  }
};
