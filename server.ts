import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import * as path from 'path';

const app = express();
app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/generate', async (req, res) => {
  try {
    const { currentRole, targetRole } = req.body;

    if (!currentRole || !targetRole) {
      return res.status(400).json({ error: 'Current role and target role are required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Generate 2 to 3 career paths from "${currentRole}" to "${targetRole}".
      Provide 3 paths labeled exactly: "🚀 Fast Track", "⚖️ Balanced", and "🧠 Expert".
      Each path must have 3 to 5 steps.
      For each step, provide the title, a short description, 3-5 skills, estimated time to achieve, and difficulty level (e.g., Easy, Medium, Hard, Expert).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        skills: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        time: { type: Type.STRING },
                        difficulty: { type: Type.STRING }
                      },
                      required: ["title", "description", "skills", "time", "difficulty"]
                    }
                  }
                },
                required: ["label", "description", "steps"]
              }
            }
          },
          required: ["paths"]
        }
      }
    });

    let rawText = response.text || '{}';
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
    }
    const data = JSON.parse(rawText);
    res.json(data.paths || []);
  } catch (error: any) {
    console.error('Error generating paths:', error);
    res.status(500).json({ error: error.message || 'Failed to generate career paths.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
