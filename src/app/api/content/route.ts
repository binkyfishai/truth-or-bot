import { NextRequest, NextResponse } from "next/server";
import Groq from 'groq-sdk';
import { Article } from "@/services/aiService";

// Initialize Groq client
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || "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",
});

// Function to get a random Wikipedia article
async function getRandomArticle(): Promise<Article> {
  try {
    // Get a random article
    const randomUrl = `https://en.wikipedia.org/api/rest_v1/page/random/summary`;
    const randomResponse = await fetch(randomUrl);
    
    if (!randomResponse.ok) {
      throw new Error(`Failed to fetch random article: ${randomResponse.status}`);
    }
    
    const randomData = await randomResponse.json();
    const title = randomData.title;
    
    // Get the extract for basic content
    const extract = randomData.extract || "No content available for this article.";
    
    // Format the article content with Wikipedia style
    let content = `From Wikipedia, the free encyclopedia\n\n${extract}`;
    
    // Add section headers if they don't exist
    if (!content.includes("==")) {
      const paragraphs = content.split("\n\n");
      
      // If we have multiple paragraphs, add sections
      if (paragraphs.length > 2) {
        // Add Overview section
        content += "\n\n== Overview ==\n\n";
        content += paragraphs.slice(1).join("\n\n");
      }
    }
    
    // Add wiki links to important terms
    const terms = title.split(' ');
    terms.forEach(term => {
      if (term.length > 4) {
        // Don't replace inside existing wiki links
        const regex = new RegExp(`(?<!\\[\\[)\\b${term}\\b(?!\\]\\])`, 'gi');
        content = content.replace(regex, `[[${term}]]`);
      }
    });
    
    // Add at least one citation if none exist
    if (!content.includes("[1]")) {
      content += "\n\n== References ==\n\n1. Wikipedia contributors. \"" + title + "\", Wikipedia, The Free Encyclopedia.";
    }
    
    return {
      title,
      content,
      isAI: false,
      lastModified: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      source: 'Wikipedia',
      url: randomData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
  } catch (error) {
    console.error("Error fetching random Wikipedia article:", error);
    
    // Return a fallback article
    return {
      title: "Fallback Wikipedia Article",
      content: "From Wikipedia, the free encyclopedia\n\nThis is a fallback article used when the system encounters difficulties retrieving actual Wikipedia content.\n\n== Technical Details ==\nThe system attempted to retrieve a random article from Wikipedia but encountered an error.",
      isAI: false,
      lastModified: new Date().toLocaleDateString('en-US'),
      source: "Wikipedia Fallback"
    };
  }
}

// Function to generate a fake article based on a real one
async function generateFakeArticle(realArticle: Article, options: { model: string; difficulty: string }): Promise<Article> {
  const { model, difficulty } = options;
  
  // Create a prompt based on difficulty
  let prompt = `Based on this real Wikipedia article titled "${realArticle.title}", create a convincing but fake version. 
  
IMPORTANT: Your response MUST match the exact format and style of a Wikipedia article, including:
1. Starting with "From Wikipedia, the free encyclopedia"
2. Using Wikipedia-style section headers with == Section Title == format
3. Including proper citations like [1], [2], etc.
4. Using [[wiki links]] for important terms
5. Maintaining the same paragraph structure and overall layout as the original
6. Including the same type of details (dates, names, statistics) but with subtle alterations

EXTREMELY IMPORTANT:
- DO NOT CHANGE THE TITLE of the article at all
- DO NOT ADD PREFIXES like "Modern" or "In Pop Culture" to the title
- DO NOT MODIFY THE TITLE in any way
- Keep the title EXACTLY as "${realArticle.title}" with no additions or changes

The fake article should be visually indistinguishable from the real one.`;
  
  switch (difficulty) {
    case "easy":
      prompt += " Include some obvious factual errors that would be easy to spot.";
      break;
    case "medium":
      prompt += " Include subtle factual errors that require some knowledge to detect.";
      break;
    case "hard":
      prompt += " Make it extremely convincing with very subtle inaccuracies that would be difficult for most people to detect.";
      break;
    default:
      prompt += " Include some subtle factual errors.";
  }
  
  prompt += `\n\nOriginal article content:\n${realArticle.content}\n\nGenerate a fake version with an identical structure but altered facts:`;
  
  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert at creating deceptive content that perfectly mimics Wikipedia style and formatting." },
        { role: "user", content: prompt }
      ],
      model: model || "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = chatCompletion.choices[0].message.content || "No response generated";
    
    // Process the content to ensure it has proper Wikipedia formatting
    let processedContent = responseContent;
    
    // Make sure it starts with "From Wikipedia..."
    if (!processedContent.includes("From Wikipedia")) {
      processedContent = "From Wikipedia, the free encyclopedia\n\n" + processedContent;
    }
    
    return {
      title: realArticle.title,
      content: processedContent,
      isAI: true,
      lastModified: realArticle.lastModified
    };
  } catch (error) {
    console.error("Error generating fake article:", error);
    
    // Return a basic fake article as fallback
    return {
      title: realArticle.title,
      content: "From Wikipedia, the free encyclopedia\n\nThis is a fallback AI-generated article. The service encountered an error generating content.",
      isAI: true,
      isCompleteFiction: true,
      lastModified: realArticle.lastModified
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { model, difficulty } = data;

    if (!model || !difficulty) {
      return NextResponse.json(
        { error: "Model and difficulty are required" },
        { status: 400 }
      );
    }

    // Get a random Wikipedia article
    const realArticle = await getRandomArticle();
    
    // Generate a fake article based on the real one
    const fakeArticle = await generateFakeArticle(realArticle, {
      model,
      difficulty
    });

    // Force the fake article title to be exactly the same as the real one
    // This ensures no prefixes like "Modern" are added
    fakeArticle.title = realArticle.title;
    
    // Randomly decide which article to present first
    const isRealFirst = Math.random() > 0.5;
    const articles = isRealFirst ? [realArticle, fakeArticle] : [fakeArticle, realArticle];

    // Set headers to prevent CORS issues
    return NextResponse.json(
      {
        articles,
        realArticleIndex: isRealFirst ? 0 : 1,
        timestamp: Date.now() // Add timestamp to prevent caching
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error("Error in content API route:", error);
    return NextResponse.json(
      { error: `Failed to generate content: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
} 