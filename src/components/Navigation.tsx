import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Menu, 
  Home, 
  Brain, 
  Trophy, 
  Info, 
  Github,
  X
} from "lucide-react";

interface NavigationProps {
  onHomeClick?: () => void;
  currentPage?: "home" | "game" | "about";
}

export const Navigation = ({ onHomeClick, currentPage = "home" }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "#" },
    { id: "about", label: "About", icon: Info, href: "#about" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "#leaderboard" },
    { id: "github", label: "GitHub", icon: Github, href: "https://github.com/binkyfishai/truth-or-bot", external: true }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === "home" && onHomeClick) {
      onHomeClick();
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick({ id: "home", label: "Home", icon: Home, href: "#" })}
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              <Eye className="w-3 h-3 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:text-red-300 transition-colors" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">
                COGSEC
              </span>
              <span className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors">
                ARENA
              </span>
            </div>
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
                asChild={item.external}
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                )}
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
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Shield className="w-6 h-6 text-green-400" />
                      <Eye className="w-2.5 h-2.5 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-green-400">COGSEC</span>
                      <span className="text-base font-bold text-white">ARENA</span>
                    </div>
                  </div>
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
                      asChild={item.external}
                    >
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      )}
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