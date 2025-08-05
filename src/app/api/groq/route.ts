import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Default to llama-3.1-70b-versatile if no model is specified
    const modelToUse = model || "llama-3.1-70b-versatile";
    
    const response = await aiService.generateResponse(prompt, modelToUse);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in Groq API route:", error);
    return NextResponse.json(
      { error: `Failed to generate response: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available models
  const availableModels = [
    {
      id: "llama-3.1-70b-versatile",
      name: "Llama 3.1 70B Versatile",
      description: "Meta's Llama 3.1 70B model, versatile for various tasks"
    },
    {
      id: "llama-3.1-8b-versatile",
      name: "Llama 3.1 8B Versatile",
      description: "Meta's Llama 3.1 8B model, smaller but still versatile"
    },
    {
      id: "llama-3-70b-8192",
      name: "Llama 3 70B",
      description: "Meta's Llama 3 70B model"
    },
    {
      id: "llama-3-8b-8192",
      name: "Llama 3 8B",
      description: "Meta's Llama 3 8B model"
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      description: "Mixtral's 8x7B model with 32k context window"
    },
    {
      id: "gemma-7b-it",
      name: "Gemma 7B",
      description: "Google's Gemma 7B Instruct model"
    }
  ];

  return NextResponse.json({ models: availableModels });
} 