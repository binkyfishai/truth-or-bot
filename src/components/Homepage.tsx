import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WikiGame } from "@/components/WikiGame";
import { 
  Brain, 
  Globe, 
  Sparkles, 
  Target, 
  Trophy, 
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Zap
} from "lucide-react";

const Homepage = () => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <WikiGame />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          {/* Logo/Title */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Globe className="w-12 h-12 text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
              <Sparkles className="w-6 h-6 text-purple-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                WikiBot
              </h1>
              <p className="text-blue-300 text-lg font-medium tracking-wider">Truth or AI</p>
            </div>
          </div>

          {/* Subtitle */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
              Can you tell the difference between 
              <span className="text-green-400"> real Wikipedia </span>
              and 
              <span className="text-red-400"> AI-generated </span>
              articles?
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Test your skills in the ultimate battle between human knowledge and artificial intelligence. 
              Challenge yourself to identify authentic Wikipedia articles from convincing AI fakes.
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => setShowGame(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 group"
          >
            Start Challenge
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Detection</h3>
              <p className="text-gray-400">
                Put your critical thinking skills to the test against increasingly sophisticated AI-generated content.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Multiple Difficulties</h3>
              <p className="text-gray-400">
                Choose from easy, medium, or hard modes. Each level presents more convincing AI-generated fakes.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Score & Compete</h3>
              <p className="text-gray-400">
                Earn points for correct answers and quick thinking. Track your accuracy and improve over time.
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            How It Works
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold text-white">Choose Settings</h4>
              <p className="text-gray-400 text-sm">Select your difficulty level and number of rounds</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold text-white">Read Articles</h4>
              <p className="text-gray-400 text-sm">Study two articles side by side</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold text-white">Make Choice</h4>
              <p className="text-gray-400 text-sm">Pick which one is the real Wikipedia article</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <h4 className="font-semibold text-white">Get Results</h4>
              <p className="text-gray-400 text-sm">See your score and learn from mistakes</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">50k+</div>
              <div className="text-gray-400 text-sm">Challenges Taken</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">73%</div>
              <div className="text-gray-400 text-sm">Average Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-gray-400 text-sm">AI Models</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-400">∞</div>
              <div className="text-gray-400 text-sm">Wikipedia Articles</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-8">
            <p className="text-gray-400 mb-6">Ready to test your skills against AI?</p>
            <Button 
              onClick={() => setShowGame(true)}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 group"
            >
              <Zap className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Begin Challenge
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-6 text-gray-400">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                <Globe className="w-4 h-4 mr-2" />
                Real Wikipedia Data
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Fakes
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                Timed Challenges
              </Badge>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 WikiBot. Challenge your perception of digital truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
