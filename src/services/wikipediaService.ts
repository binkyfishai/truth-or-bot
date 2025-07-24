import { Article } from "@/components/ArticleCard";

interface WikipediaPage {
  title: string;
  extract: string;
  lastmodified?: string;
}

interface WikipediaResponse {
  query: {
    pages: Record<string, WikipediaPage>;
  };
}

export class WikipediaService {
  private static readonly BASE_URL = "https://en.wikipedia.org/api/rest_v1";
  private static readonly API_URL = "https://en.wikipedia.org/w/api.php";

  static async getRandomArticle(): Promise<Article> {
    try {
      // First, get a random page title
      const randomResponse = await fetch(
        `${this.API_URL}?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`
      );
      
      if (!randomResponse.ok) {
        throw new Error("Failed to fetch random page");
      }

      const randomData = await randomResponse.json();
      const pageTitle = randomData.query.random[0].title;

      // Then get the page content
      const contentResponse = await fetch(
        `${this.API_URL}?action=query&prop=extracts|info&explaintext=true&exsectionformat=plain&redirects=1&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*&inprop=lastmodified`
      );

      if (!contentResponse.ok) {
        throw new Error("Failed to fetch page content");
      }

      const contentData: WikipediaResponse = await contentResponse.json();
      const pages = contentData.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (!page || !page.extract) {
        // Try again with a different page if this one is empty
        return this.getRandomArticle();
      }

      // Clean up the extract to remove unwanted patterns
      const cleanContent = page.extract
        .replace(/\n\n+/g, '\n\n')
        .replace(/^[^a-zA-Z]*/, '')
        .trim();

      // Ensure minimum content length
      if (cleanContent.length < 200) {
        return this.getRandomArticle();
      }

      // Format the last modified date
      const lastModified = page.lastmodified 
        ? new Date(page.lastmodified).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : undefined;

      return {
        title: page.title,
        content: cleanContent,
        isReal: true,
        source: "Wikipedia",
        lastModified
      };
    } catch (error) {
      console.error("Error fetching Wikipedia article:", error);
      // Return a fallback article
      return {
        title: "Sample Article",
        content: "This is a sample article that demonstrates the Wikipedia article format. It contains multiple paragraphs of information about various topics.\n\nThis is the second paragraph that continues the explanation with more detailed information about the subject matter.\n\nThe article continues with additional sections and paragraphs to provide comprehensive coverage of the topic.",
        isReal: true,
        source: "Wikipedia",
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    }
  }

  static async searchArticle(query: string): Promise<Article | null> {
    try {
      const response = await fetch(
        `${this.API_URL}?action=query&prop=extracts|info&explaintext=true&exsectionformat=plain&redirects=1&titles=${encodeURIComponent(query)}&format=json&origin=*&inprop=lastmodified`
      );

      if (!response.ok) {
        return null;
      }

      const data: WikipediaResponse = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (!page || !page.extract || pageId === "-1") {
        return null;
      }

      const cleanContent = page.extract
        .replace(/\n\n+/g, '\n\n')
        .replace(/^[^a-zA-Z]*/, '')
        .trim();

      const lastModified = page.lastmodified 
        ? new Date(page.lastmodified).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : undefined;

      return {
        title: page.title,
        content: cleanContent,
        isReal: true,
        source: "Wikipedia",
        lastModified
      };
    } catch (error) {
      console.error("Error searching Wikipedia article:", error);
      return null;
    }
  }
}