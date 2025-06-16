import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_API_TOKEN;

const client = new InferenceClient(HF_TOKEN);

export const chatCompletion = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    // Step 1: Generate chatbot reply
    const out = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });

    const message = out.choices?.[0]?.message?.content || "No response.";

    // Step 2: Create evaluation prompt
    const evalPrompt = `
Evaluate this chatbot response.

User: "${prompt}"
Chatbot: "${message}"

Give a score out of 10 and explain your reasoning briefly.
Format the response like this:
{
  "score": number,
  "feedback": "string"
}
`;

    // Step 3: Generate evaluation using same model
   const evalOut = await client.chatCompletion({
  model: "meta-llama/Llama-3.1-8B-Instruct",
  messages: [
    {
      role: "user",
      content: `
Evaluate this chatbot response.

User: "${prompt}"
Chatbot: "${message}"

Give a score out of 10 and explain your reasoning briefly.
Format the response like this:
{
  "score": number,
  "feedback": "string"
}
`,
    },
  ],
  max_tokens: 200,
});
const evalText = evalOut.choices?.[0]?.message?.content || '';


    // Parse JSON from model output
    let evaluation = { score: null, feedback: "Evaluation not parsed." };
try {
  const match = evalText.match(/\{[\s\S]*\}/);
  if (match) {
    evaluation = JSON.parse(match[0]);
  }
} catch (e) {
  console.error("Eval parse error:", e);
}


    res.status(200).json({ message, evaluation });

  } catch (error) {
    console.error("Hugging Face error:", error.response?.data || error.message);
    res.status(500).json({ message: "Something went wrong with the AI response." });
  }
};
