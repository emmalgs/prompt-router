import { createPrompt } from "../promptGenerator.js";

const updatePrompt = async () => {
  let prompt;
  try {
    prompt = await createPrompt();

  } catch (err) {
    prompt = err.message;
  }
  return prompt;
};

export default async (req) => {
  const newPrompt = await updatePrompt();
  const apiUrl = process.env.PROMPT_API_URL;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ promptText: newPrompt }),
  });
  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ promptText: newPrompt }),
    };
  } else {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
