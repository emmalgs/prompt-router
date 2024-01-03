import { createPrompt } from "../promptGenerator.js";
import express from "express";
import cron from "node-cron";
import cors from "cors";

const app = express();

app.use(cors());

let prompt = "";

const updatePrompt = async () => {
  try {
    prompt = await createPrompt();
  } catch (err) {
    prompt = err.message;
  }
};

cron.schedule("0 0 * * *", updatePrompt);

const router = express.Router();

router.get("/", async (req, res) => {
  if (!prompt) {
    return res.status(500).send("Prompt not found");
  }
  res.send(prompt);
});

router.get("/update", async (req, res) => {
  await updatePrompt();
  res.send(prompt);
});

app.use("./netlify/functions/prompt", router);

export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ prompt }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Content-Type": "application/json"
    },
  };
};
