import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe } from "lucide-react";

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
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-card border border-border">
      <div
        onClick={disabled ? undefined : onSelect}
        className={`w-full h-full relative p-6 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-card/80'
        } ${
          isSelected && !isRevealed ? 'ring-2 ring-wiki-blue shadow-lg' : ''
        }`}
      >
        {isRevealed && (
          <Badge 
            variant={article.isReal ? "default" : "secondary"} 
            className={`absolute top-4 right-4 flex items-center gap-2 z-10 ${
              article.isReal ? 'bg-correct text-white' : 'bg-incorrect text-white'
            }`}
          >
            {getIcon()}
            {getBadgeText()}
          </Badge>
        )}
        
        {/* Wikipedia-style page */}
        <div className="bg-background min-h-[500px] border border-border rounded-sm shadow-sm">
          {/* Wikipedia header */}
          <div className="bg-muted/30 border-b border-border p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Wikipedia</span>
              <span>From Wikipedia, the free encyclopedia</span>
            </div>
          </div>
          
          {/* Article content */}
          <div className="p-6">
            {/* Article title */}
            <h1 className="text-3xl font-serif text-foreground font-normal leading-tight mb-4 border-b border-border pb-2">
              {article.title}
            </h1>
            
            {/* Article body */}
            <div className="space-y-4 text-foreground">
              {article.content.split('\n').slice(0, 6).map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-sm leading-relaxed text-justify">
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
              {article.content.split('\n').length > 6 && (
                <p className="text-muted-foreground italic text-sm">...</p>
              )}
            </div>
            
            {/* Wikipedia-style footer */}
            {article.source && (
              <div className="text-xs text-muted-foreground border-t border-border pt-3 mt-6">
                <div className="flex items-center justify-between">
                  <span>Source: {article.source}</span>
                  {article.lastModified && (
                    <span>Last modified: {article.lastModified}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isRevealed && (
          <div className="absolute bottom-4 right-4">
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-wiki-blue text-wiki-blue">
              {getBadgeText()}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};