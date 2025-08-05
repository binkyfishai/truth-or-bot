import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/aiService";
import { wikipediaService } from "@/services/wikipediaService";

export async function POST(req: NextRequest) {
  try {
    const { model, difficulty } = await req.json();

    if (!model || !difficulty) {
      return NextResponse.json(
        { error: "Model and difficulty are required" },
        { status: 400 }
      );
    }

    // Get a random Wikipedia article
    const realArticle = await wikipediaService.getRandomArticle();
    
    // Generate a fake article based on the real one
    const fakeArticle = await aiService.generateFakeArticle(realArticle, {
      model,
      difficulty
    });

    // Randomly decide which article to present first
    const isRealFirst = Math.random() > 0.5;
    const articles = isRealFirst ? [realArticle, fakeArticle] : [fakeArticle, realArticle];

    return NextResponse.json({
      articles,
      realArticleIndex: isRealFirst ? 0 : 1
    });
  } catch (error) {
    console.error("Error in game API route:", error);
    return NextResponse.json(
      { error: `Failed to generate game content: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 