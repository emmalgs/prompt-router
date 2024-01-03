import createPrompt from '../promptGenerator.js';
import express from 'express';
import cron from 'node-cron';
import cors from 'cors';
const app = express();

let prompt = '';

const updatePrompt = async () => {
  try {
    prompt = await createPrompt();
  } catch (err) {
    console.log(err);
  }
};

cron.schedule('0 0 * * *', updatePrompt);

const router = express.Router();

router.get('/', async (req, res) => {
  if (!prompt) {
    return res.status(500).send('Prompt not found');
  }
  res.send(prompt);
});

app.use(cors());
app.use('./netlify/functions/prompt', router);

export const handler = async (event, context) => {
  await updatePrompt();
  return {
    statusCode: 200,
    body: JSON.stringify({ prompt }),
  };
};
