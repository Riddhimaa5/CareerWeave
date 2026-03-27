import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as path from 'path';

const app = express();
app.use(express.json());

// Initialize Gemini API lazily
let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.AIzaSyBLa1BGgx2gcr1jALitLSdItbdtB9Jqefg;
    if (!apiKey || apiKey === 'CareerWeave') {
      throw new Error("GEMINI_API_KEY environment variable is missing or invalid. Please configure it in the AI Studio Secrets panel.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

app.post('/generate', async (req, res) => {
  try {
    const { currentRole, targetRole } = req.body;

    if (!currentRole || !targetRole) {
      return res.status(400).json({ error: 'Current role and target role are required.' });
    }

    const genAI = getAI();
    const response = await genAI.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Generate 2 to 3 career paths from "${currentRole}" to "${targetRole}".
      Provide 3 paths labeled exactly: "🚀 Fast Track", "⚖️ Balanced", and "🧠 Expert".
      Each path must have 3 to 5 steps.
      For each step, provide the title, a short description, 3-5 skills, estimated time to achieve, and difficulty level (e.g., Easy, Medium, Hard, Expert).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: "OBJECT",
          properties: {
            paths: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  description: { type: "STRING" },
                  steps: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        title: { type: "STRING" },
                        description: { type: "STRING" },
                        skills: {
                          type: "ARRAY",
                          items: { type: "STRING" }
                        },
                        time: { type: "STRING" },
                        difficulty: { type: "STRING" }
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
    const paths = Array.isArray(data) ? data : (data.paths || []);
    res.json(paths);
  } catch (error: any) {
    console.error('Error generating paths:', error);
    let errorMessage = error.message || 'Failed to generate career paths.';
    
    // Handle specific Gemini API errors
    if (errorMessage.includes('API key not valid') || errorMessage.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid Gemini API Key. Please configure a valid API key in the AI Studio Secrets panel.';
    } else if (errorMessage.includes('GEMINI_API_KEY environment variable is missing')) {
      errorMessage = 'Missing Gemini API Key. Please configure it in the AI Studio Secrets panel.';
    }

    res.status(500).json({ error: errorMessage });
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

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
