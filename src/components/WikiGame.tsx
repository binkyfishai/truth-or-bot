import { useState, useEffect } from "react";
import { GameHeader } from "./GameHeader";
import { ArticleCard, Article } from "./ArticleCard";
import { GameSettings, GameConfig } from "./GameSettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WikipediaService } from "@/services/wikipediaService";
import { AIService } from "@/services/aiService";
import { Trophy, RotateCcw, Home } from "lucide-react";

type GameState = "settings" | "playing" | "revealing" | "gameOver";

interface GameStats {
  score: number;
  correctAnswers: number;
  totalTime: number;
  averageTime: number;
}

export const WikiGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("settings");
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [articles, setArticles] = useState<[Article, Article] | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    totalTime: 0,
    averageTime: 0
  });

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      handleTimeUp();
    }
  }, [gameState, timeLeft]);

  const handleStartGame = async (gameConfig: GameConfig) => {
    setConfig(gameConfig);
    setCurrentRound(1);
    setScore(0);
    setGameStats({
      score: 0,
      correctAnswers: 0,
      totalTime: 0,
      averageTime: 0
    });
    await loadNewRound(gameConfig);
  };

  const loadNewRound = async (gameConfig: GameConfig) => {
    setIsLoading(true);
    setGameState("playing");
    setTimeLeft(gameConfig.timePerRound);
    setSelectedArticle(null);

    try {
      // Get a real Wikipedia article
      const realArticle = await WikipediaService.getRandomArticle();
      
      // Generate a fake article
      const fakeArticle = await AIService.generateFakeArticle(realArticle, {
        model: gameConfig.aiModel,
        difficulty: gameConfig.difficulty
      });

      // Randomly decide which article goes on which side
      const articlesArray: [Article, Article] = Math.random() > 0.5 
        ? [realArticle, fakeArticle] 
        : [fakeArticle, realArticle];

      setArticles(articlesArray);
    } catch (error) {
      console.error("Error loading round:", error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleSelect = (article: Article) => {
    if (gameState !== "playing" || !articles) return;
    
    setSelectedArticle(article);
    setGameState("revealing");

    // Calculate score based on correctness and time
    const timeBonus = Math.max(0, timeLeft);
    const correctnessPoints = article.isReal ? 100 : 0;
    const roundScore = correctnessPoints + timeBonus;
    
    setScore(prev => prev + roundScore);
    setGameStats(prev => ({
      score: prev.score + roundScore,
      correctAnswers: prev.correctAnswers + (article.isReal ? 1 : 0),
      totalTime: prev.totalTime + (config!.timePerRound - timeLeft),
      averageTime: (prev.totalTime + (config!.timePerRound - timeLeft)) / currentRound
    }));

    // Show result toast
    toast({
      title: article.isReal ? "Correct!" : "Incorrect!",
      description: article.isReal 
        ? `You got ${roundScore} points! (+${timeBonus} time bonus)`
        : `The real article was the other one. +0 points`,
      variant: article.isReal ? "default" : "destructive"
    });

    // Continue to next round after a delay
    setTimeout(() => {
      if (currentRound < config!.rounds) {
        setCurrentRound(prev => prev + 1);
        loadNewRound(config!);
      } else {
        setGameState("gameOver");
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    if (!articles) return;
    
    // Automatically select a random article when time runs out
    const randomArticle = articles[Math.floor(Math.random() * 2)];
    handleArticleSelect(randomArticle);
  };

  const resetGame = () => {
    setGameState("settings");
    setCurrentRound(1);
    setScore(0);
    setArticles(null);
    setSelectedArticle(null);
    setConfig(null);
  };

  if (gameState === "settings") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Wiki or AI?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Test your ability to distinguish between real Wikipedia articles and AI-generated fakes. 
              Score points for correct answers and quick thinking!
            </p>
          </div>
          <GameSettings onStartGame={handleStartGame} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    const accuracy = Math.round((gameStats.correctAnswers / config!.rounds) * 100);
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <Card className="max-w-lg mx-auto p-8 bg-black/90 border-2 border-green-500/50 text-center">
          <div className="text-green-400 text-sm mb-4">[MISSION_COMPLETE]</div>
          <Trophy className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold mb-6 text-green-300 uppercase tracking-wide">ASSESSMENT_RESULTS</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/60 border border-green-500/30 p-4">
                <div className="text-2xl font-bold text-green-400">{gameStats.score:04d}</div>
                <div className="text-xs text-green-200 uppercase tracking-wide">TOTAL_SCORE</div>
              </div>
              <div className="bg-black/60 border border-green-500/30 p-4">
                <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                <div className="text-xs text-green-200 uppercase tracking-wide">ACCURACY_RATE</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/60 border border-purple-500/30 p-4">
                <div className="text-lg font-semibold text-purple-400">{gameStats.correctAnswers:02d}/{config!.rounds:02d}</div>
                <div className="text-xs text-purple-200 uppercase tracking-wide">THREATS_DETECTED</div>
              </div>
              <div className="bg-black/60 border border-cyan-500/30 p-4">
                <div className="text-lg font-semibold text-cyan-400">{Math.round(gameStats.averageTime):02d}s</div>
                <div className="text-xs text-cyan-200 uppercase tracking-wide">AVG_RESPONSE_TIME</div>
              </div>
            </div>
            
            <Badge variant="outline" className={`w-full p-3 font-mono text-sm border-2 ${
              accuracy >= 80 ? 'border-green-500 text-green-400 bg-green-500/10' : 
              accuracy >= 60 ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 
              accuracy >= 40 ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 
              'border-red-500 text-red-400 bg-red-500/10'
            }`}>
              {accuracy >= 80 ? ">> COGNITIVE_SECURITY_EXPERT <<" : 
               accuracy >= 60 ? ">> ADEQUATE_THREAT_DETECTION <<" : 
               accuracy >= 40 ? ">> REQUIRES_ADDITIONAL_TRAINING <<" : 
               ">> CRITICAL_VULNERABILITY_DETECTED <<"}
            </Badge>
          </div>
          
          <div className="flex gap-3 mt-8">
            <Button 
              onClick={resetGame} 
              className="flex-1 bg-black border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono uppercase"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              REINITIALIZE
            </Button>
            <Button 
              onClick={resetGame}
              className="bg-black border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-mono uppercase px-6"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!articles || !config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-green-400 text-sm">
            <div>&gt; INITIALIZING_COGNITIVE_SECURITY_PROTOCOL</div>
            <div className="mt-2 text-green-300 animate-pulse">&gt; LOADING_DATA_SOURCES...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <GameHeader
          timeLeft={timeLeft}
          totalTime={config.timePerRound}
          score={score}
          round={currentRound}
          totalRounds={config.rounds}
        />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Which article is from Wikipedia?</h2>
          <p className="text-muted-foreground">
            One of these articles is real, the other is AI-generated. Choose wisely!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              article={article}
              onSelect={() => handleArticleSelect(article)}
              isSelected={selectedArticle === article}
              isRevealed={gameState === "revealing"}
              disabled={gameState !== "playing"}
            />
          ))}
        </div>
        
        {gameState === "revealing" && (
          <div className="text-center">
            <p className="text-muted-foreground">
              {currentRound < config.rounds 
                ? `Round ${currentRound + 1} starts in a few seconds...`
                : "Calculating final score..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};