import { GoogleGenAI } from "@google/genai";
import { TestFormValues } from "components/TestDetailsForm";
import { QuestionType } from "common/models/Question";

const genAI = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY || "",
});

export async function getResponseFromPrompt(prompt: string) {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout occurred"));
      }, 10000);
    });

    const responsePromise = genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const response = await Promise.race([responsePromise, timeoutPromise]);

    // Typescript doesn't know that response is not a Promise<void>, so we need to cast it
    const text = (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "";
  } catch (e) {
    console.error(e);
    return "";
  }
}

export const generatePromptForQuestionCreation = (values: TestFormValues) => {
  console.log("Entering generatePromptForQuestionCreation");
  const numQuestions = Number(values.numQuestions) || 5;
  const difficulty = values.difficulty || "medium";
  const candidateLevel = values.candidateLevel || "fresher";
  const topic = values.topic.trim();

  const basePrompt = `Generate exactly ${numQuestions} ${difficulty} difficulty`;
  const candidateTopic = `for ${candidateLevel} candidates on the topic '${topic}'.`;
  const jsonInstruction = `
Please respond only with a valid JSON array of objects where each object has the following structure:
{
  "type": TYPE_PLACEHOLDER,
  "text": string containing the question
}
Do not include any explanation or extra text outside the JSON Array.
  `.trim();

  if (values.questionType === QuestionType.MIXED) {
    const half = Math.floor(numQuestions / 2);
    const remainder = numQuestions - half;
    const questionBody = `
      The questions should be a mix of:
      - ${half} textual questions that test theoretical knowledge.
      - ${remainder} coding problems that require writing a function or algorithm.
          `.trim();

    return `
      ${basePrompt} questions ${candidateTopic}
      ${questionBody}

      ${jsonInstruction.replace("TYPE_PLACEHOLDER", `either ${QuestionType.TEXT} or ${QuestionType.CODE}`)}
          `.trim();
  } else if (values.questionType === QuestionType.CODE) {
    // coding questions
    const questionBody = `coding problems that require writing a function or algorithm.`;

    return `
      ${basePrompt} ${questionBody} ${candidateTopic}

      ${jsonInstruction.replace("TYPE_PLACEHOLDER", `${QuestionType.CODE}`)}
          `.trim();
  } else {
    // text answer questions
    const questionBody = `textual questions that test theoretical knowledge.`;

    return `
      ${basePrompt} ${questionBody} ${candidateTopic}

      ${jsonInstruction.replace("TYPE_PLACEHOLDER", `${QuestionType.TEXT}`)}
    `.trim();
  }
};
