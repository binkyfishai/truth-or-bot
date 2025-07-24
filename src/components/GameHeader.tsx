import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, Shield, Eye } from "lucide-react";

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
    <div className="bg-black/90 backdrop-blur-md border-2 border-green-500/30 p-4 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <Eye className="w-3 h-3 text-red-400 animate-pulse" />
          </div>
          <Badge variant="outline" className="border-green-500/50 text-green-300 bg-black/50 font-mono">
            <Target className="w-3 h-3 mr-1" />
            ROUND_{round:02d}/{totalRounds:02d}
          </Badge>
          <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-black/50 font-mono">
            <Trophy className="w-3 h-3 mr-1" />
            SCORE_{score:04d}
          </Badge>
        </div>
        
        <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-green-300'}`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono text-lg font-bold tracking-wider">
            {timeLeft:02d}s
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-green-400 uppercase tracking-wide">
          <span>&gt; TIME_ELAPSED</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-black border border-green-500/30 h-2">
          <div 
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-red-500 animate-pulse' : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};