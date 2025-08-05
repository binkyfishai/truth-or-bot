import { NextRequest } from "next/server";
import { aiService } from "@/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Default to llama-3.1-70b-versatile if no model is specified
    const modelToUse = model || "llama-3.1-70b-versatile";
    
    // Get the stream from Groq
    const stream = await aiService.streamResponse(prompt, modelToUse);

    // Create a TransformStream to process the chunks
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Return a streaming response
    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              // Send the content chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error("Error in Groq streaming API route:", error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to stream response: ${error instanceof Error ? error.message : String(error)}` 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 