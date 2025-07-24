import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Search, Menu, User } from "lucide-react";

export interface Article {
  title: string;
  content: string;
  isReal: boolean;
  source?: string;
  lastModified?: string;
}

interface ArticleCardProps {
  article: Article;
  onSelect: () => void;
  isSelected?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
}

export const ArticleCard = ({ article, onSelect, isSelected, isRevealed, disabled }: ArticleCardProps) => {
  const getIcon = () => {
    if (!isRevealed) return null;
    return article.isReal ? <Globe className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />;
  };

  const getBadgeText = () => {
    if (!isRevealed) return "Choose This Article";
    return article.isReal ? "Real Wikipedia" : "AI Generated";
  };

  return (
    <Card className={`h-full overflow-hidden transition-all duration-300 bg-white text-black border border-gray-200 ${
      isSelected && !isRevealed ? 'ring-2 ring-blue-600 shadow-lg' : 'hover:shadow-lg'
    }`}>
      <div
        onClick={disabled ? undefined : onSelect}
        className={`w-full h-full relative ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        {isRevealed && (
          <Badge 
            variant={article.isReal ? "default" : "secondary"} 
            className={`absolute top-4 right-4 flex items-center gap-2 z-10 ${
              article.isReal ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {getIcon()}
            {getBadgeText()}
          </Badge>
        )}
        
        {/* Wikipedia page recreation */}
        <div className="bg-white text-black min-h-[600px] font-sans">
          {/* Wikipedia header bar */}
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
          
          {/* Wikipedia navigation tabs */}
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
              
              {/* Wikipedia notice */}
              <div className="text-xs text-gray-600 mb-4 italic">
                From Wikipedia, the free encyclopedia
              </div>
              
              {/* Article content */}
              <div className="space-y-4 text-black leading-relaxed font-serif">
                {article.content.split('\n').slice(0, 8).map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="text-sm text-justify">
                      {index === 0 ? (
                        <>
                          <span className="font-bold">
                            {paragraph.split(' ').slice(0, 3).join(' ')}
                          </span>
                          {' ' + paragraph.split(' ').slice(3).join(' ')}
                        </>
                      ) : paragraph}
                    </p>
                  )
                ))}
                {article.content.split('\n').length > 8 && (
                  <p className="text-gray-500 italic text-sm">...</p>
                )}
              </div>
            </div>
            
            {/* Wikipedia sidebar (simplified) */}
            <div className="w-48 bg-gray-50 border-l border-gray-300 p-3">
              <div className="text-xs text-gray-600 space-y-2">
                <div className="font-semibold text-black">{article.title}</div>
                <div className="border-t border-gray-300 pt-2">
                  {article.lastModified && (
                    <div>Last edited: {article.lastModified}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        {/* Wikipedia footer */}
        <div className="border-t border-gray-300 bg-gray-50 p-4 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>This page was last edited on {article.lastModified || 'recently'}</span>
            <span>Text is available under the Creative Commons Attribution-ShareAlike License</span>
          </div>
        </div>
        <div className="p-2 text-center text-gray-500 text-xs">
          Content from Wikipedia is licensed under CC BY-SA 4.0. This project is not affiliated with Wikipedia or the Wikimedia Foundation.
        </div>
      </div>
        
        {!isRevealed && (
          <div className="absolute bottom-4 right-4">
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20 text-primary"
            >
              {getBadgeText()}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};