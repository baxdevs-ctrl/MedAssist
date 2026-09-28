import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { t, language, user, showToast } = useApp();

  const getInitialMessages = (): ChatMessage[] => {
    if (language === 'uz') {
      return [
        {
          id: 'm-welcome',
          sender: 'assistant',
          content: `Assalomu alaykum! Men **MedAssist AI** — shifokorlar va tibbiyot talabalari uchun klinik hujjatlar, ish jarayoni va tibbiy atamalarni tartibga soluvchi yordamchiman.\n\nQanday yordam bera olaman:\n• Tibbiy qaydlarni SOAP / 7-bosqichli formatga keltirish\n• Laboratoriya atamalarini tushuntirish\n• Konsultatsiya va muolaja cheklistlarini tuzish\n• Klinik ma'lumotlarni xavfsiz tizimlashtirish\n\n⚠️ *Eslatma: Men shifokor emasman, mustaqil tashxis qo'ymayman va dori buyurmayman.*`,
          timestamp: 'Hozir',
        },
      ];
    } else if (language === 'ru') {
      return [
        {
          id: 'm-welcome',
          sender: 'assistant',
          content: `Здравствуйте! Я **MedAssist AI** — клинический ассистент для врачей и студентов-медиков.\n\nЧем я могу помочь:\n• Оформление заметок по стандарту SOAP и 7 разделам\n• Разъяснение терминологии лабораторных показателей\n• Создание чеклистов для процедур и осмотров\n• Систематизация записей пациентов\n\n⚠️ *Напоминание: Я не являюсь врачом, не ставлю окончательных диагнозов и не назначаю препаратов.*`,
          timestamp: 'Сейчас',
        },
      ];
    } else {
      return [
        {
          id: 'm-welcome',
          sender: 'assistant',
          content: `Hello! I am **MedAssist AI**, your clinical workflow and documentation assistant.\n\nI can assist you with:\n• Structuring clinical notes into standardized 7-tier records\n• Explaining laboratory terminology and reference values\n• Generating procedure and consultation checklists\n• Organizing clinical information safely\n\n⚠️ *Clinical Protocol: I do not provide definitive diagnoses, prescribe medication, or replace qualified medical judgment.*`,
          timestamp: 'Just now',
        },
      ];
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedPrompts = [
    t('prompt1'),
    t('prompt2'),
    t('prompt3'),
    t('prompt4'),
    t('prompt5'),
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          language,
        }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Chat request failed, generating safe fallback:', err);
      const fallbackReply =
        language === 'uz'
          ? `Tushundim. Klinik xavfsizlik qoidalariga binoan, ushbu ma'lumotlar faqat malakali shifokor tomonidan baholanishi lozim. Qo'shimcha ravishda "Tibbiy Qaydlar" bo'limida 7-bosqichli strukturadan foydalanishingiz mumkin.`
          : `Запрос обработан. Согласно правилам клинической безопасности, все данные требуют очной оценки лечащим врачом. Вы также можете использовать редактор медицинских записей.`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(getInitialMessages());
    showToast(t('clearChat'), 'info');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(t('copiedToClipboard'), 'success');
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span>{t('aiAssistantTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('aiAssistantSubtitle')}
          </p>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('clearChat')}</span>
        </button>
      </div>

      {/* Prominent Medical Safety Banner */}
      <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-950 dark:text-sky-200 text-xs shrink-0 flex items-start gap-2.5 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold">{t('safetyRulesHeader')}</span>{' '}
          <span className="text-slate-600 dark:text-slate-300">
            {t('rule1')} • {t('rule2')} • {t('rule3')} • {t('rule4')} • {t('rule5')}
          </span>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-sky-600 text-white'
                    : 'bg-gradient-to-tr from-sky-500 to-teal-400 text-white'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative group rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Footer time & copy */}
                <div
                  className={`mt-2 flex items-center justify-between gap-4 text-[10px] ${
                    isUser ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-sky-600 flex items-center gap-1 font-medium"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Ko'chirildi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Nusxa olish</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-3xl rounded-tl-xs p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
              <span>MedAssist AI xavfsiz javob tayyorlamoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">
          {t('suggestedPrompts')}
        </span>
        {suggestedPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(promptText)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 hover:text-sky-600 text-xs font-medium whitespace-nowrap transition-colors border border-slate-200/60 dark:border-slate-700/60"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Input Field */}
      <div className="shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={t('chatPlaceholder')}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition-all shadow-md shadow-sky-600/20"
          aria-label={t('send')}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
