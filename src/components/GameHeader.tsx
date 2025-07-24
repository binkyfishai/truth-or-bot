import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target } from "lucide-react";

interface GameHeaderProps {
  timeLeft: number;
  totalTime: number;
  score: number;
  round: number;
  totalRounds: number;
}

export const GameHeader = ({ timeLeft, totalTime, score, round, totalRounds }: GameHeaderProps) => {
  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="bg-card/70 backdrop-blur-md shadow-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Round {round}/{totalRounds}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Score: {score}
          </Badge>
        </div>
        
        <div className={`flex items-center gap-2 ${isUrgent ? 'text-timer animate-pulse' : 'text-muted-foreground'}`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono text-lg font-semibold">
            {timeLeft}s
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Time Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className={`h-2 ${isUrgent ? 'progress-urgent' : ''}`}
        />
      </div>
    </div>
  );
};