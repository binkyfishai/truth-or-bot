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
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10">
            <Target className="w-4 h-4 mr-2" />
            Round {round}/{totalRounds}
          </Badge>
          <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
            <Trophy className="w-4 h-4 mr-2" />
            Score: {score}
          </Badge>
        </div>
        
        <div className={`flex items-center gap-2 text-lg font-semibold ${
          isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
        }`}>
          <Clock className="w-5 h-5" />
          <span>{timeLeft}s</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Time Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isUrgent ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};