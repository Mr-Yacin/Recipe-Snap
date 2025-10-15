import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipesFromImage = async (base64Image: string, mimeType: string): Promise<Recipe[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: 'Identify the ingredients in this image. Based on these ingredients, generate 3 creative and delicious recipes. For each recipe, provide a name, a short, enticing description, a list of the ingredients needed, and step-by-step cooking instructions.',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              recipeName: {
                type: Type.STRING,
                description: 'The name of the recipe.',
              },
              description: {
                type: Type.STRING,
                description: 'A brief, appealing description of the dish.'
              },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'A list of ingredients required for the recipe.',
              },
              instructions: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
                description: 'Step-by-step cooking instructions.',
              }
            },
            required: ['recipeName', 'description', 'ingredients', 'instructions'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const recipes: Recipe[] = JSON.parse(jsonText);
    return recipes;

  } catch (error) {
    console.error('Error generating recipes with Gemini:', error);
    // Re-throw the original error so the calling component can handle it specifically.
    throw error;
  }
};