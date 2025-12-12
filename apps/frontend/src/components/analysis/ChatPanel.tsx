"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, language: string) => Promise<unknown>;
  onClear: () => void;
  isLoading: boolean;
}

const SUGGESTED = [
  "What are the payment terms?",
  "Can the client terminate early?",
  "Who owns the IP?",
  "What are my main obligations?",
  "What are the biggest risks?",
];

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    await onSendMessage(msg, "en");
  };

  const handleSuggestion = async (q: string) => {
    if (isLoading) return;
    await onSendMessage(q, "en");
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground mb-4">Ask anything about this contract</p>
            <div className="space-y-2 w-full max-w-sm">
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  disabled={isLoading}
                  className="w-full text-left text-sm p-3 rounded-lg border hover:bg-secondary/50 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2.5",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="min-h-[44px] max-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="shrink-0 h-11 w-11">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
