import Groq from 'groq-sdk';

// Define types for AI responses
export interface AIResponse {
  content: string;
  model: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface Article {
  title: string;
  content: string;
  isAI: boolean;
  isCompleteFiction?: boolean;
}

class AIService {
  private groqClient: Groq;
  
  constructor() {
    // Initialize the Groq client with API key
    this.groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      // Optional: Add custom configuration if needed
      // dangerouslyAllowBrowser: process.env.NODE_ENV === 'development'
    });
  }

  /**
   * Generate a response using Groq API
   */
  async generateResponse(prompt: string, model: string = "llama-3.1-70b-versatile"): Promise<AIResponse> {
    try {
      const chatCompletion = await this.groqClient.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides accurate and concise information." },
          { role: "user", content: prompt }
        ],
        model: model,
        temperature: 0.5,
        max_tokens: 1000,
      });

      const responseContent = chatCompletion.choices[0].message.content || "No response generated";
      
      return {
        content: responseContent,
        model: model,
        tokenUsage: {
          promptTokens: chatCompletion.usage?.prompt_tokens || 0,
          completionTokens: chatCompletion.usage?.completion_tokens || 0,
          totalTokens: chatCompletion.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a fake article based on a real one
   */
  async generateFakeArticle(realArticle: Article, options: { model: string; difficulty: string }): Promise<Article> {
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
      const response = await this.generateResponse(prompt, model);
      
      // Process the content to ensure it has proper Wikipedia formatting
      let processedContent = response.content;
      
      // Make sure it starts with "From Wikipedia..."
      if (!processedContent.includes("From Wikipedia")) {
        processedContent = "From Wikipedia, the free encyclopedia\n\n" + processedContent;
      }
      
      return {
        title: realArticle.title,
        content: processedContent,
        isAI: true
      };
    } catch (error) {
      console.error("Error generating fake article:", error);
      throw new Error(`Failed to generate fake article: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a response with structured JSON output
   */
  async generateStructuredResponse<T>(prompt: string, model: string = "llama-3.1-70b-versatile"): Promise<T> {
    try {
      const chatCompletion = await this.groqClient.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides responses in valid JSON format." },
          { role: "user", content: prompt }
        ],
        model: model,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const responseContent = chatCompletion.choices[0].message.content || "{}";
      return JSON.parse(responseContent) as T;
    } catch (error) {
      console.error("Error generating structured response:", error);
      throw new Error(`Failed to generate structured response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Stream a response using Groq API
   */
  async streamResponse(prompt: string, model: string = "llama-3.1-70b-versatile") {
    try {
      const stream = await this.groqClient.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides accurate and concise information." },
          { role: "user", content: prompt }
        ],
        model: model,
        temperature: 0.5,
        max_tokens: 1000,
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error("Error streaming AI response:", error);
      throw new Error(`Failed to stream AI response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();
export default aiService;