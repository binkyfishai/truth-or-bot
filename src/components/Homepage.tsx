import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WikiGame } from "@/components/WikiGame";
import { Navigation } from "@/components/Navigation";
import { Leaderboard } from "@/components/Leaderboard";
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
  Terminal,
  AlertTriangle,
  BarChart3,
  Rocket,
  ChevronRight
} from "lucide-react";

const Homepage = () => {
  const [showGame, setShowGame] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimateIn(true);
    
    // Handle hash-based navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'leaderboard') {
        setShowGame(false);
        setShowLeaderboard(true);
      }
    };
    
    // Check hash on initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleBackToHome = () => {
    setShowGame(false);
    setShowLeaderboard(false);
  };

  const handleNavClick = (page: string) => {
    if (page === "home") {
      setShowGame(false);
      setShowLeaderboard(false);
    } else if (page === "leaderboard") {
      setShowGame(false);
      setShowLeaderboard(true);
    }
  };

  if (showGame) {
    return (
      <>
        <Navigation onHomeClick={handleBackToHome} currentPage="game" />
        <WikiGame />
      </>
    );
  }

  if (showLeaderboard) {
    return (
      <>
        <Navigation onHomeClick={handleBackToHome} currentPage="leaderboard" />
        <Leaderboard />
      </>
    );
  }

  return (
    <>
      <Navigation 
        onHomeClick={() => handleNavClick("home")} 
        currentPage="home" 
      />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated cybersecurity-themed background elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Digital grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.05)_100%)]"></div>
          
          {/* Matrix-style code rain effect */}
          <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        </div>

        {/* Hero Section - Ultra Compact */}
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-4">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo with enhanced glow effect */}
            <div className="relative inline-block mb-2">
              <div className="absolute inset-0 bg-green-500/40 rounded-full blur-[100px] animate-pulse"></div>
              <img 
                src="/images/cogsec_arena_nobg.png" 
                alt="Cogsec Arena" 
                className="h-52 md:h-64 mx-auto filter drop-shadow-[0_0_30px_rgba(0,255,0,0.8)] animate-pulse-slow" 
              />
            </div>
            
            {/* Tagline */}
            <p className="text-gray-400 text-lg font-light tracking-wide max-w-2xl mx-auto -mt-2 mb-1">
              TRAIN YOUR MIND TO SURVIVE THE INFOWAR
            </p>
            
            {/* Truth or Deception */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-0.5 w-10 bg-gradient-to-r from-transparent to-green-400"></div>
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-green-400 drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]">HUMAN</span> 
                <span className="text-gray-400 mx-2">or</span> 
                <span className="text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]">HALLUCINATION?</span>
              </h2>
              <div className="h-0.5 w-10 bg-gradient-to-r from-green-400 to-transparent"></div>
            </div>
            
            {/* Info Box */}
            <div className="bg-gray-900/80 border border-gray-700 p-4 sm:p-5 rounded-lg backdrop-blur-sm shadow-xl max-w-3xl mx-auto mb-4">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">CRITICAL SKILL TRAINING</span>
              </div>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed text-center mb-3">
                As the highly spoken of and dreaded 'Tomorrow' becomes today faster than yesterday ever did, cognitive security 
                is a <span className="text-green-400 font-semibold">critical security skill</span>. You need to learn to protect yourself from infohazards. You need to learn to distinguish between reality, and what you read or see on the internet. Remember when it couldn't draw hands? How blissfully ignorant we were.
              </p>
              <div className="flex flex-row justify-center gap-3 sm:gap-6">
                <div className="flex items-center bg-green-400/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  <span className="text-green-300 text-xs sm:text-sm">Real Human Wiki Articles</span>
                </div>
                <div className="flex items-center bg-red-400/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></div>
                  <span className="text-red-300 text-xs sm:text-sm">Real AI-Generated Fake News</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="mb-6">
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <Button 
                  onClick={() => setShowGame(true)}
                  className="relative bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-semibold rounded-lg shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 group"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Play Now
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Separator Line */}
          <div className="relative max-w-5xl mx-auto mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Compact Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10 transition-all duration-1000 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-3px]">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">Pattern Detection</h3>
                <p className="text-gray-400 text-xs">
                  Develop advanced neural pattern recognition to identify synthetic content markers and AI-generated text artifacts.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-3px]">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">Adaptive Challenge</h3>
                <p className="text-gray-400 text-xs">
                  Face increasingly sophisticated deception, from obvious fakes to near-perfect synthetic content designed to deceive.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-3px]">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">Performance Analytics</h3>
                <p className="text-gray-400 text-xs">
                  Track your detection accuracy, response time, and cognitive improvement with detailed performance metrics.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-white mb-10 flex items-center justify-center">
              <span className="relative">
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-transparent"></span>
                How It Works
              </span>
            </h2>
            
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-24 left-1/2 w-0.5 h-[calc(100%-120px)] bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                {/* Step 1 */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-5px]">
                    <div className="relative z-10">
                      <Badge className="absolute -top-3 -left-3 bg-green-500 text-white border-0">Step 1</Badge>
                      <div className="w-14 h-14 rounded-full bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
                        <Eye className="w-7 h-7 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Analyze</h3>
                      <p className="text-gray-400 text-sm">
                        Examine the content of each page carefully, looking for patterns, inconsistencies, and telltale signs of AI generation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-5px]">
                    <div className="relative z-10">
                      <Badge className="absolute -top-3 -left-3 bg-blue-500 text-white border-0">Step 2</Badge>
                      <div className="w-14 h-14 rounded-full bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                        <Brain className="w-7 h-7 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Decide</h3>
                      <p className="text-gray-400 text-sm">
                        Make your judgment: is this authentic content or AI-generated deception? Trust your instincts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="bg-gray-900/70 border border-gray-800 p-6 rounded-lg backdrop-blur-sm shadow-lg h-full flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-5px]">
                    <div className="relative z-10">
                      <Badge className="absolute -top-3 -left-3 bg-purple-500 text-white border-0">Step 3</Badge>
                      <div className="w-14 h-14 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                        <BarChart3 className="w-7 h-7 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Improve</h3>
                      <p className="text-gray-400 text-sm">
                        Review your results, learn from mistakes, and sharpen your detection skills over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-green-400 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-gray-900/80 border border-gray-800 p-8 rounded-lg backdrop-blur-sm shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to test your detection skills?</h3>
                    <p className="text-gray-400">Train your mind to identify AI deception in a gamified environment.</p>
                  </div>
                  <div>
                    <Button 
                      onClick={() => setShowGame(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 group"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Play Now
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t border-gray-800 py-8 transition-all duration-1000 delay-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Badge variant="outline" className="bg-gray-900/50 hover:bg-gray-800 transition-colors">
                <Shield className="w-3 h-3 mr-1" />
                Cognitive Security
              </Badge>
              <Badge variant="outline" className="bg-gray-900/50 hover:bg-gray-800 transition-colors">
                <Brain className="w-3 h-3 mr-1" />
                AI Detection
              </Badge>
              <Badge variant="outline" className="bg-gray-900/50 hover:bg-gray-800 transition-colors">
                <Target className="w-3 h-3 mr-1" />
                Pattern Recognition
              </Badge>
              <Badge variant="outline" className="bg-gray-900/50 hover:bg-gray-800 transition-colors">
                <Zap className="w-3 h-3 mr-1" />
                Skill Building
              </Badge>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Cogsec Arena. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
