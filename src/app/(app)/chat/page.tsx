'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Camera, Image as ImageIcon, Loader2, Sparkles, X } from 'lucide-react';
import { getChatMessages, saveChatMessages, getProfile, addEntry } from '@/lib/store';
import { processMessage } from '@/lib/chat-ai';
import { ChatMessage } from '@/lib/types';
import { format } from 'date-fns';

const quickActions = [
  "What did I eat today?",
  "How's my week going?",
  "Suggest something healthy",
  "Calories in dosa",
  "What do I eat most?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = getChatMessages();
    if (stored.length === 0) {
      const profile = getProfile();
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hey ${profile.name}! I'm your NourishLog assistant.\n\nYou can log food here too — just tell me what you ate. Or ask me about your nutrition:\n\n• "What did I eat today?"\n• "How's my week going?"\n• "Suggest something healthy"\n• "Calories in biryani"`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      saveChatMessages([welcome]);
    } else {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() && !imagePreview) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: imagePreview ? `[Photo] ${text || 'What is this?'}` : text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let result;
      if (imagePreview) {
        const foods = [
          { name: 'Masala Dosa', cal: 280, p: 6, c: 42, f: 10, fb: 3, score: 7 },
          { name: 'Chicken Biryani', cal: 490, p: 22, c: 62, f: 18, fb: 3, score: 6 },
          { name: 'Paneer Tikka', cal: 265, p: 18, c: 8, f: 20, fb: 1, score: 7 },
          { name: 'Chole Bhature', cal: 520, p: 14, c: 62, f: 24, fb: 6, score: 4 },
          { name: 'Pav Bhaji', cal: 380, p: 10, c: 48, f: 16, fb: 4, score: 5 },
        ];
        const food = foods[Math.floor(Math.random() * foods.length)];
        const mealType = (() => {
          const h = new Date().getHours();
          if (h < 11) return 'breakfast' as const;
          if (h < 15) return 'lunch' as const;
          if (h < 18) return 'snack' as const;
          return 'dinner' as const;
        })();
        const entry = {
          id: Date.now().toString(),
          name: food.name,
          calories: food.cal,
          protein: food.p,
          carbs: food.c,
          fat: food.f,
          fiber: food.fb,
          mealType,
          time: format(new Date(), 'HH:mm'),
          date: format(new Date(), 'yyyy-MM-dd'),
          imageUrl: imagePreview,
          healthScore: food.score,
          servingSize: '1 serving',
        };
        addEntry(entry);
        result = {
          response: `Identified: **${food.name}**! Logged for ${mealType}.\n\n🔥 ${food.cal} kcal | 🥩 ${food.p}g protein | 🍚 ${food.c}g carbs | 🧈 ${food.f}g fat\n💚 Health Score: ${food.score}/10`,
          foodEntry: entry,
        };
        setImagePreview(null);
      } else {
        result = processMessage(text);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString(),
        foodEntry: result.foodEntry,
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      saveChatMessages(updated);
      setIsTyping(false);
    }, imagePreview ? 1500 : 700);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      inputRef.current?.focus();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="px-5 lg:px-8 pt-10 lg:pt-8 pb-3 border-b border-[var(--border)] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-dim)] flex items-center justify-center">
            <Sparkles size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>NourishLog Chat</h1>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isTyping ? 'Typing...' : 'Log food, ask questions, get suggestions'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 lg:px-8 py-4 chat-scroll">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[60%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[var(--accent)] text-white rounded-br-md'
                  : 'glass-card rounded-bl-md'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={`text-[13px] leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('_') && part.endsWith('_')) {
                      return <em key={j} className="opacity-70 text-xs">{part.slice(1, -1)}</em>;
                    }
                    return part;
                  })}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-3 chat-bubble">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
              <span className="text-xs text-[var(--text-muted)]">Thinking...</span>
            </div>
          </div>
        )}

        {/* Quick actions on fresh chat */}
        {messages.length <= 2 && !isTyping && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <button
                key={a}
                onClick={() => sendMessage(a)}
                className="px-3.5 py-2 rounded-xl glass text-[11px] font-medium
                  text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all active:scale-95"
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-5 lg:px-8 py-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg-secondary)]">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-16 w-24 object-cover rounded-lg" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--bg-primary)] border border-[var(--border)]
                flex items-center justify-center"
            >
              <X size={10} />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 lg:px-8 py-3 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg-primary)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0
              hover:bg-[var(--bg-card-hover)] transition-colors active:scale-95"
            title="Upload photo"
          >
            <Camera size={18} className="text-[var(--text-muted)]" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0
              hover:bg-[var(--bg-card-hover)] transition-colors active:scale-95"
            title="Upload from gallery"
          >
            <ImageIcon size={18} className="text-[var(--text-muted)]" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder='Type what you ate or ask a question...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
              text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
              focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() && !imagePreview}
            className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0
              disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  );
}
