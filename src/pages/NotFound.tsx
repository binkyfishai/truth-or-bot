import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-gray-200 animate-fade-in-up">
            Oops! Page Not Found
          </div>
        </div>

        {/* Error description */}
        <div className="space-y-4 animate-fade-in-up delay-200">
          <p className="text-lg text-gray-400">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best detectives sometimes take a wrong turn.
          </p>
        </div>

        {/* Search suggestion */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm animate-fade-in-up delay-300">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Looking for something specific?</h3>
          </div>
          <p className="text-gray-400 mb-6">
            The page <code className="bg-gray-700 px-2 py-1 rounded text-orange-400">{location.pathname}</code> doesn't exist, 
            but you can return to the homepage and start your AI detection challenge!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Back to Home
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800/60 hover:text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </Button>
        </div>

        {/* Fun message */}
        <div className="pt-8 animate-fade-in-up delay-500">
          <p className="text-gray-500 text-sm italic">
            "Not all who wander are lost, but this page definitely is." 🤖
          </p>
        </div>
      </div>

      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-500/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-purple-500/30 rounded-full animate-float delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-3 h-3 bg-green-500/30 rounded-full animate-float delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-yellow-500/30 rounded-full animate-float delay-500"></div>
    </div>
  );
};

export default NotFound;
