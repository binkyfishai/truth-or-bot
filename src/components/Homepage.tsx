import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WikiGame } from "@/components/WikiGame";
import { Navigation } from "@/components/Navigation";
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
  Zap,
  Shield,
  Eye,
  Cpu,
  Terminal
} from "lucide-react";

const Homepage = () => {
  const [showGame, setShowGame] = useState(false);

  const handleBackToHome = () => {
    setShowGame(false);
  };

  if (showGame) {
    return (
      <>
        <Navigation onHomeClick={handleBackToHome} currentPage="game" />
        <WikiGame />
      </>
    );
  }

  return (
    <>
      <Navigation onHomeClick={() => setShowGame(false)} currentPage="home" />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Matrix-style animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.03)_100%)]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16 pt-24">
        <div className="text-center space-y-8 mb-16">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <Shield className="w-16 h-16 text-green-400 mx-auto opacity-90" />
              <Eye className="w-5 h-5 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight mb-2">
              <span className="text-green-400">COGSEC</span>
              <span className="text-white ml-4">ARENA</span>
            </h1>
            <p className="text-gray-400 text-lg font-light tracking-wide">
              Cognitive Security Training Platform
            </p>
          </div>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Distinguish <span className="text-green-400">Authentic</span> from <span className="text-red-400">Synthetic</span>
            </h2>
            <div className="bg-gray-900/50 border border-gray-700 p-8 rounded-lg">
              <p className="text-xl text-gray-300 leading-relaxed text-center mb-6">
                In an age of sophisticated AI, the ability to identify genuine information from synthetic content 
                has become a critical skill. Test your detection abilities against state-of-the-art language models.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Real Wikipedia articles
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  AI-generated content
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => setShowGame(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 group"
          >
            Start Training
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-900/50 border-gray-700 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Pattern Detection</h3>
              <p className="text-gray-400 leading-relaxed">
                Develop advanced pattern recognition skills to identify synthetic content and AI-generated text artifacts.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Adaptive Difficulty</h3>
              <p className="text-gray-400 leading-relaxed">
                Progress through increasingly sophisticated challenges, from obvious fakes to near-perfect synthetic content.
              </p>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Track your accuracy, response time, and improvement over time with detailed performance metrics.
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h3>
            <p className="text-gray-400">
              A systematic approach to developing AI detection skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                1
              </div>
              <h4 className="font-semibold text-white">Configure</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Select difficulty level, number of rounds, and time limits for your training session
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                2
              </div>
              <h4 className="font-semibold text-white">Analyze</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Compare two articles side-by-side and identify subtle differences in writing patterns
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                3
              </div>
              <h4 className="font-semibold text-white">Choose</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Make your decision on which article is authentic and which is AI-generated
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                4
              </div>
              <h4 className="font-semibold text-white">Learn</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Review results, understand your mistakes, and improve your detection abilities
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">50K+</div>
              <div className="text-gray-400 text-sm">Training Sessions</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-400">27%</div>
              <div className="text-gray-400 text-sm">Average Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-gray-400 text-sm">AI Models</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">∞</div>
              <div className="text-gray-400 text-sm">Wikipedia Articles</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-8">
            <p className="text-gray-400 mb-6 text-lg">
              Ready to test your AI detection skills?
            </p>
            <Button 
              onClick={() => setShowGame(true)}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 group"
            >
              Begin Training
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
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
                AI-Generated Content
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                Timed Challenges
              </Badge>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Cogsec Arena. Developing cognitive security skills for the AI age.
            </p>
            <p className="text-gray-600 text-xs">
              Content from Wikipedia is licensed under CC BY-SA 4.0. Not affiliated with Wikipedia or Wikimedia Foundation.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Homepage;
