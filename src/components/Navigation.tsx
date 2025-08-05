import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Brain, 
  Trophy, 
  Info,
  Zap
} from "lucide-react";

interface NavigationProps {
  onHomeClick?: () => void;
  currentPage?: "home" | "game" | "about" | "leaderboard" | "groq";
}

export const Navigation = ({ onHomeClick, currentPage = "home" }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "#" },
    { id: "about", label: "About", icon: Info, href: "#about" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "#leaderboard" },
    { id: "groq", label: "Groq API", icon: Zap, href: "/groq", external: true }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.external) {
      window.location.href = item.href;
      return;
    }
    
    if (item.id === "home" && onHomeClick) {
      onHomeClick();
    } else if (item.id === "leaderboard") {
      // This will be handled by the Homepage component
      window.location.hash = "leaderboard";
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick({ id: "home", label: "Home", icon: Home, href: "#" })}
          >
            <img 
              src="/images/cogsec_arena_nobg.png" 
              alt="Cogsec Arena" 
              className="h-20 md:h-24 transition-all duration-300 group-hover:opacity-90" 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors ${
                  currentPage === item.id ? "text-green-400 bg-green-400/10" : ""
                }`}
                onClick={() => handleNavClick(item)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Button>
            ))}
            
            {/* Status Badge */}
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
              <Brain className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-black border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <img 
                    src="/images/cogsec_arena_nobg.png" 
                    alt="Cogsec Arena" 
                    className="h-20" 
                  />
                </div>

                <div className="space-y-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50 ${
                        currentPage === item.id ? "text-green-400 bg-green-400/10" : ""
                      }`}
                      onClick={() => handleNavClick(item)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-800">
                    <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                      <Brain className="w-3 h-3 mr-2" />
                      System Online
                    </Badge>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};