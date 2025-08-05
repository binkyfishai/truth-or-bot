// API handler for content endpoint in Vercel
import { aiService } from '../src/services/aiService';
import { wikipediaService } from '../src/services/wikipediaService';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, difficulty } = req.body;

    if (!model || !difficulty) {
      return res.status(400).json({
        error: "Model and difficulty are required"
      });
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
} 