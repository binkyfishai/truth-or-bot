import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Search, Menu, User, Shield, Zap, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Article as ServiceArticle } from "@/services/aiService";

export interface Article extends ServiceArticle {
  source?: string;
  lastModified?: string;
  isCompleteFiction?: boolean;
}

interface ArticleCardProps {
  article: Article;
  onSelect: () => void;
  isSelected?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
}

export const ArticleCard = ({ article, onSelect, isSelected, isRevealed, disabled }: ArticleCardProps) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getBadgeText = () => {
    if (!isRevealed) return "Select Article";
    if (!article.isAI) return "Authentic Content";
    return article.isCompleteFiction ? "Completely Fictional" : "AI Generated";
  };

  // Get the appropriate icon for the article status
  const getIcon = () => {
    if (!isRevealed) return null;
    return !article.isAI ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  // Function to render content with proper Wikipedia formatting for all articles
  const renderWikiContent = (content: string) => {
    // Split the content by paragraphs
    const paragraphs = content.split('\n\n');
    
    return (
      <div className="space-y-4 text-black leading-relaxed font-serif">
        {paragraphs.map((paragraph, index) => {
          // Skip empty paragraphs
          if (!paragraph.trim()) return null;
          
          // Handle "From Wikipedia, the free encyclopedia" line
          if (paragraph.includes("From Wikipedia, the free encyclopedia")) {
            return (
              <div key={index} className="text-xs text-gray-600 mb-4 italic">
                {paragraph}
              </div>
            );
          }
          
          // Check if this is a section header (== Header ==)
          const headerMatch = paragraph.match(/^(={2,6})\s*(.*?)\s*\1$/);
          if (headerMatch) {
            const headerLevel = headerMatch[1].length;
            const headerText = headerMatch[2].trim();
            
            return (
              <div key={index} className={`mt-${headerLevel === 2 ? '6' : '4'} mb-2`}>
                {headerLevel === 2 ? (
                  <h2 className="text-xl font-bold border-b border-gray-200 pb-1">{headerText}</h2>
                ) : headerLevel === 3 ? (
                  <h3 className="text-lg font-bold">{headerText}</h3>
                ) : (
                  <h4 className="text-base font-bold">{headerText}</h4>
                )}
              </div>
            );
          }
          
          // Handle bullet points
          if (paragraph.includes('• ')) {
            const listItems = paragraph.split('• ').filter(Boolean);
            return (
              <ul key={index} className="list-disc pl-5 space-y-1">
                {listItems.map((item, i) => (
                  <li key={i} className="text-sm">{item.trim()}</li>
                ))}
              </ul>
            );
          }
          
          // Regular paragraph with formatting
          return (
            <p key={index} className="text-sm text-justify">
              <span dangerouslySetInnerHTML={{ 
                __html: paragraph
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/_(.*?)_/g, '<em>$1</em>')
                  .replace(/\[\[citation needed\]\]/g, '<sup><span class="text-blue-600">[citation needed]</span></sup>')
                  .replace(/\[\[Category:(.*?)\]\]/g, '')
                  .replace(/\[\[(.*?)\]\]/g, '<a href="#" class="text-blue-600 hover:underline">$1</a>')
                  .replace(/\[(\d+)\]/g, '<sup><a href="#citation-$1" class="text-blue-600">[$1]</a></sup>')
              }} />
            </p>
          );
        })}
      </div>
    );
  };

  // Generate a consistent "last modified" date for both real and AI articles
  const getLastModified = () => {
    return article.lastModified || "June 15, 2023";
  };

  return (
    <Card 
      className={`h-full overflow-hidden transition-all duration-500 bg-white text-black border-2 rounded-xl shadow-lg transform ${
        animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${
        isSelected && !isRevealed 
          ? 'border-green-400 shadow-lg shadow-green-400/20' 
          : isRevealed 
            ? (!article.isAI ? 'border-green-500 shadow-green-500/20' : 'border-red-500 shadow-red-500/20')
            : 'border-gray-600 hover:border-green-400/50 hover:shadow-green-400/10'
      }`}
    >
      <div
        onClick={disabled ? undefined : onSelect}
        className={`w-full h-full relative ${
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        }`}
      >
        {/* Status header overlay */}
        {isRevealed && (
          <div className={`absolute top-0 left-0 right-0 bg-black/95 text-white text-sm p-3 z-20 border-b ${
            !article.isAI ? 'border-green-500/50' : 'border-red-500/50'
          } transition-all duration-500`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>Analysis Complete</span>
              </div>
              <Badge 
                variant="outline"
                className={`text-sm border ${
                  !article.isAI 
                    ? 'border-green-500 text-green-400 bg-green-500/10' 
                    : 'border-red-500 text-red-400 bg-red-500/10'
                }`}
              >
                {getIcon()}
                <span className="ml-1">{getBadgeText()}</span>
              </Badge>
            </div>
          </div>
        )}
        
        {/* Wikipedia page recreation */}
        <div className="bg-white text-black min-h-[600px] font-sans mt-0">
          {/* Wikipedia header bar - IDENTICAL FOR BOTH */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png"
                alt="Wikipedia logo"
                className="w-6 h-6"
              />
              <div>
                <div className="font-serif text-lg leading-none">Wikipedia</div>
                <div className="text-[10px] -mt-1 text-gray-600">The Free Encyclopedia</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Search className="w-4 h-4 text-gray-600" />
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          
          {/* Wikipedia navigation tabs - IDENTICAL FOR BOTH */}
          <div className="border-b border-gray-300 bg-white">
            <div className="px-4 py-1">
              <div className="flex gap-6 text-sm">
                <span className="text-blue-600 border-b-2 border-blue-600 py-2 font-medium">Article</span>
                <span className="text-gray-600 py-2 hover:text-blue-600 cursor-pointer">Talk</span>
              </div>
            </div>
          </div>
          
          {/* Wikipedia content area */}
          <div className="flex">
            {/* Main content */}
            <div className="flex-1 p-4">
              {/* Article title */}
              <h1 className="text-3xl font-serif leading-tight mb-4 text-black border-b border-gray-300 pb-2">
                {article.title}
              </h1>
              
              {/* Article content with standardized rendering */}
              {renderWikiContent(article.content)}
            </div>
            
            {/* Wikipedia sidebar - IDENTICAL FOR BOTH */}
            <div className="w-48 bg-gray-50 border-l border-gray-300 p-3 hidden md:block">
              <div className="text-xs text-gray-600 space-y-2">
                <div className="font-semibold text-black">{article.title}</div>
                <div className="border-t border-gray-300 pt-2">
                  <div>Last edited: {getLastModified()}</div>
                </div>
              </div>
            </div>
          </div>
          
        {/* Wikipedia footer - IDENTICAL FOR BOTH */}
        <div className="border-t border-gray-300 bg-gray-50 p-4 text-xs text-gray-600">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <span>Last edited on {getLastModified()}</span>
            <span>Text is available under CC BY-SA 4.0</span>
          </div>
        </div>
        <div className="p-2 text-center text-gray-500 text-xs">
          Content from Wikipedia is licensed under CC BY-SA 4.0
        </div>
      </div>
        
        {!isRevealed && (
          <div className="absolute bottom-4 right-4">
            <Badge
              variant="outline"
              className="bg-gray-900/90 border-gray-600 text-gray-300 text-sm hover:border-green-400 hover:text-green-400 transition-colors px-3 py-1.5"
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                  Selected
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 mr-1" />
                  {getBadgeText()}
                </>
              )}
            </Badge>
          </div>
        )}
        
        {/* Selection overlay */}
        {isSelected && !isRevealed && (
          <div className="absolute inset-0 bg-green-500/5 pointer-events-none border-2 border-green-400 rounded-xl">
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Selected
              </Badge>
            </div>
          </div>
        )}
        
        {/* Hover effect overlay */}
        {!disabled && !isSelected && !isRevealed && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        )}
      </div>
    </Card>
  );
};