import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile, ChatMessage } from '@/types/finance';
import { riskLabel, goalLabel } from '@/types/finance';

interface ChatInterfaceProps {
  profile: UserProfile;
  onStartOver: () => void;
}

const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = 'liquid/lfm-2.5-1.2b-thinking:free';

async function getOpenRouterResponse(
  question: string,
  profile: UserProfile,
  previousMessages: ChatMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return '⚠️ API key not configured. Please add `VITE_OPENROUTER_API_KEY` to your `.env` file and restart the server.';
  }

  const systemPrompt = `You are a professional financial education assistant. Provide personalized investment recommendations based on user profile. Do NOT provide legal, tax, or guaranteed-return advice.

User Profile: ${riskLabel[profile.riskTolerance]} risk tolerance, ${profile.investmentType}, ${profile.experienceLevel}, $${profile.investmentAmount} to invest for ${goalLabel[profile.investmentGoal]}.

${
  profile.riskTolerance === 'low'
    ? `RECOMMENDATIONS: Bonds (40-50%), Gold (15-20%), Fixed Deposits (15-25%), Conservative Mutual Funds (10-15%). Focus: capital preservation.`
    : profile.riskTolerance === 'medium'
    ? `RECOMMENDATIONS: Bonds (20-30%), Dividend Stocks & Index Funds (30-40%), ETFs (20-30%), Gold (5-10%). Focus: balanced growth.`
    : `RECOMMENDATIONS: Growth Stocks (35-45%), Small/Mid-Cap (15-20%), Index Funds (15-25%), Crypto (10-20%), Gold (5-10%). Focus: wealth accumulation.`
}

INSTRUCTIONS:
- Always provide specific asset allocation percentages
- Mention bonds, stocks, gold, crypto, mutual funds, and ETFs appropriately
- Include risk disclaimers
- Tailor to ${profile.experienceLevel} experience level
- Consider ${profile.investmentType} time horizon`;

  const history = previousMessages.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const requestBody = {
      model: OPENROUTER_MODEL,
      temperature: 0.4,
      max_tokens: 1500,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: question },
      ],
    };
    
    console.log('Sending request to OpenRouter with model:', OPENROUTER_MODEL);
    console.log('Message count:', requestBody.messages.length);
    
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Smart Wealth Guide',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        errorMsg = errorData?.error?.message || errorData?.error || JSON.stringify(errorData);
        console.error('API Error Response:', errorData);
      } catch (e) {
        console.error('API Response:', response.status, response.statusText);
      }
      throw new Error(`API error (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;
    return typeof aiText === 'string' && aiText.trim() ? aiText : '❌ No response received from API.';
  } catch (error) {
    return `❌ Error: ${error instanceof Error ? error.message : 'Failed to fetch response'}`;
  }
}

const ChatInterface = ({ profile, onStartOver }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load initial greeting from OpenRouter API on mount
  useEffect(() => {
    const loadInitial = async () => {
      setIsTyping(true);
      const greeting = await getOpenRouterResponse(
        `Greet me and provide initial investment advice based on my profile.`,
        profile,
        []
      );
      setMessages([{ id: Date.now().toString(), role: 'assistant', content: greeting }]);
      setIsTyping(false);
    };
    loadInitial();
  }, [profile]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getOpenRouterResponse(userMsg.content, profile, messages);
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), role: 'assistant', content: response },
    ]);
    setIsTyping(false);
  };

  const regenerate = async () => {
    setIsTyping(true);
    const greeting = await getOpenRouterResponse(
      `Greet me and provide initial investment advice based on my profile.`,
      profile,
      []
    );
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: greeting }]);
    setIsTyping(false);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] w-full max-w-4xl flex-col px-2 sm:px-4">
      {/* Header actions */}
      <div className="mb-2 sm:mb-3 flex items-center justify-between gap-1 sm:gap-2">
        <h1 className="font-display text-base sm:text-lg md:text-xl font-bold truncate">AI Financial Advisor 🤖</h1>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={regenerate} 
            className="border-border text-muted-foreground hover:text-foreground px-2 sm:px-3"
            title="Regenerate response"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">Regenerate</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onStartOver} 
            className="border-border text-muted-foreground hover:text-foreground px-2 sm:px-3"
            title="Start over"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">Start Over</span>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-2 sm:space-y-4 overflow-y-auto rounded-lg sm:rounded-2xl border border-border bg-card p-2 sm:p-4 shadow-card">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-lg sm:rounded-2xl bg-secondary px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-2 sm:mt-3 flex gap-1 sm:gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about investments..."
          className="flex-1 border-border bg-secondary text-foreground text-xs sm:text-sm placeholder:text-muted-foreground"
        />
        <Button 
          onClick={sendMessage} 
          disabled={!input.trim()} 
          className="gradient-primary text-primary-foreground px-2 sm:px-4 flex-shrink-0"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/** Simple markdown-like renderer for bold and line breaks */
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-0.5 sm:space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('---')) return <hr key={i} className="my-1 sm:my-2 border-border" />;
        if (line.startsWith('| ') && line.includes('|')) {
          const cells = line.split('|').filter(Boolean).map((c) => c.trim());
          return (
            <div key={i} className="flex gap-2 sm:gap-4 text-xs overflow-x-auto">
              {cells.map((cell, j) => (
                <span key={j} className={j === 0 ? 'min-w-fit sm:min-w-[140px] font-medium' : ''}>{cell}</span>
              ))}
            </div>
          );
        }
        // Bold text
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className={line.trim() === '' ? 'h-0.5 sm:h-1' : ''}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default ChatInterface;
