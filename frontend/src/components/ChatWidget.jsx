import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  X,
  MessageSquare,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { chatbotApi } from '../services/api';

export default function ChatWidget({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const displayName = (user?.full_name || user?.name || 'friend').split(' ')[0];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: 'Just now',
      text: `Hello ${displayName}! I am your MONEYCRAFT FinTech Chatbot. I can answer questions about UPI fraud traps, irregular stipend budgeting, daily spend caps, or savings pace. What would you like to check today?`,
      suggestions: [
        "How to save ₹5,000 on a student stipend?",
        "Is this SMS a scam: 'Electricity unpaid, pay now'?",
        "Liquid Mutual Funds vs 2.7% Savings Account",
        "How do I set a daily expense budget?"
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('scam') || q.includes('electricity') || q.includes('pin') || q.includes('refund') || q.includes('fake') || q.includes('qr')) {
      return {
        text: "🚨 UPI Safety Warning: Legitimate refunds or bill payments NEVER require entering your UPI PIN or scanning a QR code sent over WhatsApp/SMS! Fraudsters frequently impersonate power boards or customer care. If a screen asks for your UPI PIN, money is being DEBITED from your bank.",
        action: { label: "Test in Scam Shield", path: "/shield" }
      };
    }

    if (q.includes('stipend') || q.includes('save') || q.includes('5000') || q.includes('budget') || q.includes('salary')) {
      return {
        text: "💡 Smart Payout Strategy: When your stipend or gig money lands, immediately lock away 25-30% into your Savings Goals. Divide the remaining money by the days until your next payout to set a strict Daily Spend Cap (e.g. ₹250/day). Any unspent money rolls over to your weekend fun pot!",
        action: { label: "Track in Cashflow", path: "/spend" }
      };
    }

    if (q.includes('liquid') || q.includes('fund') || q.includes('interest') || q.includes('invest') || q.includes('sip')) {
      return {
        text: "📈 Micro-Investing Hack: Leaving stipend money in a regular bank account earns barely 2.5–3% p.a. Overnight and Liquid mutual funds invest in government-backed T-bills, earning ~6.8% with instant 1-day UPI withdrawal. It keeps your emergency cash beating inflation with zero stock market drama.",
        action: { label: "Take Daily Quiz", path: "/quiz" }
      };
    }

    if (q.includes('chai') || q.includes('expense') || q.includes('track') || q.includes('daily') || q.includes('food')) {
      return {
        text: "☕ Micro-Expense Leak: Small ₹30 chai taps and ₹150 food deliveries often add up to over ₹4,500 every month without you realizing it. Use our Cashflow tab to log your daily expenses with one tap and see today's spent total instantly!",
        action: { label: "Log Daily Expense", path: "/spend" }
      };
    }

    if (q.includes('laptop') || q.includes('goal') || q.includes('buy') || q.includes('target')) {
      return {
        text: "🎯 Custom Goal Deposits: For any purchase like an M2 laptop or phone, break it down into flexible deposits. With MONEYCRAFT, you can now deposit ANY variable amount (like ₹250, ₹640, or ₹2,000) whenever you get extra freelance or pocket money!",
        action: { label: "Open Goals Planner", path: "/goals" }
      };
    }

    return {
      text: "That's a great question! Staying on top of your digital finances is all about pre-transaction awareness and smart daily tracking. You can log income & daily expenses in Cashflow, check suspicious payment requests in Shield, or set variable savings in Goals. Let me know what specific goal you are working towards!",
      action: { label: "View Analytics Dashboard", path: "/dashboard" }
    };
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: 'Just now',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build conversation history from recent messages
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await chatbotApi.sendMessage(text.trim(), history);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: 'Just now',
        text: res.reply,
        risk_level: res.risk_level,
        red_flags: res.red_flags,
        recommendations: res.recommendations,
        action: res.risk_level === 'HIGH' ? { label: "Test in Scam Shield", path: "/shield" } : undefined
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend chat API failed, using fallback knowledge base:', err);
      const reply = getBotResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: 'Just now',
        text: reply.text,
        action: reply.action
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-full text-xs font-bold shadow-xl animate-fade-in border border-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MONEYCRAFT Chatbot</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle MONEYCRAFT Chatbot"
          className="relative w-14 h-14 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 border-2 border-amber-400/40"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* Floating Popover Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[400px] h-[560px] max-h-[82vh] bg-white rounded-3xl border-2 border-stone-300 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-left">
          
          {/* Header */}
          <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5 text-white">
                  MONEYCRAFT Chatbot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-stone-400 font-semibold block">
                  Always-Active Money Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: Date.now(),
                      sender: 'bot',
                      time: 'Just now',
                      text: `Chat reset! How can I help you optimize your money today, ${displayName}?`,
                      suggestions: [
                        "How to save ₹5,000 on a student stipend?",
                        "Is this SMS a scam: 'Electricity unpaid, pay now'?",
                        "Liquid Mutual Funds vs 2.7% Savings Account",
                        "How do I set a daily expense budget?"
                      ]
                    }
                  ]);
                }}
                title="Reset conversation"
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[88%]">
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center text-xs shrink-0 shadow-sm mb-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-stone-900 text-white rounded-br-sm shadow-md font-medium'
                        : 'bg-white text-stone-900 border border-stone-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.action && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(m.action.path);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-900 font-black text-xs flex items-center justify-center shrink-0 shadow-sm mb-1">
                      {(user?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Suggestion Chips */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 ml-8 max-w-sm">
                    {m.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(s)}
                        className="text-[11px] bg-white hover:bg-stone-100 text-stone-700 font-semibold px-2.5 py-1.5 rounded-xl border border-stone-300 shadow-xs transition-all cursor-pointer text-left active:scale-95"
                      >
                        ✨ {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center text-xs shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl px-3.5 py-2 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="p-2.5 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center bg-stone-50 border border-stone-300 rounded-2xl p-1 focus-within:bg-white focus-within:border-stone-900 transition-colors"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MONEYCRAFT Chatbot anything..."
                className="flex-1 min-h-[40px] px-3 bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="min-h-[38px] px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Send</span>
                <Send className="w-3 h-3 text-amber-400" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
