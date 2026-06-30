"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Trash2, AlertCircle, Maximize2, Minimize2, Plus, MessageSquare } from "lucide-react";
import { apiService } from "@/services/api";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Message = {
  role: "user" | "ai";
  content: string;
};

type ChatSession = {
  id: string; // Local frontend ID
  difyId: string; // Backend conversation ID
  title: string;
  updatedAt: number;
  messages: Message[];
};

const INITIAL_MESSAGE: Message = { 
  role: "ai", 
  content: "Hello! I'm your iFixApple Genius. What seems to be the issue with your device today?" 
};

const GUEST_MESSAGE_LIMIT = 5;

// Helper to generate IDs safely across browsers
const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

// --- Custom Markdown Parsers for AI Responses ---
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-apple-dark">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const parseMarkdown = (text: string) => {
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Handle Headers (###)
    if (trimmedLine.startsWith('### ')) {
      return (
        <h3 key={index} className="text-base font-bold mt-4 mb-2 text-apple-dark border-b border-gray-100 pb-1">
          {parseBold(trimmedLine.substring(4))}
        </h3>
      );
    }
    // Handle Bullet Points (* or -)
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      return (
        <div key={index} className="flex items-start mt-2">
          <span className="mr-2 text-apple-blue font-bold">•</span>
          <span className="flex-1">{parseBold(trimmedLine.substring(2))}</span>
        </div>
      );
    }
    // Handle empty lines for spacing
    if (trimmedLine === '') {
      return <div key={index} className="h-3"></div>;
    }
    // Handle normal text paragraphs
    return <p key={index} className="mb-2 last:mb-0 text-gray-700 leading-relaxed">{parseBold(line)}</p>;
  });
};
// ----------------------------------------------

export default function ChatInterface() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat History & Session State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  
  // Auth & Limits state
  const [session, setSession] = useState<any>(null);
  const [guestCount, setGuestCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load session, chat history, and limits on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Limits
      const savedGuestCount = localStorage.getItem("ifix_guest_count");
      if (savedGuestCount) setGuestCount(parseInt(savedGuestCount, 10));

      // Load Sessions
      const savedSessions = localStorage.getItem("ifix_chat_sessions");
      let loadedSessions: ChatSession[] = [];
      
      if (savedSessions) {
        try {
          loadedSessions = JSON.parse(savedSessions);
          setSessions(loadedSessions);
        } catch (e) {
          console.error("Failed to parse chat sessions");
        }
      }

      // Restore last active session or create a new one
      if (loadedSessions.length > 0) {
        const mostRecent = loadedSessions[0];
        setCurrentSessionId(mostRecent.id);
        setConversationId(mostRecent.difyId || "");
        setMessages(mostRecent.messages || [INITIAL_MESSAGE]);
      } else {
        const newId = generateId();
        setCurrentSessionId(newId);
      }

      // Load Supabase Auth Session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // 2. Save current session whenever messages change
  useEffect(() => {
    if (!currentSessionId) return;

    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === currentSessionId);
      
      // Auto-generate title from first user message
      const titleText = messages.find(m => m.role === "user")?.content || "New Conversation";
      const title = titleText.length > 30 ? titleText.substring(0, 30) + "..." : titleText;

      const currentSession: ChatSession = {
        id: currentSessionId,
        difyId: conversationId,
        title: title,
        updatedAt: Date.now(),
        messages: messages
      };

      let newSessions;
      if (existingIndex >= 0) {
        newSessions = [...prev];
        newSessions[existingIndex] = currentSession;
      } else {
        // Don't clutter history with completely empty sessions
        if (messages.length === 1) return prev;
        newSessions = [currentSession, ...prev];
      }

      // Sort so newest is at top
      newSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem("ifix_chat_sessions", JSON.stringify(newSessions));
      return newSessions;
    });
  }, [messages, conversationId, currentSessionId]);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Listen for custom event from the Landing Page button
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      if (window.innerWidth >= 768) setIsExpanded(true); // Auto-expand on desktop if triggered by main button
    };
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  // Session Management Functions
  const handleNewChat = () => {
    const newId = generateId();
    setCurrentSessionId(newId);
    setConversationId("");
    setMessages([INITIAL_MESSAGE]);
    if (window.innerWidth < 768) setIsExpanded(false); // Close sidebar on mobile after selecting
  };

  const handleSelectSession = (selected: ChatSession) => {
    setCurrentSessionId(selected.id);
    setConversationId(selected.difyId);
    setMessages(selected.messages);
    if (window.innerWidth < 768) setIsExpanded(false);
  };

  const clearCurrentChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== currentSessionId);
        localStorage.setItem("ifix_chat_sessions", JSON.stringify(filtered));
        return filtered;
      });
      handleNewChat();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // --- Check Guest Limits ---
    if (!session && guestCount >= GUEST_MESSAGE_LIMIT) {
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: "You've reached your free guest message limit! Please log in or sign up to continue chatting and keep your conversation history secure." }
      ]);
      setInput("");
      return;
    }

    const userMsg = input.trim();
    setInput("");
    
    // Optimistically update UI
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    // Update guest message tracker
    if (!session) {
      const newCount = guestCount + 1;
      setGuestCount(newCount);
      localStorage.setItem("ifix_guest_count", newCount.toString());
    }

    try {
      // Pass the conversationId to maintain AI context, and the real User ID if logged in
      const userId = session?.user?.id || "guest_user";
      const data = await apiService.chat(userMsg, conversationId, userId);
      
      // Save the conversation ID returned by the API so the AI remembers the context
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }
      
      setMessages([...newMessages, { role: "ai", content: data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages, 
        { role: "ai", content: "I'm having a bit of trouble connecting right now. Please try again in a moment." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Construct Welcome text based on auth state
  const welcomeText = session?.user?.email 
    ? `Welcome back, ${session.user.email.split('@')[0]}!` 
    : "Welcome, Guest!";

  return (
    <>
      {/* Floating Action Button with updated AI gradient and icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-tr from-blue-600 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Dynamic Overlay & Window */}
      <div 
        className={`fixed z-50 flex overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-2xl
          ${!isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
          ${isExpanded
            ? 'inset-0 sm:inset-6 sm:rounded-[2rem] flex-row'
            : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] sm:rounded-3xl flex-col origin-bottom-right'
          }
        `}
      >
        {/* Left Sidebar (Only visible when Expanded) */}
        {isExpanded && (
          <div className="hidden md:flex flex-col w-80 bg-gray-50 border-r border-gray-200 h-full shrink-0">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
               <h2 className="font-semibold text-apple-dark text-lg">Chat History</h2>
               <button 
                onClick={handleNewChat} 
                className="p-2 bg-blue-50 text-apple-blue rounded-full hover:bg-blue-100 transition-colors"
                title="New Chat"
              >
                 <Plus className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
               {sessions.map(s => (
                 <button
                   key={s.id}
                   onClick={() => handleSelectSession(s)}
                   className={`w-full text-left p-4 rounded-2xl flex items-start space-x-3 transition-all ${
                     s.id === currentSessionId 
                      ? 'bg-white shadow-sm border border-gray-200 ring-1 ring-black/5' 
                      : 'hover:bg-gray-100/80 border border-transparent'
                   }`}
                 >
                    <MessageSquare className={`w-5 h-5 mt-0.5 shrink-0 ${s.id === currentSessionId ? 'text-apple-blue' : 'text-gray-400'}`} />
                    <div className="flex-1 overflow-hidden">
                       <p className={`text-sm font-semibold truncate ${s.id === currentSessionId ? 'text-apple-dark' : 'text-gray-600'}`}>
                         {s.title}
                       </p>
                       <p className="text-xs text-gray-400 mt-1">{new Date(s.updatedAt).toLocaleDateString()}</p>
                    </div>
                 </button>
               ))}
               
               {sessions.length === 0 && (
                 <div className="text-center flex flex-col items-center justify-center h-40 opacity-60">
                   <MessageCircle className="w-8 h-8 text-gray-300 mb-2" />
                   <span className="text-sm text-gray-500 font-medium">No previous chats.</span>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative min-w-0">
          
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center space-x-3">
              {/* Updated Premium Avatar */}
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-apple-blue to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-apple-dark text-sm sm:text-base">
                   {welcomeText}
                </h3>
                <p className="text-xs text-green-500 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  iFix Genius Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Maximize / Minimize Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-apple-dark transition-colors p-2 rounded-full hover:bg-gray-100 hidden sm:block"
                title={isExpanded ? "Minimize" : "Expand to Full Page"}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              
              {/* Clear Current Chat */}
              {messages.length > 1 && (
                <button 
                  onClick={clearCurrentChat} 
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Delete Conversation"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              
              {/* Close Window */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-apple-dark transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Guest Warning Banner */}
          {!session && (
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between text-xs sm:text-sm text-blue-800 shrink-0">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">Sign in to save history. ({GUEST_MESSAGE_LIMIT - guestCount} messages left)</span>
              </div>
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="font-bold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors shrink-0 ml-4 shadow-sm"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-apple-gray/30 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] sm:max-w-[80%] rounded-3xl px-5 py-3.5 text-[15px] shadow-sm
                  ${msg.role === "user" 
                    ? "bg-apple-blue text-white rounded-br-sm" 
                    : "bg-white text-apple-dark border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {/* Applying our custom markdown parser to the AI messages! */}
                  {msg.role === "ai" ? parseMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-sm px-5 py-3.5 flex items-center space-x-3 shadow-sm">
                  <Loader2 className="w-5 h-5 text-apple-blue animate-spin" />
                  <span className="text-sm text-gray-500 font-medium">Genius is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={!session && guestCount >= GUEST_MESSAGE_LIMIT ? "Limit reached. Please log in." : "Describe your device issue..."}
                disabled={!session && guestCount >= GUEST_MESSAGE_LIMIT}
                className="w-full bg-apple-gray border border-transparent focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 rounded-full pl-6 pr-14 py-4 text-[15px] text-apple-dark placeholder-gray-400 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || (!session && guestCount >= GUEST_MESSAGE_LIMIT)}
                className="absolute right-2 p-3 bg-apple-blue text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-gray-400 shadow-sm"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { MessageCircle, X, Send, Bot, Loader2, Trash2, AlertCircle, Maximize2, Minimize2, Plus, MessageSquare } from "lucide-react";
// import { apiService } from "@/services/api";
// import { supabase } from "@/lib/supabase";
// import Link from "next/link";

// type Message = {
//   role: "user" | "ai";
//   content: string;
// };

// type ChatSession = {
//   id: string; // Local frontend ID
//   difyId: string; // Backend conversation ID
//   title: string;
//   updatedAt: number;
//   messages: Message[];
// };

// const INITIAL_MESSAGE: Message = { 
//   role: "ai", 
//   content: "Hello! I'm your iFixApple Genius. What seems to be the issue with your device today?" 
// };

// const GUEST_MESSAGE_LIMIT = 5;

// // Helper to generate IDs safely across browsers
// const generateId = () => {
//   return typeof crypto !== 'undefined' && crypto.randomUUID 
//     ? crypto.randomUUID() 
//     : Math.random().toString(36).substring(2, 15);
// };

// export default function ChatInterface() {
//   // UI State
//   const [isOpen, setIsOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Chat History & Session State
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string>("");
//   const [conversationId, setConversationId] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  
//   // Auth & Limits state
//   const [session, setSession] = useState<any>(null);
//   const [guestCount, setGuestCount] = useState(0);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // 1. Load session, chat history, and limits on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Load Limits
//       const savedGuestCount = localStorage.getItem("ifix_guest_count");
//       if (savedGuestCount) setGuestCount(parseInt(savedGuestCount, 10));

//       // Load Sessions
//       const savedSessions = localStorage.getItem("ifix_chat_sessions");
//       let loadedSessions: ChatSession[] = [];
      
//       if (savedSessions) {
//         try {
//           loadedSessions = JSON.parse(savedSessions);
//           setSessions(loadedSessions);
//         } catch (e) {
//           console.error("Failed to parse chat sessions");
//         }
//       }

//       // Restore last active session or create a new one
//       if (loadedSessions.length > 0) {
//         const mostRecent = loadedSessions[0];
//         setCurrentSessionId(mostRecent.id);
//         setConversationId(mostRecent.difyId || "");
//         setMessages(mostRecent.messages || [INITIAL_MESSAGE]);
//       } else {
//         const newId = generateId();
//         setCurrentSessionId(newId);
//       }

//       // Load Supabase Auth Session
//       supabase.auth.getSession().then(({ data: { session } }) => {
//         setSession(session);
//       });

//       const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//         setSession(session);
//       });

//       return () => subscription.unsubscribe();
//     }
//   }, []);

//   // 2. Save current session whenever messages change
//   useEffect(() => {
//     if (!currentSessionId) return;

//     setSessions(prev => {
//       const existingIndex = prev.findIndex(s => s.id === currentSessionId);
      
//       // Auto-generate title from first user message
//       const titleText = messages.find(m => m.role === "user")?.content || "New Conversation";
//       const title = titleText.length > 30 ? titleText.substring(0, 30) + "..." : titleText;

//       const currentSession: ChatSession = {
//         id: currentSessionId,
//         difyId: conversationId,
//         title: title,
//         updatedAt: Date.now(),
//         messages: messages
//       };

//       let newSessions;
//       if (existingIndex >= 0) {
//         newSessions = [...prev];
//         newSessions[existingIndex] = currentSession;
//       } else {
//         // Don't clutter history with completely empty sessions
//         if (messages.length === 1) return prev;
//         newSessions = [currentSession, ...prev];
//       }

//       // Sort so newest is at top
//       newSessions.sort((a, b) => b.updatedAt - a.updatedAt);
//       localStorage.setItem("ifix_chat_sessions", JSON.stringify(newSessions));
//       return newSessions;
//     });
//   }, [messages, conversationId, currentSessionId]);

//   // Auto-scroll to the bottom of the chat
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isOpen]);

//   // Listen for custom event from the Landing Page button
//   useEffect(() => {
//     const handleOpenChat = () => {
//       setIsOpen(true);
//       if (window.innerWidth >= 768) setIsExpanded(true); // Auto-expand on desktop if triggered by main button
//     };
//     window.addEventListener("open-chat", handleOpenChat);
//     return () => window.removeEventListener("open-chat", handleOpenChat);
//   }, []);

//   // Session Management Functions
//   const handleNewChat = () => {
//     const newId = generateId();
//     setCurrentSessionId(newId);
//     setConversationId("");
//     setMessages([INITIAL_MESSAGE]);
//     if (window.innerWidth < 768) setIsExpanded(false); // Close sidebar on mobile after selecting
//   };

//   const handleSelectSession = (selected: ChatSession) => {
//     setCurrentSessionId(selected.id);
//     setConversationId(selected.difyId);
//     setMessages(selected.messages);
//     if (window.innerWidth < 768) setIsExpanded(false);
//   };

//   const clearCurrentChat = () => {
//     if (window.confirm("Are you sure you want to clear this conversation?")) {
//       setSessions(prev => {
//         const filtered = prev.filter(s => s.id !== currentSessionId);
//         localStorage.setItem("ifix_chat_sessions", JSON.stringify(filtered));
//         return filtered;
//       });
//       handleNewChat();
//     }
//   };

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // --- Check Guest Limits ---
//     if (!session && guestCount >= GUEST_MESSAGE_LIMIT) {
//       setMessages((prev) => [
//         ...prev, 
//         { role: "ai", content: "You've reached your free guest message limit! Please log in or sign up to continue chatting and keep your conversation history secure." }
//       ]);
//       setInput("");
//       return;
//     }

//     const userMsg = input.trim();
//     setInput("");
    
//     // Optimistically update UI
//     const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
//     setMessages(newMessages);
//     setIsLoading(true);

//     // Update guest message tracker
//     if (!session) {
//       const newCount = guestCount + 1;
//       setGuestCount(newCount);
//       localStorage.setItem("ifix_guest_count", newCount.toString());
//     }

//     try {
//       // Pass the conversationId to maintain AI context, and the real User ID if logged in
//       const userId = session?.user?.id || "guest_user";
//       const data = await apiService.chat(userMsg, conversationId, userId);
      
//       // Save the conversation ID returned by the API so the AI remembers the context
//       if (data.conversation_id && data.conversation_id !== conversationId) {
//         setConversationId(data.conversation_id);
//       }
      
//       setMessages([...newMessages, { role: "ai", content: data.answer }]);
//     } catch (error) {
//       console.error(error);
//       setMessages([
//         ...newMessages, 
//         { role: "ai", content: "I'm having a bit of trouble connecting right now. Please try again in a moment." }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Construct Welcome text based on auth state
//   const welcomeText = session?.user?.email 
//     ? `Welcome back, ${session.user.email.split('@')[0]}!` 
//     : "Welcome, Guest!";

//   return (
//     <>
//       {/* Floating Action Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className={`fixed bottom-6 right-6 p-4 bg-apple-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       {/* Dynamic Overlay & Window */}
//       <div 
//         className={`fixed z-50 flex overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-2xl
//           ${!isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
//           ${isExpanded
//             ? 'inset-0 sm:inset-6 sm:rounded-[2rem] flex-row'
//             : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] sm:rounded-3xl flex-col origin-bottom-right'
//           }
//         `}
//       >
//         {/* Left Sidebar (Only visible when Expanded) */}
//         {isExpanded && (
//           <div className="hidden md:flex flex-col w-80 bg-gray-50 border-r border-gray-200 h-full shrink-0">
//             <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
//                <h2 className="font-semibold text-apple-dark text-lg">Chat History</h2>
//                <button 
//                 onClick={handleNewChat} 
//                 className="p-2 bg-blue-50 text-apple-blue rounded-full hover:bg-blue-100 transition-colors"
//                 title="New Chat"
//               >
//                  <Plus className="w-5 h-5" />
//                </button>
//             </div>
            
//             <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
//                {sessions.map(s => (
//                  <button
//                    key={s.id}
//                    onClick={() => handleSelectSession(s)}
//                    className={`w-full text-left p-4 rounded-2xl flex items-start space-x-3 transition-all ${
//                      s.id === currentSessionId 
//                       ? 'bg-white shadow-sm border border-gray-200 ring-1 ring-black/5' 
//                       : 'hover:bg-gray-100/80 border border-transparent'
//                    }`}
//                  >
//                     <MessageSquare className={`w-5 h-5 mt-0.5 shrink-0 ${s.id === currentSessionId ? 'text-apple-blue' : 'text-gray-400'}`} />
//                     <div className="flex-1 overflow-hidden">
//                        <p className={`text-sm font-semibold truncate ${s.id === currentSessionId ? 'text-apple-dark' : 'text-gray-600'}`}>
//                          {s.title}
//                        </p>
//                        <p className="text-xs text-gray-400 mt-1">{new Date(s.updatedAt).toLocaleDateString()}</p>
//                     </div>
//                  </button>
//                ))}
               
//                {sessions.length === 0 && (
//                  <div className="text-center flex flex-col items-center justify-center h-40 opacity-60">
//                    <MessageCircle className="w-8 h-8 text-gray-300 mb-2" />
//                    <span className="text-sm text-gray-500 font-medium">No previous chats.</span>
//                  </div>
//                )}
//             </div>
//           </div>
//         )}

//         {/* Main Chat Area */}
//         <div className="flex-1 flex flex-col h-full relative min-w-0">
          
//           {/* Header */}
//           <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 z-10">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-apple-blue rounded-full flex items-center justify-center shadow-sm">
//                 <Bot className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-apple-dark text-sm sm:text-base">
//                    {welcomeText}
//                 </h3>
//                 <p className="text-xs text-green-500 font-medium flex items-center">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
//                   iFix Genius Online
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               {/* Maximize / Minimize Toggle */}
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="text-gray-400 hover:text-apple-dark transition-colors p-2 rounded-full hover:bg-gray-100 hidden sm:block"
//                 title={isExpanded ? "Minimize" : "Expand to Full Page"}
//               >
//                 {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//               </button>
              
//               {/* Clear Current Chat */}
//               {messages.length > 1 && (
//                 <button 
//                   onClick={clearCurrentChat} 
//                   className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
//                   title="Delete Conversation"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               )}
              
//               {/* Close Window */}
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="text-gray-400 hover:text-apple-dark transition-colors p-2 rounded-full hover:bg-gray-100"
//                 title="Close"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           {/* Guest Warning Banner */}
//           {!session && (
//             <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between text-xs sm:text-sm text-blue-800 shrink-0">
//               <div className="flex items-center space-x-2">
//                 <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
//                 <span className="font-medium">Sign in to save history. ({GUEST_MESSAGE_LIMIT - guestCount} messages left)</span>
//               </div>
//               <Link 
//                 href="/login" 
//                 onClick={() => setIsOpen(false)}
//                 className="font-bold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors shrink-0 ml-4 shadow-sm"
//               >
//                 Log In
//               </Link>
//             </div>
//           )}

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-apple-gray/30 custom-scrollbar">
//             {messages.map((msg, index) => (
//               <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm
//                   ${msg.role === "user" 
//                     ? "bg-apple-blue text-white rounded-br-sm" 
//                     : "bg-white text-apple-dark border border-gray-100 rounded-bl-sm"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-sm px-5 py-3.5 flex items-center space-x-3 shadow-sm">
//                   <Loader2 className="w-5 h-5 text-apple-blue animate-spin" />
//                   <span className="text-sm text-gray-500 font-medium">Genius is typing...</span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shrink-0">
//             <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={!session && guestCount >= GUEST_MESSAGE_LIMIT ? "Limit reached. Please log in." : "Describe your device issue..."}
//                 disabled={!session && guestCount >= GUEST_MESSAGE_LIMIT}
//                 className="w-full bg-apple-gray border border-transparent focus:bg-white focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 rounded-full pl-6 pr-14 py-4 text-[15px] text-apple-dark placeholder-gray-400 outline-none transition-all disabled:opacity-50"
//               />
//               <button
//                 type="submit"
//                 disabled={!input.trim() || isLoading || (!session && guestCount >= GUEST_MESSAGE_LIMIT)}
//                 className="absolute right-2 p-3 bg-apple-blue text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-gray-400 shadow-sm"
//               >
//                 <Send className="w-5 h-5 ml-0.5" />
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }