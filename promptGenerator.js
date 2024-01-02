import { assistant, prompt } from "./promptText.js";
import dotenv from 'dotenv';
dotenv.config();

const createPrompt = async () => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: `${assistant}` }, { role: 'user', content: `${prompt}` }],
      }),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return 'Error fetching data';
  }
};

export default createPrompt;
