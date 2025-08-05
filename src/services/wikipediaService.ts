import { Article } from "./aiService";

// Define interface for Wikipedia API responses
interface WikipediaPage {
  title: string;
  excerpt?: string;
}

class WikipediaService {
  private baseUrl = "https://en.wikipedia.org/api/rest_v1";

  /**
   * Get a random Wikipedia article
   */
  async getRandomArticle(): Promise<Article> {
    try {
      // First, get a random article title
      const randomUrl = `${this.baseUrl}/page/random/summary`;
      const response = await fetch(randomUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch random article: ${response.status}`);
      }
      
      const data = await response.json();
      const title = data.title;
      const extract = data.extract;
      
      // For longer content, fetch the full article
      if (extract.length < 500) {
        return this.getArticleByTitle(title);
      }
      
      return {
        title,
        content: this.formatWikipediaContent(extract, title),
        isAI: false
      };
    } catch (error) {
      console.error("Error fetching random Wikipedia article:", error);
      throw new Error(`Failed to fetch random article: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a Wikipedia article by title
   */
  async getArticleByTitle(title: string): Promise<Article> {
    try {
      // Encode the title for URL
      const encodedTitle = encodeURIComponent(title);
      const articleUrl = `${this.baseUrl}/page/summary/${encodedTitle}`;
      
      const response = await fetch(articleUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch article "${title}": ${response.status}`);
      }
      
      const data = await response.json();
      
      // If the extract is too short, try to get more content
      if (data.extract && data.extract.length < 500) {
        const htmlUrl = `${this.baseUrl}/page/html/${encodedTitle}`;
        const htmlResponse = await fetch(htmlUrl);
        
        if (htmlResponse.ok) {
          const htmlContent = await htmlResponse.text();
          // Simple parsing to get text content (in a real app, use a proper HTML parser)
          const textContent = this.extractTextFromHtml(htmlContent);
          
          return {
            title: data.title,
            content: this.formatWikipediaContent(textContent.slice(0, 2000), data.title), // Limit content length
            isAI: false
          };
        }
      }
      
      return {
        title: data.title,
        content: this.formatWikipediaContent(data.extract || "No content available", data.title),
        isAI: false
      };
    } catch (error) {
      console.error(`Error fetching Wikipedia article "${title}":`, error);
      throw new Error(`Failed to fetch article "${title}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Format content to match Wikipedia style
   */
  private formatWikipediaContent(content: string, title: string): string {
    // Make sure content starts with "From Wikipedia, the free encyclopedia"
    if (!content.includes("From Wikipedia")) {
      content = "From Wikipedia, the free encyclopedia\n\n" + content;
    }
    
    // Add section headers if they don't exist
    if (!content.includes("==")) {
      const paragraphs = content.split("\n\n");
      
      // If we have multiple paragraphs, add sections
      if (paragraphs.length > 2) {
        // Add Introduction section
        let newContent = paragraphs[0] + "\n\n";
        
        // Add Overview section with the remaining content
        newContent += "== Overview ==\n\n";
        newContent += paragraphs.slice(1).join("\n\n");
        
        content = newContent;
      }
    }
    
    // Add wiki links to important terms
    // This is a simple heuristic - in a real app, use a more sophisticated approach
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
    
    return content;
  }

  /**
   * Search Wikipedia articles
   */
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const searchUrl = `${this.baseUrl}/page/search/${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to search articles: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get the first few results
      const articles = await Promise.all(
        data.pages.slice(0, 3).map(async (page: WikipediaPage) => {
          try {
            return await this.getArticleByTitle(page.title);
          } catch (error) {
            console.error(`Error fetching article "${page.title}":`, error);
            return {
              title: page.title,
              content: this.formatWikipediaContent(page.excerpt || "Failed to load content", page.title),
              isAI: false
            };
          }
        })
      );
      
      return articles;
    } catch (error) {
      console.error("Error searching Wikipedia articles:", error);
      throw new Error(`Failed to search articles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Simple HTML to text extraction (in a real app, use a proper HTML parser)
   */
  private extractTextFromHtml(html: string): string {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, ' ');
    
    // Replace multiple spaces with a single space
    text = text.replace(/\s+/g, ' ');
    
    // Replace HTML entities
    text = text.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'");
    
    return text.trim();
  }
}

// Export a singleton instance
export const wikipediaService = new WikipediaService();
export default wikipediaService;