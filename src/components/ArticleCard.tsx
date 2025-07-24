import { Button } from "@/components/ui/button";
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
  const getVariant = () => {
    if (!isRevealed) return "choice";
    return article.isReal ? "correct" : "incorrect";
  };

  const getIcon = () => {
    if (!isRevealed) return null;
    return article.isReal ? <Globe className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />;
  };

  const getBadgeText = () => {
    if (!isRevealed) return "Choose This Article";
    return article.isReal ? "Real Wikipedia" : "AI Generated";
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Button
        variant={getVariant()}
        size="choice"
        onClick={onSelect}
        disabled={disabled}
        className={`w-full h-full flex flex-col items-start justify-start text-left relative ${
          isSelected && !isRevealed ? 'ring-2 ring-wiki-blue shadow-lg' : ''
        }`}
      >
        {isRevealed && (
          <Badge 
            variant={article.isReal ? "default" : "secondary"} 
            className={`absolute top-4 right-4 flex items-center gap-2 ${
              article.isReal ? 'bg-correct text-white' : 'bg-incorrect text-white'
            }`}
          >
            {getIcon()}
            {getBadgeText()}
          </Badge>
        )}
        
        <div className="space-y-4 w-full pr-32">
          <h3 className="text-xl font-bold text-card-foreground leading-tight">
            {article.title}
          </h3>
          
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            {article.content.split('\n').slice(0, 8).map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-justify">
                  {paragraph}
                </p>
              )
            ))}
            {article.content.split('\n').length > 8 && (
              <p className="text-muted-foreground italic">...</p>
            )}
          </div>
          
          {article.source && (
            <div className="text-xs text-muted-foreground border-t pt-3 mt-4">
              <p>Source: {article.source}</p>
              {article.lastModified && (
                <p>Last modified: {article.lastModified}</p>
              )}
            </div>
          )}
        </div>
        
        {!isRevealed && (
          <Badge variant="outline" className="absolute bottom-4 right-4">
            {getBadgeText()}
          </Badge>
        )}
      </Button>
    </Card>
  );
};