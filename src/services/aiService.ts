import { Article } from "@/components/ArticleCard";

export interface AIServiceConfig {
  model: string;
  difficulty: string;
}

export class AIService {
  private static readonly OPENAI_MODELS = [
    "gpt-4.1-2025-04-14",
    "o4-mini-2025-04-16",
    "gpt-4.1-mini-2025-04-14"
  ];

  private static readonly CLAUDE_MODELS = [
    "claude-sonnet-4-20250514",
    "claude-opus-4-20250514",
    "claude-3-5-haiku-20241022"
  ];

  static async generateFakeArticle(realArticle: Article, config: AIServiceConfig): Promise<Article> {
    try {
      // For now, we'll create a convincing fake article locally
      // In a real implementation, you'd call your chosen AI API here
      const fakeTitle = this.generateVariantTitle(realArticle.title);
      const fakeContent = await this.generateVariantContent(realArticle.content, config.difficulty);
      
      return {
        title: fakeTitle,
        content: fakeContent,
        isReal: false,
        source: "AI Generated",
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    } catch (error) {
      console.error("Error generating fake article:", error);
      return this.createFallbackFakeArticle(realArticle);
    }
  }

  private static generateVariantTitle(originalTitle: string): string {
    const variants = [
      `${originalTitle} (disambiguation)`,
      `${originalTitle} Theory`,
      `History of ${originalTitle}`,
      `${originalTitle} in Popular Culture`,
      `Modern ${originalTitle}`,
      `${originalTitle} Research`,
      `The ${originalTitle} Phenomenon`,
      `${originalTitle} Studies`
    ];
    
    return variants[Math.floor(Math.random() * variants.length)];
  }

  private static async generateVariantContent(originalContent: string, difficulty: string): Promise<string> {
    // In a real implementation, this would call your AI API
    // For now, we'll create a convincing fake by modifying the original
    
    const paragraphs = originalContent.split('\n\n');
    const fakeParagraphs: string[] = [];
    
    // Add some fake information based on difficulty
    const fakeElements = this.getFakeElements(difficulty);
    
    for (let i = 0; i < paragraphs.length && i < 6; i++) {
      let paragraph = paragraphs[i];
      
      if (i === 0) {
        // Modify the first paragraph to be subtly different
        paragraph = this.modifyFirstParagraph(paragraph, fakeElements);
      } else if (i === 1 && Math.random() > 0.5) {
        // Sometimes inject a fake paragraph
        fakeParagraphs.push(this.generateFakeParagraph(fakeElements));
      }
      
      fakeParagraphs.push(this.introduceSubtleChanges(paragraph, difficulty));
    }
    
    return fakeParagraphs.join('\n\n');
  }

  private static getFakeElements(difficulty: string) {
    const elements = {
      easy: {
        dates: ["3050", "1800", "2025"],
        numbers: ["999", "millions", "thousands"],
        locations: ["Mars", "Atlantis", "fictional country"],
        people: ["Dr. Smith", "Professor Johnson", "famous researcher"]
      },
      medium: {
        dates: ["1995", "2001", "1987"],
        numbers: ["approximately 50", "over 200", "nearly 100"],
        locations: ["Northern Europe", "Southeast Asia", "Central America"],
        people: ["renowned scientist", "leading expert", "distinguished professor"]
      },
      hard: {
        dates: ["1962", "1974", "1989"],
        numbers: ["precisely 47", "approximately 156", "over 300"],
        locations: ["University of Cambridge", "Stanford Research Institute", "MIT"],
        people: ["Dr. Margaret Wilson", "Professor David Chen", "Dr. Sarah Thompson"]
      }
    };
    
    return elements[difficulty as keyof typeof elements] || elements.medium;
  }

  private static modifyFirstParagraph(paragraph: string, fakeElements: any): string {
    // Introduce subtle changes to make it seem different but plausible
    let modified = paragraph;
    
    // Sometimes change dates
    if (Math.random() > 0.7) {
      modified = modified.replace(/\b(19|20)\d{2}\b/, fakeElements.dates[0]);
    }
    
    // Sometimes change numbers
    if (Math.random() > 0.6) {
      modified = modified.replace(/\b\d+\b/, fakeElements.numbers[0]);
    }
    
    return modified;
  }

  private static generateFakeParagraph(fakeElements: any): string {
    const templates = [
      `Research conducted by ${fakeElements.people[0]} in ${fakeElements.dates[0]} revealed that ${fakeElements.numbers[0]} cases were documented in ${fakeElements.locations[0]}.`,
      `According to studies from ${fakeElements.locations[1]}, the phenomenon has been observed ${fakeElements.numbers[1]} times since ${fakeElements.dates[1]}.`,
      `${fakeElements.people[1]} published groundbreaking research in ${fakeElements.dates[2]} that identified ${fakeElements.numbers[2]} distinct patterns.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private static introduceSubtleChanges(paragraph: string, difficulty: string): string {
    if (difficulty === 'easy') return paragraph;
    
    // For medium and hard difficulty, make very subtle changes
    let modified = paragraph;
    
    // Occasionally swap similar words
    const synonyms = {
      'important': 'significant',
      'large': 'substantial',
      'many': 'numerous',
      'first': 'initial',
      'last': 'final',
      'developed': 'established',
      'created': 'formed'
    };
    
    Object.entries(synonyms).forEach(([original, replacement]) => {
      if (Math.random() > 0.8) {
        modified = modified.replace(new RegExp(`\\b${original}\\b`, 'gi'), replacement);
      }
    });
    
    return modified;
  }

  private static createFallbackFakeArticle(realArticle: Article): Article {
    return {
      title: `${realArticle.title} (Alternative Theory)`,
      content: `This alternative perspective on ${realArticle.title} presents a different interpretation of the available evidence.\n\nRecent studies conducted by leading researchers have suggested that the conventional understanding may require revision.\n\nThe new framework proposes several key modifications to the existing model, based on data collected from multiple sources over the past decade.\n\nThese findings have significant implications for how we understand this topic and may lead to important developments in the field.`,
      isReal: false,
      source: "AI Generated",
      lastModified: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }
}