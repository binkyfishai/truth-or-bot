import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Medal, 
  User, 
  BarChart3, 
  Clock, 
  Target,
  ArrowUpDown,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Define the type for a leaderboard entry
interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  accuracy: number;
  gamesPlayed: number;
  averageTime: number;
  lastPlayed: string;
}

// Sample data for demonstration purposes
const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    username: "CognitiveDefender",
    score: 2850,
    accuracy: 92,
    gamesPlayed: 37,
    averageTime: 18,
    lastPlayed: "2024-05-15"
  },
  {
    id: "2",
    rank: 2,
    username: "TruthSeeker42",
    score: 2340,
    accuracy: 88,
    gamesPlayed: 29,
    averageTime: 22,
    lastPlayed: "2024-05-14"
  },
  {
    id: "3",
    rank: 3,
    username: "AIDetector",
    score: 2120,
    accuracy: 85,
    gamesPlayed: 25,
    averageTime: 19,
    lastPlayed: "2024-05-16"
  },
  {
    id: "4",
    rank: 4,
    username: "FactChecker",
    score: 1980,
    accuracy: 82,
    gamesPlayed: 31,
    averageTime: 24,
    lastPlayed: "2024-05-13"
  },
  {
    id: "5",
    rank: 5,
    username: "CyberSleuth",
    score: 1820,
    accuracy: 79,
    gamesPlayed: 22,
    averageTime: 21,
    lastPlayed: "2024-05-16"
  },
  {
    id: "6",
    rank: 6,
    username: "DigitalDetective",
    score: 1760,
    accuracy: 77,
    gamesPlayed: 20,
    averageTime: 23,
    lastPlayed: "2024-05-15"
  },
  {
    id: "7",
    rank: 7,
    username: "InfoGuardian",
    score: 1650,
    accuracy: 75,
    gamesPlayed: 18,
    averageTime: 25,
    lastPlayed: "2024-05-14"
  },
  {
    id: "8",
    rank: 8,
    username: "PatternSpotter",
    score: 1540,
    accuracy: 72,
    gamesPlayed: 21,
    averageTime: 26,
    lastPlayed: "2024-05-13"
  },
  {
    id: "9",
    rank: 9,
    username: "CogSecExpert",
    score: 1480,
    accuracy: 70,
    gamesPlayed: 19,
    averageTime: 28,
    lastPlayed: "2024-05-12"
  },
  {
    id: "10",
    rank: 10,
    username: "DeceptionAnalyst",
    score: 1350,
    accuracy: 68,
    gamesPlayed: 17,
    averageTime: 27,
    lastPlayed: "2024-05-11"
  }
];

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(sampleLeaderboardData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "accuracy" | "gamesPlayed" | "averageTime">("score");
  const [timeFrame, setTimeFrame] = useState<"all" | "week" | "month" | "year">("all");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch leaderboard data from API
  // In a real implementation, this would call your backend API
  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, replace this with an actual API call
      // const response = await fetch(`/api/leaderboard?timeFrame=${timeFrame}&sortBy=${sortBy}`);
      // const data = await response.json();
      // setLeaderboardData(data);
      
      // For now, we'll just simulate an API call with our sample data
      setTimeout(() => {
        let sortedData = [...sampleLeaderboardData];
        
        // Apply sorting
        sortedData.sort((a, b) => b[sortBy] - a[sortBy]);
        
        // Apply search filter if present
        if (searchQuery) {
          sortedData = sortedData.filter(entry => 
            entry.username.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setLeaderboardData(sortedData);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setIsLoading(false);
    }
  };

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchLeaderboardData();
  }, [sortBy, timeFrame, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Top performers in cognitive security training. Can you make it to the top?
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search by username" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-40">
                <Select 
                  value={sortBy} 
                  onValueChange={(value: string) => setSortBy(value as "score" | "accuracy" | "gamesPlayed" | "averageTime")}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
                    <div className="flex items-center">
                      <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="gamesPlayed">Games Played</SelectItem>
                    <SelectItem value="averageTime">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select 
                  value={timeFrame} 
                  onValueChange={(value: string) => setTimeFrame(value as "all" | "week" | "month" | "year")}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500/30 focus:border-green-500/50">
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Time</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-900/70 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 p-4 border-b border-gray-700 bg-gray-800/50 text-sm font-semibold text-gray-300">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3 md:col-span-3">Player</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center hidden md:block">Accuracy</div>
            <div className="col-span-2 text-center hidden md:block">Games</div>
            <div className="col-span-2 text-center hidden md:block">Avg Time</div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400">Loading leaderboard data...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && leaderboardData.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No results found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Leaderboard Entries */}
          {!isLoading && leaderboardData.map((entry) => (
            <div 
              key={entry.id} 
              className={`grid grid-cols-12 gap-2 p-4 border-b border-gray-700 hover:bg-gray-800/30 transition-colors ${
                entry.rank <= 3 ? 'bg-gray-800/20' : ''
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center items-center">
                {entry.rank === 1 && <Medal className="w-6 h-6 text-yellow-400" />}
                {entry.rank === 2 && <Medal className="w-6 h-6 text-gray-300" />}
                {entry.rank === 3 && <Medal className="w-6 h-6 text-amber-600" />}
                {entry.rank > 3 && <span className="text-gray-400 font-mono">{entry.rank}</span>}
              </div>
              
              {/* Username */}
              <div className="col-span-3 md:col-span-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <span className="font-medium text-white truncate">{entry.username}</span>
              </div>
              
              {/* Score */}
              <div className="col-span-2 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-green-400 mr-2 hidden sm:block" />
                <span className="font-bold text-green-400">{entry.score.toLocaleString()}</span>
              </div>
              
              {/* Accuracy */}
              <div className="col-span-2 flex items-center justify-center hidden md:flex">
                <Target className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-400">{entry.accuracy}%</span>
              </div>
              
              {/* Games Played */}
              <div className="col-span-2 flex items-center justify-center hidden md:flex">
                <Trophy className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-purple-400">{entry.gamesPlayed}</span>
              </div>
              
              {/* Average Time */}
              <div className="col-span-2 flex items-center justify-center hidden md:flex">
                <Clock className="w-4 h-4 text-orange-400 mr-2" />
                <span className="text-orange-400">{entry.averageTime}s</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Simplified for now */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              2
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              3
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 