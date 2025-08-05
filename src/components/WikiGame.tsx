import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, Globe, Search, ChevronRight, Zap, RotateCcw, Clock, X,
  Shield, Eye, Brain, AlertTriangle, Trophy, BarChart3, Target,
  CheckCircle, Timer, Home, XCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ArticleCard, Article } from "./ArticleCard";
import { GameHeader } from "./GameHeader";
import { GameSettings, GameConfig } from "./GameSettings";
import { wikipediaService } from "@/services/wikipediaService";
import { aiService } from "@/services/aiService";

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
  const [animateIn, setAnimateIn] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    totalTime: 0,
    averageTime: 0
  });

  // Animation effect
  useEffect(() => {
    setAnimateIn(true);
  }, []);

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

  const handleStartGame = async (config: GameConfig) => {
    setConfig(config);
    setCurrentRound(1);
    setScore(0);
    setGameStats({
      score: 0,
      correctAnswers: 0,
      totalTime: 0,
      averageTime: 0
    });
    await loadNewRound(config);
  };

  // Load a new round of the game
  const loadNewRound = async (gameConfig: GameConfig) => {
    setIsLoading(true);
    setGameState("playing");
    setTimeLeft(gameConfig.timePerRound);
    setSelectedArticle(null);
    setAnimateIn(false);

    try {
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Debugging: Log which API endpoint we're using
      const apiUrl = `/api/content?t=${timestamp}`;
      console.log(`ENDPOINT DEBUG: Using API endpoint ${apiUrl}`);
      
      console.log(`Loading new round - Round ${currentRound}, Difficulty: ${gameConfig.difficulty}, Model: ${gameConfig.aiModel}, Timestamp: ${timestamp}`);
      
      // Use relative URL that works in any environment (localhost or web deployment)
      // Also renamed from 'game' to 'content' to avoid ad blockers
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          model: gameConfig.aiModel,
          difficulty: gameConfig.difficulty,
          timestamp: timestamp // Add timestamp to the request body too
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Check if this is a fallback response
      if (data.fallback) {
        toast({
          title: "Using Fallback Content",
          description: "We're experiencing some issues with our AI service. Using simplified game content.",
          variant: "default"
        });
      }
      
      console.log(`Received articles - Real: "${data.articles[data.realArticleIndex].title}", Fake: "${data.articles[1-data.realArticleIndex].title}"`);
      console.log(`Full data from server:`, JSON.stringify(data, null, 2));
      
      // Ensure both articles have the exact same title
      const sharedTitle = data.articles[data.realArticleIndex].title;
      data.articles.forEach(article => {
        article.title = sharedTitle;
      });
      
      console.log(`Real article index from server: ${data.realArticleIndex}`);
      console.log(`Articles array length: ${data.articles.length}`);
      console.log(`Article 0 title: "${data.articles[0].title}", isAI: ${data.articles[0].isAI}`);
      console.log(`Article 1 title: "${data.articles[1].title}", isAI: ${data.articles[1].isAI}`);
      
      setArticles(data.articles as [Article, Article]);

      setTimeout(() => {
        setAnimateIn(true);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading new round:", error);
      toast({
        title: "Error",
        description: "Failed to load game content. Please try again.",
        variant: "destructive"
      });
      setGameState("settings");
      setIsLoading(false);
    }
  };

  const handleArticleSelect = (article: Article) => {
    if (gameState !== "playing" || !articles) return;
    
    setSelectedArticle(article);
    setGameState("revealing");
    
    // Calculate score based on time left and difficulty
    const timeBonus = timeLeft * 10;
    const difficultyMultiplier = 
      config?.difficulty === "easy" ? 1 :
      config?.difficulty === "medium" ? 1.5 : 2;
    
    const baseScore = 500;
    const roundScore = Math.floor((baseScore + timeBonus) * difficultyMultiplier);
    
    // Find the real article
    const realArticleIndex = articles.findIndex(a => !a.isAI);
    const selectedCorrectly = article === articles[realArticleIndex];
    
    // Update game stats
    const newTotalTime = gameStats.totalTime + (config?.timePerRound || 30) - timeLeft;
    const newCorrectAnswers = gameStats.correctAnswers + (selectedCorrectly ? 1 : 0);
    const newScore = gameStats.score + (selectedCorrectly ? roundScore : 0);
    
    setGameStats({
      score: newScore,
      correctAnswers: newCorrectAnswers,
      totalTime: newTotalTime,
      averageTime: Math.round(newTotalTime / currentRound)
    });
    
    if (selectedCorrectly) {
      setScore(score + roundScore);
      toast({
        title: "Correct!",
        description: `You earned ${roundScore} points.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect",
        description: "That was the AI-generated article.",
        variant: "destructive"
      });
    }
    
    // After 3 seconds, either load next round or end game
    setTimeout(() => {
      if (currentRound < (config?.rounds || 5)) {
        setCurrentRound(currentRound + 1);
        loadNewRound(config!);
      } else {
        setGameState("gameOver");
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    if (!articles) return;
    
    toast({
      title: "Time's up!",
      description: "You ran out of time.",
      variant: "destructive"
    });
    
    setGameState("revealing");
    
    // Find the real article for revealing
    const realArticleIndex = articles.findIndex(a => !a.isAI);
    
    // Update game stats
    const newTotalTime = gameStats.totalTime + (config?.timePerRound || 30);
    
    setGameStats({
      ...gameStats,
      totalTime: newTotalTime,
      averageTime: Math.round(newTotalTime / currentRound)
    });
    
    // After 3 seconds, either load next round or end game
    setTimeout(() => {
      if (currentRound < (config?.rounds || 5)) {
        setCurrentRound(currentRound + 1);
        loadNewRound(config!);
      } else {
        setGameState("gameOver");
      }
    }, 3000);
  };

  const resetGame = () => {
    setGameState("settings");
    setCurrentRound(1);
    setScore(0);
    setTimeLeft(30);
    setArticles(null);
    setSelectedArticle(null);
    setGameStats({
      score: 0,
      correctAnswers: 0,
      totalTime: 0,
      averageTime: 0
    });
  };

  if (gameState === "settings") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.05)_100%)]"></div>
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        </div>
        
        <div className={`text-center space-y-8 relative z-10 max-w-2xl mx-auto transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-4">
            <div className="relative inline-block mb-4 animate-float">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
              <Shield className="w-16 h-16 text-green-400 mx-auto opacity-90" />
              <Eye className="w-5 h-5 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Truth or Deception?
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Test your ability to distinguish between authentic Wikipedia articles and AI-generated deception. 
              Score points for correct assessments and quick thinking!
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10 px-3 py-1">
                <Brain className="w-4 h-4 mr-2" />
                Cognitive Security Training
              </Badge>
              <Badge variant="outline" className="border-red-500/50 text-red-300 bg-red-500/10 px-3 py-1">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Deception Detection
              </Badge>
            </div>
          </div>
          
          <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6 backdrop-blur-sm shadow-xl">
            <GameSettings onStartGame={handleStartGame} isLoading={isLoading} />
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    const accuracy = Math.round((gameStats.correctAnswers / config!.rounds) * 100);
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.05)_100%)]"></div>
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        </div>
        
        <Card className={`max-w-lg mx-auto p-8 bg-gray-900/70 border border-gray-700 text-center rounded-xl shadow-xl backdrop-blur-sm transition-all duration-1000 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            <Trophy className="w-16 h-16 mx-auto text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-6 text-white">Training Complete</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-green-500/30 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 mr-2 opacity-70" />
                  {gameStats.score}
                </div>
                <div className="text-sm text-gray-300">Total Score</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-green-500/30 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center">
                  <Target className="w-5 h-5 mr-2 opacity-70" />
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-300">Accuracy</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-lg font-semibold text-purple-400 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2 opacity-70" />
                  {gameStats.correctAnswers}/{config!.rounds}
                </div>
                <div className="text-sm text-gray-300">Correct Assessments</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-cyan-500/30 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-lg font-semibold text-cyan-400 flex items-center justify-center">
                  <Timer className="w-5 h-5 mr-2 opacity-70" />
                  {Math.round(gameStats.averageTime)}s
                </div>
                <div className="text-sm text-gray-300">Avg Response Time</div>
              </div>
            </div>
            
            <div className={`w-full p-4 text-sm border rounded-lg transition-all duration-500 ${
              accuracy >= 80 ? 'border-green-500 text-green-400 bg-green-500/10' : 
              accuracy >= 60 ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 
              accuracy >= 40 ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 
              'border-red-500 text-red-400 bg-red-500/10'
            }`}>
              <div className="font-bold mb-1">
                {accuracy >= 80 ? "Expert Level Detection" : 
                 accuracy >= 60 ? "Good Detection Skills" : 
                 accuracy >= 40 ? "Needs More Practice" : 
                 "Beginner Level"}
              </div>
              <p>
                {accuracy >= 80 ? "You have exceptional ability to identify AI-generated content." : 
                 accuracy >= 60 ? "You can identify most AI-generated content but still have room to improve." : 
                 accuracy >= 40 ? "You're developing your detection skills but need more practice." : 
                 "You're just beginning to develop your detection abilities."}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <div className="relative inline-block flex-1 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <Button 
                onClick={resetGame} 
                className="relative w-full bg-green-600 hover:bg-green-700 text-white border border-green-600 transform hover:translate-y-[-2px] transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Train Again
              </Button>
            </div>
            <Button 
              onClick={resetGame}
              className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-6 transform hover:translate-y-[-2px] transition-all duration-300"
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
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.05)_100%)]"></div>
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        </div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto animate-spin"></div>
          <div className="text-white">
            <p className="text-lg font-semibold">Preparing Challenge</p>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pt-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.03)_100%)]"></div>
        <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl space-y-6 relative z-10">
        <GameHeader
          timeLeft={timeLeft}
          totalTime={config.timePerRound}
          score={score}
          round={currentRound}
          totalRounds={config.rounds}
        />
        
        <div className={`text-center space-y-2 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center justify-center mb-2">
            <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-green-400"></div>
            <h2 className="text-2xl font-bold text-white px-4">Identify the Authentic Article</h2>
            <div className="h-0.5 w-8 bg-gradient-to-r from-green-400 to-transparent"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            One article is authentic from Wikipedia, the other is AI-generated deception. Choose wisely!
          </p>
        </div>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto transition-all duration-1000 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            <div className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-gray-300">
                {currentRound < config.rounds 
                  ? `Round ${currentRound + 1} starts in a few seconds...`
                  : "Calculating final score..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};