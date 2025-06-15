
import { InferenceClient } from "@huggingface/inference"

const HF_TOKEN = process.env.HF_API_TOKEN;

const client = new InferenceClient(HF_TOKEN);

export const chatCompletion = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    const out = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512
    });


    const message = out.choices?.[0]?.message?.content || "No response.";
    res.status(200).json({ message });

  } catch (error) {
    console.error("Hugging Face error:", error.response?.data || error.message);
    res.status(500).json({ message: "Something went wrong with the AI response." });
  }
}