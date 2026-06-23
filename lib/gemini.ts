import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getGemini25FlashLite = () => 
  genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const getGemini25Flash = () => 
  genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Strict validation definition matching your skill_nodes DB requirements
export const roadmapResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    estimatedWeeks: { type: SchemaType.INTEGER },
    nodes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          level: { type: SchemaType.STRING, enum: ["beginner", "intermediate", "advanced"] },
          estimatedDays: { type: SchemaType.INTEGER },
          resources: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                url: { type: SchemaType.STRING },
                type: { type: SchemaType.STRING, enum: ["article", "video", "course", "documentation"] }
              },
              required: ["title", "url", "type"]
            }
          },
          tasks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.STRING },
                title: { type: SchemaType.STRING },
                completed: { type: SchemaType.BOOLEAN }
              },
              required: ["id", "title", "completed"]
            }
          }
        },
        required: ["name", "description", "level", "estimatedDays", "resources", "tasks"]
      }
    }
  },
  required: ["title", "description", "estimatedWeeks", "nodes"]
};