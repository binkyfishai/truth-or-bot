import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Settings, Play, Zap, Clock, BarChart3, Cpu, Shield, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface GameConfig {
  rounds: number;
  timePerRound: number;
  aiModel: string;
  difficulty: string;
}

interface GameSettingsProps {
  onStartGame: (config: GameConfig) => void;
  isLoading?: boolean;
}

export const GameSettings = ({ onStartGame, isLoading }: GameSettingsProps) => {
  const [config, setConfig] = useState<GameConfig>({
    rounds: 5,
    timePerRound: 30,
    aiModel: "moonshotai/kimi-k2-instruct",
    difficulty: "medium"
  });

  const handleStart = () => {
    onStartGame(config);
  };

  // Get difficulty badge color
  const getDifficultyColor = () => {
    switch (config.difficulty) {
      case "easy": return "text-green-400 bg-green-500/10 border-green-500/50";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/50";
      case "hard": return "text-red-400 bg-red-500/10 border-red-500/50";
      default: return "text-green-400 bg-green-500/10 border-green-500/50";
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = () => {
    switch (config.difficulty) {
      case "easy": return <Shield className="w-3 h-3 mr-1" />;
      case "medium": return <Shield className="w-3 h-3 mr-1" />;
      case "hard": return <Shield className="w-3 h-3 mr-1" />;
      default: return <Shield className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 bg-gray-900/70 border border-gray-700 backdrop-blur-md rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <Settings className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Training Configuration</h2>
        </div>
        <Badge variant="outline" className={`${getDifficultyColor()}`}>
          {getDifficultyIcon()}
          {config.difficulty === "easy" ? "Beginner" : 
           config.difficulty === "medium" ? "Intermediate" : "Advanced"}
        </Badge>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="rounds" className="flex items-center text-gray-300">
            <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
            Number of Rounds
          </Label>
          <Select 
            value={config.rounds.toString()} 
            onValueChange={(value) => setConfig({...config, rounds: parseInt(value)})}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="3">3 Rounds</SelectItem>
              <SelectItem value="5">5 Rounds</SelectItem>
              <SelectItem value="10">10 Rounds</SelectItem>
              <SelectItem value="15">15 Rounds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-green-400" />
            Time per Round
          </Label>
          <Select 
            value={config.timePerRound.toString()} 
            onValueChange={(value) => setConfig({...config, timePerRound: parseInt(value)})}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="45">45 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-model" className="flex items-center text-gray-300">
            <Cpu className="w-4 h-4 mr-2 text-green-400" />
            AI Model
          </Label>
          <Select 
            value={config.aiModel} 
            onValueChange={(value) => setConfig({...config, aiModel: value})}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="moonshotai/kimi-k2-instruct">Kimi K2 Instruct (Best)</SelectItem>
              <SelectItem value="llama3-8b-8192">Llama 3 8B (Fast)</SelectItem>
              <SelectItem value="llama3-70b-8192">Llama 3 70B (Powerful)</SelectItem>
              <SelectItem value="gemma-7b-it">Gemma 7B (Balanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty" className="flex items-center text-gray-300">
            <Shield className="w-4 h-4 mr-2 text-green-400" />
            Difficulty Level
          </Label>
          <Select 
            value={config.difficulty} 
            onValueChange={(value) => setConfig({...config, difficulty: value})}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="easy">Easy (Obvious differences)</SelectItem>
              <SelectItem value="medium">Medium (Subtle differences)</SelectItem>
              <SelectItem value="hard">Hard (Very convincing AI)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
          <Button 
            size="lg" 
            onClick={handleStart} 
            disabled={isLoading}
            className="relative w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold transform hover:translate-y-[-2px] transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Preparing Training...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Play Now
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};