import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Wallet,
  Target,
  HelpCircle,
  Clock,
  User,
  CheckCircle2,
  RefreshCcw
} from 'lucide-react';

export default function ChatPage() {
  const { user } = useOutletContext() || { user: null };
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: 'Just now',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! I am your MONEYCRAFT AI Money Copilot. I can help you budget your irregular income, verify suspicious UPI collect requests, calculate savings velocity for your goals, or advise on daily spending caps. What can I help you with today?`,
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
    scrollToBottom();
  }, [messages, isTyping]);

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
        text: "☕ Micro-Expense Leak: Small ₹30 chai taps and ₹150 food deliveries often add up to over ₹4,500 every month without you realizing it. Use our Tracker tab to log your daily expenses with one tap and see today's spent total instantly!",
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
      text: "That's a great question! Staying on top of your digital finances is all about pre-transaction awareness and smart daily tracking. You can log income & daily expenses in the Tracker, check suspicious payment requests in Shield, or set variable savings in Goals. Let me know what specific goal you are working towards!",
      action: { label: "View Analytics Dashboard", path: "/dashboard" }
    };
  };

  const handleSendMessage = (textToSend) => {
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

    setTimeout(() => {
      const reply = getBotResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        time: 'Just now',
        text: reply.text,
        action: reply.action
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto text-left animate-fade-in">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md shrink-0">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-1.5 leading-tight">
              MONEYCRAFT AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              1-on-1 Digital Money Assistant • Always Active
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: Date.now(),
                sender: 'bot',
                time: 'Just now',
                text: `Chat reset! How can I help you optimize your finances today, ${user ? user.name.split(' ')[0] : 'friend'}?`,
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
          className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[80%]">
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center text-xs shrink-0 shadow-sm mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-sm shadow-md font-medium'
                    : 'bg-white text-stone-900 border-2 border-stone-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Direct Action Link attached to bot reply */}
                {m.action && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => navigate(m.action.path)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm mb-1">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            {/* Quick Prompt Chips under first bot message */}
            {m.suggestions && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10 max-w-lg">
                {m.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(s)}
                    className="text-xs bg-white hover:bg-stone-100 text-stone-700 font-medium px-3 py-1.5 rounded-xl border border-stone-300 shadow-sm transition-all cursor-pointer text-left active:scale-95"
                  >
                    ✨ {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center text-xs shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border-2 border-stone-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-white border-2 border-stone-300 rounded-2xl p-1.5 shadow-md focus-within:border-stone-900 transition-colors"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about UPI safety, stipends, or savings..."
            className="flex-1 min-h-[46px] px-3.5 bg-transparent text-sm text-stone-900 placeholder-stone-400 outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="min-h-[44px] px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>
      </div>

    </div>
  );
}
