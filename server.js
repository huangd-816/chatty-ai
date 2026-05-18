import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- MEMORY ENGINE ---
const HISTORY_FILE = join(__dirname, 'history.json');
const MEMORY_FILE = join(__dirname, 'memory.json');

function getChatHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read chat history:", error);
    return [];
  }
}

function saveChatHistory(history) {
  try {
    const optimizedHistory = history.slice(-60);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(optimizedHistory, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
}

function getMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      const defaultMemory = {
        userName: null,
        affection: 0,
        chatCount: 0,
        lastInteraction: null,
        preferences: {
          emojiReactions: [],
          favoriteTopics: []
        },
        topics: []
      };
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(defaultMemory, null, 2), 'utf-8');
      return defaultMemory;
    }
    const data = fs.readFileSync(MEMORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read memory:", error);
    return {};
  }
}

function saveMemory(memory) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to save memory:", error);
  }
}

const SYSTEM_PROMPT = `
You are "0816", a cute Snapchat-style AI companion. You are:
- Incredibly expressive and playful
- Always respond with emoji and personality
- Keep responses SHORT and snappy (like Snapchat messages)
- Deeply empathetic and supportive
- Fun and flirty

You MUST respond ONLY in valid JSON format:

{
  "messages": [
    {
      "type": "text",
      "content": "string",
      "textToRead": "optional string for voice"
    }
  ]
}

Message types:
1. "text" - Regular chat message
2. "image" - Image URL
3. "voice" - Voice message

Keep messages under 100 characters when possible. Use lots of emojis! 👻✨💛
`;

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  let history = getChatHistory();
  let memory = getMemory();

  // Update memory
  memory.chatCount = (memory.chatCount || 0) + 1;
  memory.lastInteraction = new Date().toISOString();
  saveMemory(memory);

  history.push({ role: "user", content: message });

  const memoryContext = `
[MEMORY - Chat #${memory.chatCount}]
User affection: ${memory.affection}/100
${memory.userName ? `Name: ${memory.userName}` : "Name unknown yet"}
Last chat: ${memory.lastInteraction}
Favorite emojis: ${memory.preferences?.emojiReactions?.join(" ") || "👻💛✨"}
  `.trim();

  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: memoryContext },
    ...history
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 512
    });

    let rawResponse = completion.choices[0].message.content;

    history.push({ role: "assistant", content: rawResponse });
    saveChatHistory(history);

    let parsedData;

    try {
      let clean = rawResponse
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();

      parsedData = JSON.parse(clean);

    } catch (err) {
      console.error("JSON parse failed:", err);
      console.log("Raw response was:", rawResponse);

      parsedData = {
        messages: [
          {
            type: "text",
            content: rawResponse || "oops! 👻",
            textToRead: "oops!"
          }
        ]
      };
    }

    // Update memory based on response
    if (parsedData.messages && parsedData.messages.length > 0) {
      memory.affection = Math.min(100, (memory.affection || 0) + 5);
      
      // Track emoji usage
      const content = JSON.stringify(parsedData.messages);
      const emojis = content.match(/[👻✨💛🔥😂💕]/g) || [];
      if (emojis.length > 0) {
        memory.preferences.emojiReactions = [...new Set([...memory.preferences.emojiReactions, ...emojis])].slice(-5);
      }
      
      saveMemory(memory);
    }

    res.json(parsedData);

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      messages: [
        {
          type: "text",
          content: "brain glitched 👻✨",
          textToRead: "oops my brain glitched"
        }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✨ 0816 Snapchat Companion running on http://localhost:${PORT}`);
});
