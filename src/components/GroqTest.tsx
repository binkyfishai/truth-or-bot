import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap, Brain } from "lucide-react";

export const GroqTest = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("moonshotai/kimi-k2-instruct");
  const [streamingPrompt, setStreamingPrompt] = useState("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3001/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.content);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error: Failed to get response from API");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsStreaming(true);
    setStreamingResponse("");

    try {
      const res = await fetch("http://localhost:3001/api/groq/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get reader from response");
      }

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                break;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setStreamingResponse(prev => prev + parsed.content);
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setStreamingResponse(prev => prev + "\nError: Failed to stream response from API");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGetModels = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/groq");
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(JSON.stringify(data.models, null, 2));
    } catch (error) {
      console.error("Error fetching models:", error);
      setResponse("Error: Failed to get models");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Brain className="mr-2 text-green-500" />
        Groq API Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                  <SelectItem value="llama-3.1-8b-versatile">Llama 3.1 8B</SelectItem>
                  <SelectItem value="llama-3-70b-8192">Llama 3 70B</SelectItem>
                  <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prompt</label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter your prompt here..."
                className="h-32"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
              
              <Button type="button" variant="outline" onClick={handleGetModels}>
                List Models
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Response</label>
            <Textarea 
              value={response} 
              readOnly 
              className="h-64 font-mono text-sm"
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <form onSubmit={handleStreamingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Streaming Test</label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter your prompt here..."
                className="h-32"
              />
            </div>
            
            <div>
              <Button type="submit" disabled={isStreaming || !prompt.trim()}>
                {isStreaming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Streaming...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Stream Response
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Streaming Response</label>
            <Textarea 
              value={streamingResponse} 
              readOnly 
              className="h-64 font-mono text-sm"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}; 