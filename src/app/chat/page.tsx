"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowRight,
  Hash,
  Users,
  ArrowLeft,
} from "lucide-react";

// ... (Type definitions remains the same - کدهای تایپ را نگه دارید)
type Message = {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  senderName?: string;
};
type ChatRoom = {
  id: number;
  name: string;
  type: "group" | "private";
  avatarColor: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
};

export default function ChatPage() {
  // ... (Data definitions remains the same - دیتای چت‌ها را نگه دارید)
  const [chats, setChats] = useState<ChatRoom[]>([
    // ... دیتای خود را اینجا بگذارید
    {
      id: 1,
      name: "رویداد استارتاپی",
      type: "group",
      avatarColor: "bg-orange-500",
      lastMessage: "سلام...",
      unreadCount: 3,
      messages: [],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null); // در ابتدا هیچ چتی انتخاب نشده (مخصوصا برای موبایل)
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // منطق: اگر در دسکتاپ هستیم، اولین چت را پیش‌فرض انتخاب کن
  useEffect(() => {
    if (
      window.innerWidth >= 768 &&
      selectedChatId === null &&
      chats.length > 0
    ) {
      setSelectedChatId(chats[0].id);
    }
  }, []);

  const activeChat = chats.find((c) => c.id === selectedChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendMessage = () => {
    /* ... کدهای ارسال پیام شما ... */
  };

  return (
    <div
      className="flex h-[calc(100vh-theme(spacing.20))] md:h-screen bg-slate-100 overflow-hidden font-sans text-slate-900"
      dir="rtl"
    >
      {/* -------------------- سایدبار (لیست چت‌ها) -------------------- */}
      {/* در موبایل: اگر چتی انتخاب شده باشد، این بخش مخفی می‌شود */}
      <aside
        className={`
        w-full md:w-80 bg-[#111827] text-white flex-col border-l border-slate-700 shrink-0
        ${selectedChatId !== null ? "hidden md:flex" : "flex"} 
      `}
      >
        {/* هدر سایدبار */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight">
              پیام‌رسان راوی
            </h2>
            <Link
              href="/dashboard"
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
          {/* سرچ باکس */}
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full bg-slate-800 border-none rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* لیست چت‌ها */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
                selectedChatId === chat.id
                  ? "bg-slate-800 border-r-4 border-orange-500"
                  : "hover:bg-slate-800/50 border-r-4 border-transparent"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full ${chat.avatarColor} flex items-center justify-center text-white font-bold shrink-0`}
              >
                {chat.type === "group" ? (
                  <Hash size={20} />
                ) : (
                  chat.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm truncate text-slate-200">
                    {chat.name}
                  </h3>
                  {chat.unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* -------------------- صفحه چت -------------------- */}
      {/* در موبایل: فقط اگر چتی انتخاب شده باشد نمایش داده می‌شود */}
      <main
        className={`flex-1 flex-col bg-[#F3F4F6] relative ${selectedChatId === null ? "hidden md:flex" : "flex"}`}
      >
        {activeChat ? (
          <>
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10">
              <div className="flex items-center gap-3">
                {/* دکمه بازگشت در موبایل */}
                <button
                  onClick={() => setSelectedChatId(null)}
                  className="md:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  <ArrowRight size={20} />
                </button>

                <div
                  className={`w-10 h-10 rounded-full ${activeChat.avatarColor} flex items-center justify-center text-white shrink-0`}
                >
                  {activeChat.type === "group" ? (
                    <Hash size={18} />
                  ) : (
                    activeChat.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    {activeChat.name}
                  </h3>
                  <p className="text-[10px] text-slate-500">آنلاین</p>
                </div>
              </div>
              <div className="flex gap-3 text-slate-400">
                <Phone size={20} />
                <MoreVertical size={20} />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
              {/* پیام‌ها */}
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex w-full ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      msg.isMe
                        ? "bg-orange-500 text-white rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1 text-left ${msg.isMe ? "text-orange-100" : "text-slate-400"}`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="پیام..."
                  className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-orange-500 text-white p-3 rounded-xl"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-400">
            <p>یک گفتگو را انتخاب کنید</p>
          </div>
        )}
      </main>
    </div>
  );
}
