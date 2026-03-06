import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

// Place your Gemini API Key in quotes in brackets
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getRecipeFromGemini(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  const userMessage = [
    {
      role: "user",
      parts: [
        {
          text: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    },
  ];

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  });

  const chat = model.startChat({ history: userMessage });

  try {
    const result = await chat.sendMessage(
      "Please give me a recipe you'd recommend I make!",
    );
    const response = await result.response;
    const finalAnswer = response.text();

    return finalAnswer;
  } catch (err) {
    console.error(err);
  }
}
