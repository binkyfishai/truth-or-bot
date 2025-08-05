import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, Shield, Eye, Zap, BarChart3 } from "lucide-react";

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
    <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:border-gray-600">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10 px-3 py-1.5 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>Round</span>
            <span className="ml-1 font-bold">{round}/{totalRounds}</span>
          </Badge>
          
          <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10 px-3 py-1.5 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            <span>Score</span>
            <span className="ml-1 font-bold">{score}</span>
          </Badge>
        </div>
        
        <div className={`flex items-center gap-2 text-lg font-semibold px-4 py-1.5 rounded-full ${
          isUrgent 
            ? 'text-red-400 bg-red-500/10 border border-red-500/30 animate-pulse' 
            : 'text-white bg-gray-800/50 border border-gray-700'
        }`}>
          <Clock className={`w-5 h-5 ${isUrgent ? 'animate-ping opacity-70' : ''}`} />
          <span>{timeLeft}s</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center">
            <Zap className="w-3 h-3 mr-1 text-green-400" />
            Time Remaining
          </span>
          <span className="flex items-center">
            <BarChart3 className="w-3 h-3 mr-1 text-green-400" />
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-800/70 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ${
              isUrgent 
                ? 'bg-gradient-to-r from-red-500 to-red-400 animate-pulse' 
                : 'bg-gradient-to-r from-green-500 to-green-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};