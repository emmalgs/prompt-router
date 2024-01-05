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

exports.handler = async function (event, context) {
  try {
    const newPrompt = await updatePrompt();
    const apiUrl = process.env.PROMPT_API_URL;

    const formData = new FormData();
    formData.append('promptText', newPrompt);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: formData,
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
