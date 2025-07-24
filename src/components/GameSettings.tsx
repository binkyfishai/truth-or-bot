import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Settings, Play } from "lucide-react";

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
    aiModel: "gpt-4.1-2025-04-14",
    difficulty: "medium"
  });

  const handleStart = () => {
    onStartGame(config);
  };

  return (
    <Card className="max-w-md mx-auto p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-wiki-blue" />
        <h2 className="text-xl font-bold">Game Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rounds">Number of Rounds</Label>
          <Select 
            value={config.rounds.toString()} 
            onValueChange={(value) => setConfig({...config, rounds: parseInt(value)})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Rounds</SelectItem>
              <SelectItem value="5">5 Rounds</SelectItem>
              <SelectItem value="10">10 Rounds</SelectItem>
              <SelectItem value="15">15 Rounds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time per Round (seconds)</Label>
          <Select 
            value={config.timePerRound.toString()} 
            onValueChange={(value) => setConfig({...config, timePerRound: parseInt(value)})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="45">45 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-model">AI Model</Label>
          <Select 
            value={config.aiModel} 
            onValueChange={(value) => setConfig({...config, aiModel: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Latest)</SelectItem>
              <SelectItem value="o4-mini-2025-04-16">O4 Mini (Fast)</SelectItem>
              <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
              <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select 
            value={config.difficulty} 
            onValueChange={(value) => setConfig({...config, difficulty: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy (Obvious differences)</SelectItem>
              <SelectItem value="medium">Medium (Subtle differences)</SelectItem>
              <SelectItem value="hard">Hard (Very convincing AI)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="wiki" 
          size="lg" 
          onClick={handleStart} 
          disabled={isLoading}
          className="w-full mt-6"
        >
          <Play className="w-4 h-4" />
          {isLoading ? "Loading..." : "Start Game"}
        </Button>
      </div>
    </Card>
  );
};