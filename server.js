import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client
const groqClient = new Groq({
  apiKey: "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",
});

// Middleware
app.use(cors());
app.use(express.json());

// AI Service functions
const aiService = {
  async generateResponse(prompt, model = "moonshotai/kimi-k2-instruct") {
    try {
      const chatCompletion = await groqClient.chat.completions.create({
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
  },

  async generateFakeArticle(options) {
    const { model, difficulty } = options;
    
    let systemPrompt = "You are an expert at creating convincing but completely fictional Wikipedia articles that perfectly mimic the style, tone, formatting, and visual appearance of real Wikipedia content.";
    
    let prompt = `Create a fictional Wikipedia article. 

TITLE REQUIREMENTS - ABSOLUTELY CRITICAL:
- The VERY FIRST LINE must contain ONLY a short title (2-4 words maximum)
- Examples of good titles: "Mount Alderson", "Keldysh Protocol", "Sarah Chen", "Battle of Corinth"
- DO NOT write full sentences as titles
- DO NOT include "is a" or any descriptive text in the title
- The title should be a proper noun that could realistically exist

FORMATTING REQUIREMENTS:
1. Line 1: Short title only (2-4 words)
2. Line 2: "From Wikipedia, the free encyclopedia"
3. Line 3: Empty line
4. Line 4: Start the article with "**[Title]** is [description]..."

Your task is to create a convincing article about a fictional person, place, event, concept, or discovery that doesn't actually exist but sounds highly plausible and realistic.

Use Wikipedia's exact formatting:
- Section headings with == Section == and === Subsection ===
- Citation formatting with [1], [2], etc.
- Internal links with [[brackets]]
- Bold and italic formatting
- Proper encyclopedia tone and structure

EXAMPLE FORMAT:
Mount Alderson
From Wikipedia, the free encyclopedia

**Mount Alderson** is a prominent peak located in the Sierra Nevada mountain range...

== Geography ==
[content]

=== Climate ===
[content]

== History ==
[content]

== See also ==
* [[Related topic 1]]
* [[Related topic 2]]

== References ==
1. Source citation here

[[Category:Mountains]]`;

    switch (difficulty) {
      case "easy":
        prompt += `\n\nDifficulty: EASY - Create a simple but plausible fictional topic with basic Wikipedia formatting.`;
        break;
      case "medium":
        prompt += `\n\nDifficulty: MEDIUM - Create a sophisticated fictional topic with detailed information and proper Wikipedia structure.`;
        break;
      case "hard":
        prompt += `\n\nDifficulty: HARD - Create an extremely convincing fictional topic that would require expert knowledge to identify as false.`;
        break;
      default:
        prompt += `\n\nDifficulty: MEDIUM - Create a sophisticated fictional topic with detailed information and proper Wikipedia structure.`;
    }

    prompt += `\n\nGenerate your fictional Wikipedia article now. Remember: FIRST LINE = TITLE ONLY (2-4 words):`;
    
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ];
      
      const chatCompletion = await groqClient.chat.completions.create({
        messages: messages,
        model: model,
        temperature: 0.95,
        max_tokens: 3500,
      });

      const responseContent = chatCompletion.choices[0].message.content || "No response generated";
      
      // Extract title - much more aggressive approach
      let title = "Fictional Article";
      const contentLines = responseContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // Look for the actual title in the first few lines
      for (let i = 0; i < Math.min(3, contentLines.length); i++) {
        const line = contentLines[i];
        
        // Skip common AI response prefixes
        if (line.toLowerCase().includes('here is') || 
            line.toLowerCase().includes('fictional') ||
            line.toLowerCase().includes('wikipedia') ||
            line.includes('From Wikipedia') ||
            line.startsWith('**') ||
            line.includes(' is ') ||
            line.includes(' was ') ||
            line.includes(' are ') ||
            line.includes(' were ')) {
          continue;
        }
        
        // If we find a short line that looks like a title, use it
        if (line.length > 0 && line.length < 50 && !line.includes('.')) {
          title = line;
          break;
        }
      }
      
      // Clean up the title further
      title = title
        .replace(/^\d+\.\s*/, '') // Remove numbering
        .replace(/^[-•*]\s*/, '') // Remove bullet points
        .replace(/["""'']/g, '') // Remove quotes
        .replace(/^\s*title:\s*/i, '') // Remove "Title:" prefix
        .trim();
      
      // If title is still too long, extract just the first few words
      const words = title.split(' ');
      if (words.length > 4) {
        title = words.slice(0, 4).join(' ');
      }
      
      // Ensure we have a reasonable title
      if (title.length < 3 || title.length > 50) {
        const fallbackTitles = [
          "Mount Alderson", "Project Meridian", "Sarah Chen", "Battle of Corinth",
          "Keldysh Protocol", "Lake Thornton", "Operation Nightfall", "Dr. Marcus Webb",
          "Treaty of Millbrook", "The Valdez Method", "Port Harrison", "Expedition Aurora"
        ];
        title = fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];
      }
      
      return {
        title: title,
        content: responseContent,
        isAI: true,
        isCompleteFiction: true
      };
    } catch (error) {
      console.error("Error generating fake article:", error);
      throw new Error(`Failed to generate fake article: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  async streamResponse(prompt, model = "moonshotai/kimi-k2-instruct") {
    try {
      const stream = await groqClient.chat.completions.create({
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
};

// Wikipedia content formatter - standardizes both real and AI content to Wikipedia format
const formatAsWikipediaArticle = (title, rawContent) => {
  // Clean up the raw content first
  let content = rawContent
    .replace(/^From Wikipedia, the free encyclopedia\s*/i, '')
    .replace(/^\s*\*\*[^*]+\*\*\s*is\s*/i, '')
    .trim();
  
  // Start with Wikipedia header
  let formattedArticle = `<!DOCTYPE html>
<html class="client-nojs vector-feature-language-in-header-enabled vector-feature-language-in-main-page-header-disabled vector-feature-sticky-header-disabled vector-feature-page-tools-pinned-disabled vector-feature-toc-pinned-clientpref-1 vector-feature-main-menu-pinned-disabled vector-feature-limited-width-clientpref-1 vector-feature-limited-width-content-enabled vector-feature-custom-font-size-clientpref-1 vector-feature-appearance-pinned-clientpref-1 vector-feature-night-mode-enabled skin-theme-clientpref-day vector-toc-available" lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<title>${title} - Wikipedia</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 20px; max-width: 900px; }
.mw-page-title-main { font-size: 2.3em; font-weight: normal; margin-bottom: 0.25em; border-bottom: 3px solid #a2a9b1; padding-bottom: 2px; }
.mw-content-text { font-size: 14px; line-height: 1.6; }
.mw-parser-output > p:first-of-type { margin-top: 0.5em; }
h2 { font-size: 1.5em; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; border-bottom: 1px solid #a2a9b1; padding-bottom: 2px; }
h3 { font-size: 1.2em; font-weight: bold; margin-top: 0.8em; margin-bottom: 0.25em; }
h4 { font-size: 1.1em; font-weight: bold; margin-top: 0.6em; margin-bottom: 0.25em; }
p { margin: 0.5em 0; text-align: justify; }
ul, ol { margin: 0.3em 0 0 1.6em; }
li { margin: 0.25em 0; }
.infobox { float: right; width: 300px; border: 1px solid #a2a9b1; background: #f8f9fa; margin: 0 0 1em 1em; padding: 0; }
.infobox-header { background: #ccccff; padding: 0.25em; text-align: center; font-weight: bold; }
.infobox-data { padding: 0.25em; }
.navbox { border: 1px solid #a2a9b1; width: 100%; margin: auto; clear: both; font-size: 88%; text-align: center; padding: 1px; }
.citation { font-size: 90%; }
sup { font-size: 75%; }
.reference { color: #0645ad; }
a { color: #0645ad; text-decoration: none; }
a:hover { text-decoration: underline; }
.hatnote { font-style: italic; padding: 5px 7px; background-color: #f8f9fa; border-left: 10px solid #36c; margin-bottom: 0.5em; }
.dablink { font-style: italic; padding: 5px 7px; background-color: #f8f9fa; margin-bottom: 0.5em; }
</style>
</head>
<body>
<div class="mw-page-container">
<main class="mw-body">
<div class="mw-content-container">
<article class="mw-body-content">
<h1 class="mw-page-title-main">${title}</h1>
<div class="mw-content-text">
<div class="mw-parser-output">`;

  // Process content into proper Wikipedia sections
  const sections = [];
  let currentSection = { title: '', content: '', level: 0 };
  
  // Split content by paragraphs and headers
  const lines = content.split('\n');
  let inFirstParagraph = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for section headers
    const headerMatch = line.match(/^(={2,6})\s*(.*?)\s*\1$/);
    if (headerMatch) {
      // Save previous section
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection });
      }
      
      // Start new section
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentSection = { title, content: '', level };
      continue;
    }
    
    // Add content to current section
    if (inFirstParagraph && !currentSection.title) {
      // First paragraph should include the article title in bold
      const boldTitle = line.includes('**') ? line : line.replace(new RegExp(title, 'i'), `**${title}**`);
      currentSection.content += boldTitle + '\n\n';
      inFirstParagraph = false;
    } else {
      currentSection.content += line + '\n\n';
    }
  }
  
  // Add final section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  // Format sections
  sections.forEach(section => {
    if (!section.title) {
      // Main content (no header)
      formattedArticle += formatWikipediaContent(section.content);
    } else {
      // Section with header
      const headerTag = section.level === 2 ? 'h2' : section.level === 3 ? 'h3' : 'h4';
      formattedArticle += `<${headerTag}>${section.title}</${headerTag}>\n`;
      formattedArticle += formatWikipediaContent(section.content);
    }
  });
  
  // Add standard Wikipedia footer sections if missing
  const contentLower = formattedArticle.toLowerCase();
  if (!contentLower.includes('<h2>see also</h2>') && !contentLower.includes('<h2>references</h2>')) {
    formattedArticle += `
<h2>See also</h2>
<ul>
<li><a href="#">Related topic 1</a></li>
<li><a href="#">Related topic 2</a></li>
</ul>

<h2>References</h2>
<div class="citation">
<sup>1</sup> <span class="reference">Primary source documentation</span><br>
<sup>2</sup> <span class="reference">Secondary academic source</span>
</div>

<h2>External links</h2>
<ul>
<li><a href="#" class="external">Official website</a></li>
<li><a href="#" class="external">Additional resources</a></li>
</ul>`;
  }
  
  formattedArticle += `
</div>
</div>
</article>
</div>
</main>
</div>
</body>
</html>`;
  
  return formattedArticle;
};

// Helper function to format Wikipedia content with proper markup
const formatWikipediaContent = (content) => {
  return content
    // Convert markdown-style formatting to HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    
    // Convert wiki-style links
    .replace(/\[\[(.*?)\]\]/g, '<a href="#">$1</a>')
    
    // Convert citations
    .replace(/\[(\d+)\]/g, '<sup><a href="#citation-$1" class="reference">[$1]</a></sup>')
    
    // Convert bullet points
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Convert paragraphs
    .split('\n\n')
    .filter(p => p.trim())
    .map(paragraph => {
      if (paragraph.includes('<li>') || paragraph.includes('<h')) {
        return paragraph;
      }
      return `<p>${paragraph.trim()}</p>`;
    })
    .join('\n');
};

// Wikipedia Service functions
const wikipediaService = {
  async getRandomArticle() {
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
      
      // Create a basic Wikipedia-style content structure
      const basicContent = `**${title}** ${extract}

== Overview ==
${extract.substring(0, 200)}...

== History ==
Information about the historical development and background.

== Significance ==
The importance and relevance of this topic.

== See also ==
* Related topics
* Additional information

== References ==
1. Primary source documentation
2. Secondary academic references

== External links ==
* Official resources
* Additional information`;
      
      // Format using our Wikipedia formatter
      const formattedContent = formatAsWikipediaArticle(title, basicContent);
      
      return {
        title,
        content: formattedContent,
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
      
      // Return a fallback article formatted like Wikipedia
      const fallbackContent = formatAsWikipediaArticle(
        "Fallback Wikipedia Article",
        `**Fallback Wikipedia Article** is a placeholder article used when the system encounters difficulties retrieving actual Wikipedia content.

== Technical Details ==
The system attempted to retrieve a random article from Wikipedia but encountered an error.

== Usage ==
This fallback ensures the application continues functioning during service disruptions.`
      );
      
      return {
        title: "Fallback Wikipedia Article",
        content: fallbackContent,
        isAI: false,
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        source: "Wikipedia Fallback"
      };
    }
  }
};

// Function to generate a random fictional title
const generateRandomTitle = () => {
  const prefixes = ["The", "A", "Ancient", "Modern", "Secret", "Hidden", "Lost", "Forgotten", "Mysterious", "Unexplained"];
  const subjects = ["History", "Chronicles", "Legacy", "Origins", "Discovery", "Phenomenon", "Theory", "Revolution", "Expedition", "Civilization"];
  const modifiers = ["of the North", "of the Deep", "Beyond Time", "in Modern Society", "Across Cultures", "Throughout History", "in Science", "of Tomorrow", "in Perspective", "Revisited"];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  
  return `${prefix} ${subject} ${modifier}`;
};

// Groq API route
app.post('/api/groq', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Default to moonshotai/kimi-k2-instruct if no model is specified
    const modelToUse = model || "moonshotai/kimi-k2-instruct";
    
    try {
      const response = await aiService.generateResponse(prompt, modelToUse);
      return res.json(response);
    } catch (error) {
      console.error("Error in Groq API route:", error);
      
      // Provide a fallback response
      return res.json({
        content: "I'm sorry, I couldn't process your request at the moment. The Groq API might be experiencing issues. Here's a fallback response: The question you asked is interesting, but I'm currently operating in fallback mode due to API limitations.",
        model: modelToUse,
        fallback: true,
        error: String(error)
      });
    }
  } catch (error) {
    console.error("Error in Groq API route:", error);
    return res.status(500).json({
      error: `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// Groq models route
app.get('/api/groq', (req, res) => {
  // Return available models
  const availableModels = [
    {
      id: "moonshotai/kimi-k2-instruct",
      name: "Moonshot Kimi K2 Instruct",
      description: "Powerful instruction-tuned model from Moonshot AI"
    },
    {
      id: "llama3-8b-8192",
      name: "Llama 3 8B",
      description: "Meta's Llama 3 8B model"
    },
    {
      id: "llama3-70b-8192",
      name: "Llama 3 70B",
      description: "Meta's Llama 3 70B model"
    },
    {
      id: "gemma-7b-it",
      name: "Gemma 7B",
      description: "Google's Gemma 7B Instruct model"
    }
  ];

  return res.json({ models: availableModels });
});

// Groq streaming route
app.post('/api/groq/stream', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Default to moonshotai/kimi-k2-instruct if no model is specified
    const modelToUse = model || "moonshotai/kimi-k2-instruct";
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    try {
      // Get the stream from Groq
      const stream = await aiService.streamResponse(prompt, modelToUse);
      
      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          // Send the content chunk
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error("Error streaming response:", error);
      
      // Send fallback response
      res.write(`data: ${JSON.stringify({ content: "I'm sorry, I couldn't process your streaming request. " })}\n\n`);
      res.write(`data: ${JSON.stringify({ content: "The Groq API might be experiencing issues. " })}\n\n`);
      res.write(`data: ${JSON.stringify({ content: "Here's a fallback response: " })}\n\n`);
      res.write(`data: ${JSON.stringify({ content: "The question you asked is interesting, but I'm currently operating in fallback mode due to API limitations." })}\n\n`);
      res.write(`data: ${JSON.stringify({ error: String(error) })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error) {
    console.error("Error in Groq streaming API route:", error);
    return res.status(500).json({
      error: `Failed to stream response: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// Game API route
app.post('/api/game', async (req, res) => {
  console.log("REDIRECTING: Old /api/game endpoint was called - redirecting to /api/content");
  // Just forward the request to the content endpoint
  req.url = '/api/content';
  app.handle(req, res);
});

// Content API route (duplicate of game API but with different name to avoid ad blockers)
app.post('/api/content', async (req, res) => {
  try {
    const { model, difficulty } = req.body;

    if (!model || !difficulty) {
      return res.status(400).json({ error: "Model and difficulty are required" });
    }

    // Add cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    console.log(`New content request - Difficulty: ${difficulty}, Model: ${model}, Timestamp: ${new Date().toISOString()}`);

    try {
      // Fetch real and fake articles in parallel to save time
      console.log("Fetching random Wikipedia article and generating fictional article in parallel...");
      
      const [realArticle, fakeArticle] = await Promise.all([
        wikipediaService.getRandomArticle(),
        aiService.generateFakeArticle({ model, difficulty })
      ]);
      
      console.log(`Got Wikipedia article: "${realArticle.title}" (${realArticle.content.length} chars)`);
      console.log(`Got fictional article: "${fakeArticle.title}" (${fakeArticle.content.length} chars)`);

      // IMPORTANT: Force the fake article title to always be identical to the real one
      // This prevents the AI-generated titles from giving themselves away
      fakeArticle.title = realArticle.title;
      console.log(`Forced identical title for both articles: "${fakeArticle.title}"`);

      // Randomly decide which article to present first
      const isRealFirst = Math.random() > 0.5;
      const articles = isRealFirst ? [realArticle, fakeArticle] : [fakeArticle, realArticle];
      
      // Final check of the articles array
      console.log(`Final articles array - [0]: "${articles[0].title}", [1]: "${articles[1].title}"`);
      console.log(`Real article index: ${isRealFirst ? '0' : '1'}`);
      console.log(`Sending to client - Real: "${articles[isRealFirst ? 0 : 1].title}", Fake: "${articles[isRealFirst ? 1 : 0].title}"`);

      return res.json({
        articles,
        realArticleIndex: isRealFirst ? 0 : 1,
        timestamp: new Date().getTime() // Add timestamp to prevent caching
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      
      // Create fallback articles
      let realArticle, fakeArticle;
      
      try {
        // Try to at least get a Wikipedia article
        realArticle = await wikipediaService.getRandomArticle();
      } catch (wikiError) {
        console.error("Error fetching Wikipedia article:", wikiError);
        realArticle = {
          title: "Fallback Wikipedia Article",
          content: "This is a fallback Wikipedia article. The service encountered an error fetching real content.",
          isAI: false,
          lastModified: new Date().toLocaleDateString('en-US'),
          source: 'Wikipedia Fallback'
        };
      }
      
      // Create a simple fake article as fallback with identical title
      fakeArticle = {
        title: realArticle.title, // Use the same title as the real article
        content: "This is a fallback AI-generated article. The service encountered an error generating content.",
        isAI: true,
        isCompleteFiction: true,
        lastModified: new Date().toLocaleDateString('en-US'),
        source: 'AI Fallback'
      };
      
      // Verify titles are identical
      console.log(`Fallback titles - Real: "${realArticle.title}", Fake: "${fakeArticle.title}"`);
      
      // Randomly decide which article to present first
      const isRealFirst = Math.random() > 0.5;
      const articles = isRealFirst ? [realArticle, fakeArticle] : [fakeArticle, realArticle];

      return res.json({
        articles,
        realArticleIndex: isRealFirst ? 0 : 1,
        fallback: true,
        timestamp: new Date().getTime() // Add timestamp to prevent caching
      });
    }
  } catch (error) {
    console.error("Error in content API route:", error);
    return res.status(500).json({
      error: `Failed to generate content: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().getTime() // Add timestamp to prevent caching
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
}); 