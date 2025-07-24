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
  Zap,
  Shield,
  Eye,
  Cpu,
  Terminal
} from "lucide-react";

const Homepage = () => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <WikiGame />;
  }

  return (
    <div className="min-h-screen bg-black text-green-50 relative overflow-hidden font-mono">
      {/* Matrix-style animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,255,0,0.03)_100%)]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          {/* Logo/Title */}
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <Shield className="w-14 h-14 text-green-400 animate-pulse" />
              <Eye className="w-6 h-6 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blink" />
            </div>
            <div>
              <h1 className="text-7xl font-bold tracking-tight text-green-400 font-mono glitch-text">
                COGSEC
              </h1>
              <h2 className="text-4xl font-bold tracking-wider text-red-400 font-mono -mt-2">
                ARENA
              </h2>
              <p className="text-green-300 text-sm font-mono tracking-widest mt-1 opacity-80">
                &gt; COGNITIVE_SECURITY_PROTOCOL_ACTIVE
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border border-green-500/30 bg-black/60 p-6 rounded font-mono text-left">
              <div className="text-green-400 text-sm mb-2">[MISSION_BRIEFING]</div>
              <h3 className="text-2xl md:text-3xl font-bold text-green-300 mb-4">
                DISTINGUISH <span className="text-green-400">AUTHENTIC</span> FROM <span className="text-red-400">SYNTHETIC</span>
              </h3>
              <p className="text-green-100 leading-relaxed text-lg">
                The information war is here. AI-generated content is indistinguishable from human-created knowledge. 
                Your cognitive security depends on your ability to detect the fakes.
              </p>
              <div className="mt-4 text-green-400 text-sm">
                &gt; Test your epistemic vigilance against state-of-the-art language models
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => setShowGame(true)}
            className="bg-black border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-12 py-4 text-xl font-bold font-mono tracking-wider shadow-2xl hover:shadow-green-400/25 transform hover:scale-105 transition-all duration-300 group uppercase"
          >
            <Terminal className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            ENTER_ARENA
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/80 border-green-500/30 hover:border-green-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
            <div className="p-8 space-y-4 font-mono">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-green-400 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-green-400 text-sm">[MODULE_01]</div>
              </div>
              <h3 className="text-xl font-bold text-green-300 uppercase tracking-wide">THREAT_DETECTION</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                Deploy advanced pattern recognition to identify synthetic content. 
                Your neural pathways versus artificial neural networks.
              </p>
            </div>
          </Card>

          <Card className="bg-black/80 border-red-500/30 hover:border-red-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20">
            <div className="p-8 space-y-4 font-mono">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-red-400 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-red-400 text-sm">[MODULE_02]</div>
              </div>
              <h3 className="text-xl font-bold text-red-300 uppercase tracking-wide">DIFFICULTY_SCALING</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Progressive adversarial training. Easy mode: GPT-2 artifacts. 
                Hard mode: Indistinguishable from human output.
              </p>
            </div>
          </Card>

          <Card className="bg-black/80 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="p-8 space-y-4 font-mono">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-purple-400 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-purple-400 text-sm">[MODULE_03]</div>
              </div>
              <h3 className="text-xl font-bold text-purple-300 uppercase tracking-wide">PERFORMANCE_METRICS</h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                Real-time accuracy tracking. Leaderboard positioning. 
                Cognitive security score optimization.
              </p>
            </div>
          </Card>
        </div>

        {/* Protocol Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-green-400 font-mono text-sm mb-2">[TRAINING_PROTOCOL]</div>
            <h3 className="text-3xl font-bold text-green-300 font-mono uppercase tracking-wide">
              EXECUTION_SEQUENCE
            </h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-black/60 border border-green-500/30 p-6 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-green-400 flex items-center justify-center text-green-400 font-bold">
                  01
                </div>
                <div className="text-green-400 text-xs">[INIT]</div>
              </div>
              <h4 className="font-bold text-green-300 uppercase text-sm">CONFIG_PARAMS</h4>
              <p className="text-green-100 text-xs leading-relaxed">
                Set threat level, round count, time constraints
              </p>
            </div>

            <div className="bg-black/60 border border-red-500/30 p-6 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-red-400 flex items-center justify-center text-red-400 font-bold">
                  02
                </div>
                <div className="text-red-400 text-xs">[SCAN]</div>
              </div>
              <h4 className="font-bold text-red-300 uppercase text-sm">DATA_ANALYSIS</h4>
              <p className="text-red-100 text-xs leading-relaxed">
                Compare dual-source intelligence feeds
              </p>
            </div>

            <div className="bg-black/60 border border-purple-500/30 p-6 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-purple-400 flex items-center justify-center text-purple-400 font-bold">
                  03
                </div>
                <div className="text-purple-400 text-xs">[EXEC]</div>
              </div>
              <h4 className="font-bold text-purple-300 uppercase text-sm">DECISION_TREE</h4>
              <p className="text-purple-100 text-xs leading-relaxed">
                Select authentic vs synthetic classification
              </p>
            </div>

            <div className="bg-black/60 border border-cyan-500/30 p-6 space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-bold">
                  04
                </div>
                <div className="text-cyan-400 text-xs">[EVAL]</div>
              </div>
              <h4 className="font-bold text-cyan-300 uppercase text-sm">FEEDBACK_LOOP</h4>
              <p className="text-cyan-100 text-xs leading-relaxed">
                Performance analysis & accuracy metrics
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-8">
          <div className="text-center mb-8">
            <div className="text-green-400 font-mono text-sm mb-2">[SYSTEM_METRICS]</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/60 border border-green-500/30 p-4 font-mono">
              <div className="text-2xl font-bold text-green-400 mb-1">50K+</div>
              <div className="text-green-200 text-xs uppercase tracking-wide">SESSIONS_RUN</div>
            </div>
            <div className="bg-black/60 border border-red-500/30 p-4 font-mono">
              <div className="text-2xl font-bold text-red-400 mb-1">27%</div>
              <div className="text-red-200 text-xs uppercase tracking-wide">SUCCESS_RATE</div>
            </div>
            <div className="bg-black/60 border border-purple-500/30 p-4 font-mono">
              <div className="text-2xl font-bold text-purple-400 mb-1">5</div>
              <div className="text-purple-200 text-xs uppercase tracking-wide">AI_MODELS</div>
            </div>
            <div className="bg-black/60 border border-cyan-500/30 p-4 font-mono">
              <div className="text-2xl font-bold text-cyan-400 mb-1">∞</div>
              <div className="text-cyan-200 text-xs uppercase tracking-wide">DATA_SOURCES</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-8">
            <div className="text-green-400 mb-6 font-mono text-sm">
              &gt; INITIATE_COGNITIVE_SECURITY_ASSESSMENT?
            </div>
            <Button 
              onClick={() => setShowGame(true)}
              size="lg"
              className="bg-black border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black px-16 py-6 text-2xl font-bold font-mono tracking-wider shadow-2xl hover:shadow-red-400/25 transform hover:scale-105 transition-all duration-300 group uppercase"
            >
              <Cpu className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-300" />
              DEPLOY
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-green-500/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 font-mono">
            <div className="flex justify-center space-x-4 text-green-200">
              <Badge variant="outline" className="border-green-500/30 text-green-300 bg-black/50">
                <Globe className="w-3 h-3 mr-2" />
                AUTHENTIC_DATA
              </Badge>
              <Badge variant="outline" className="border-red-500/30 text-red-300 bg-black/50">
                <Brain className="w-3 h-3 mr-2" />
                SYNTHETIC_THREATS
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-black/50">
                <Clock className="w-3 h-3 mr-2" />
                TIME_PRESSURE
              </Badge>
            </div>
            <div className="text-green-400 text-xs">
              <div>© 2024 COGSEC_ARENA // EPISTEMIC_VIGILANCE_PROTOCOL</div>
              <div className="mt-2 text-green-500/60">
                &gt; "In the information war, your mind is the battlefield."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
