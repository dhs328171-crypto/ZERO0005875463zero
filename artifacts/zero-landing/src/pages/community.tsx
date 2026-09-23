import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MessageCircle, Zap, TrendingUp, Award, Star, ExternalLink, 
  BookOpen, Trophy, Heart, Share2, Calendar, Clock, Send, Smile,
  Paperclip, Image as ImageIcon, MoreVertical, ThumbsUp, Reply,
  CircleDot, Eye, Hash, AtSign, Bell, Settings, UserPlus, Search
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/i18n-context";
import { WHATSAPP_GROUP } from "@/lib/config";

// ============================================
// REAL COMMUNITY DATA
// ============================================

const stats = [
  { label: "عضو نشط", value: "2,400+", icon: Users },
  { label: "رسالة اليوم", value: "500+", icon: MessageCircle },
  { label: "مشروع مكتمل", value: "52+", icon: Zap },
  { label: "معدل النشاط", value: "98%", icon: TrendingUp },
];

// Real WhatsApp Channels
const channels = [
  { 
    name: "جروب ZERO للمطورين العرب", 
    desc: "الجروب الرئيسي - نقاشات تقنية • مساعدة متبادلة • فرص عمل • مشاريع مشتركة", 
    members: "580+", 
    online: 45,
    href: WHATSAPP_GROUP, 
    color: "border-green-400/30 bg-green-400/5 hover:bg-green-400/10", 
    icon: "💬",
    type: "group",
    isOfficial: true,
    isActive: true
  },
  { 
    name: "قناة الأخبار والتحديثات", 
    desc: "إعلانات حصرية • نصائح يومية • تحديثات المشاريع • فرص تعلم مجانية", 
    members: "1,200+", 
    online: null,
    href: WHATSAPP_GROUP, 
    color: "border-primary/30 bg-primary/5 hover:bg-primary/10", 
    icon: "📢",
    type: "channel",
    isOfficial: true,
    isActive: true
  },
  {
    name: "مجتمع التعلم والشهادات 🎓",
    desc: "مخصص للكورسات - Python, freeCodeCamp, AWS - نساعد بعض ونتابع التقدم!",
    members: "120+",
    online: 23,
    href: WHATSAPP_GROUP,
    color: "border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10",
    icon: "📚",
    type: "group",
    isOfficial: true,
    isNew: true
  }
];

// Simulated Chat Messages (Real-feeling)
interface ChatMessage {
  id: number;
  user: {
    name: string;
    avatar: string;
    role?: string;
    badge?: string;
  };
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
  replies?: number;
  isOwn?: boolean;
  isSystem?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    user: { name: "أحمد المطور", avatar: "أ", role: "Full Stack Dev", badge: "⭐" },
    content: "يا جماعة! كله تمام؟ عندي سؤال مهم 😅\nحد هنا جرب React Server Components مع Next.js 15؟ عايز آرائكم قبل ما أبدأ مشروع جديد",
    time: "منذ 5 دقائق",
    reactions: [{ emoji: "👍", count: 8 }, { emoji: "🔥", count: 3 }],
    replies: 12,
  },
  {
    id: 2,
    user: { name: "سارة UX", avatar: "س", role: "UI Designer", badge: "🎨" },
    content: "أنا جربتها! ممتازة جداً للأداء بس محتاجة تتفهم الـ boundaries بين server و client components 👌",
    time: "منذ 3 دقائق",
    reactions: [{ emoji: "❤️", count: 5 }, { emoji: "✅", count: 7 }],
    replies: 4,
  },
  {
    id: 3,
    user: { name: "خالد DevOps", avatar: "خ", role: "DevOps Engineer", badge: "🚀" },
    content: "@أحمد_المطور أنا استخدمتها في مشروع حقيقي - الأداء تحسن 40%! بس انتبه لـ hydration errors 😉",
    time: "منذ دقيقة",
    reactions: [{ emoji: "💪", count: 4 }],
    replies: 2,
    isOwn: false,
  },
  {
    id: 4,
    user: { name: "نورة Backend", avatar: "ن", role: "Backend Dev", badge: "💡" },
    content: "🎉 يا جماعة! خلصت كورس Python من Sololearn! شكراً للي ساعدني 💙\nالخطوة الجاية: freeCodeCamp Full Stack! حد يبي يjoinني؟",
    time: "منذ 10 دقائق",
    reactions: [{ emoji: "🎉", count: 15 }, { emoji: "🐍", count: 8 }, { emoji: "💪", count: 10 }],
    replies: 23,
  },
  {
    id: 5,
    user: { name: "ZERO", avatar: "Z", role: "Admin", badge: "👑" },
    content: "📢 **إعلان مهم**\nمبارك يا نورة! 🏆 \nوإعلان لكل المجتمع: هبدأ **تحدي Python الشهري** - كل الأسبوع بنحل challenge ونختار أفضل حل\nالجوائز: شهادة Udemy مجانية + feature في الموقع!\n🔗 التفاصيل في القناة الرسمية",
    time: "منذ 15 دقيقة",
    reactions: [{ emoji: "🔥", count: 25 }, { emoji: "🎯", count: 18 }, { emoji: "👏", count: 12 }],
    replies: 34,
    isSystem: true,
  },
];

// Active Members (Online Now)
const onlineMembers = [
  { name: "أحمد المطور", avatar: "أ", status: "online", role: "Full Stack", lastSeen: "الآن" },
  { name: "سارة UX", avatar: "س", status: "online", role: "Designer", lastSeen: "الآن" },
  { name: "خالد DevOps", avatar: "خ", status: "online", role: "DevOps", lastSeen: "الآن" },
  { name: "نورة Backend", avatar: "ن", status: "online", role: "Backend", lastSeen: "قبل 2 د" },
  { name: "محمد مبتدئ", avatar: "م", status: "idle", role: "Learner", lastSeen: "قبل 5 د" },
  { name: "فاطمة Frontend", avatar: "ف", status: "online", role: "Frontend", lastSeen: "الآن" },
  { name: "عمر Node.js", avatar: "ع", status: "dnd", role: "Backend", lastSeen: "مشغول" },
  { name: "ريم React", avatar: "ر", status: "offline", role: "Frontend", lastSeen: "قبل ساعة" },
];

// Hot Topics
const topics = [
  { title: "🐍 رحلتي في تعلم Python - من الصفر لـ 90%!", author: "نورة Backend", replies: 45, views: 2100, hot: true, hasAnswer: true },
  { title: "React vs Vue vs Svelte 2026 - أيهما تختار؟", author: "أحمد المطور", replies: 34, views: 1240, hot: true, hasAnswer: false },
  { title: "كيف تجيب أول عميل كمطور مستقل؟ (تجربة عملية)", author: "ZERO", replies: 61, views: 3400, hot: true, hasAnswer: true },
  { title: "Supabase vs Firebase vs Appwrite - مقارنة شاملة", author: "خالد DevOps", replies: 22, views: 890, hot: false, hasAnswer: true },
  { title: "TypeScript Tips - 10 أشياء غيرت طريقة برمجتي", author: "سارة UX", replies: 28, views: 1100, hot: false, hasAnswer: true },
  { title: "Docker للمبتدئين - شرح بالعربي مع أمثلة", author: "عمر Node.js", replies: 19, views: 760, hot: false, hasAnswer: false },
];

// Learning Community Data
const learningCommunity = {
  currentChallenge: {
    title: "🐍 تحدي Python الأسبوعي",
    description: "ابني CLI Todo App بايثون",
    participants: 12,
    deadline: "3 أيام",
    prize: "شهادة Udemy مجانية",
  },
  leaderboard: [
    { name: "نورة Backend", progress: 90, course: "Python", streak: 15 },
    { name: "محمد مبتدئ", progress: 65, course: "JavaScript", streak: 7 },
    { name: "فاطمة Frontend", progress: 45, course: "React", streak: 12 },
    { name: "أحمد المطور", progress: 30, course: "AWS", streak: 3 },
  ],
};

export default function Community() {
  const { dir } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "chat" | "members" | "learning">("feed");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now(),
      user: { name: "أنت", avatar: "أ" },
      content: newMessage,
      time: "الآن",
      reactions: [],
      isOwn: true,
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleReaction = (msgId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === msgId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }],
          };
        }
      }
      return msg;
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navbar />
      <main className="pt-24">
        
        {/* Hero */}
        <section className="py-12 px-4 relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-right">
                  <p className="font-mono text-xs text-primary mb-2">()COMMUNITY.NETWORK //</p>
                  <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    مجتمع <span className="text-primary glow-cyan-text">ZERO</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl">
                    مجتمع مطورين عرب حقيقي — تعلم، شارك، وانمو معنا 💙
                    <br />
                    <span className="text-sm text-primary/80">🎓 خاص: مجتمع تعلم للكورسات والشهادات</span>
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-3 text-center min-w-[80px]">
                      <s.icon size={16} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-primary font-mono">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button className="bg-green-500 text-white hover:bg-green-600 glow-cyan" size="lg" asChild>
                  <a href="/contact" target="_blank">
                    <MessageCircle size={16} className="ml-2" />
                    انضم للجروب (واتساب حقيقي)
                  </a>
                </Button>
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/5" asChild>
                  <a href="/contact" target="_blank">
                    <Share2 size={16} className="ml-2" />
                    القناة الرسمية
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="px-4 py-4 sticky top-20 md:top-24 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'feed' as const, label: '📰 الخلاصة', count: topics.length },
                { id: 'chat' as const, label: '💬 الشات المباشر', count: onlineMembers.filter(m => m.status === 'online').length },
                { id: 'members' as const, label: '👥 الأعضاء', count: onlineMembers.length },
                { id: 'learning' as const, label: '🎓 التعلم', count: learningCommunity.leaderboard.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:bg-card"
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <div className="container mx-auto max-w-6xl px-4 py-6">
          
          {/* ==================== FEED TAB ==================== */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Hash size={18} className="text-primary" />
                  أحدث النقاشات
                </h2>

                {topics.map((topic, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.hot && (
                            <span className="text-[10px] font-mono bg-red-400/10 text-red-400 border border-red-400/20 px-1.5 py-0.5 rounded">
                              🔥 رائج
                            </span>
                          )}
                          {topic.hasAnswer && (
                            <span className="text-[10px] font-mono bg-green-400/10 text-green-400 border border-green-400/20 px-1.5 py-0.5 rounded">
                              ✅ تمت الإجابة
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {topic.title}
                        </h3>
                      </div>
                      <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                      <span className="font-mono">{topic.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><MessageCircle size={10} /> {topic.replies} رد</span>
                        <span className="flex items-center gap-1"><Eye size={10} /> {topic.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Channels */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <MessageCircle size={14} className="text-primary" />
                    قنوات التواصل
                  </h3>
                  <div className="space-y-2">
                    {channels.map((ch, i) => (
                      <a
                        key={i}
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-3 rounded-lg border ${ch.color} transition-all group`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{ch.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs truncate group-hover:text-primary transition-colors">{ch.name}</span>
                              {ch.isNew && <span className="text-[8px] bg-primary text-white px-1 rounded">جديد</span>}
                              {ch.isActive && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{ch.desc}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <Users size={8} /> {ch.members}
                              {ch.online && <><span className="text-green-400">•</span> {ch.online} أونلاين</>}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Online Now */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    أونلاين الآن ({onlineMembers.filter(m => m.status === 'online').length})
                  </h3>
                  <div className="space-y-2">
                    {onlineMembers.slice(0, 5).map((member, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-background transition-colors">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border flex items-center justify-center text-xs font-bold ${
                            member.status === 'online' ? 'border-green-400' :
                            member.status === 'idle' ? 'border-yellow-400' :
                            member.status === 'dnd' ? 'border-red-400' : 'border-border'
                          }`}>
                            {member.avatar}
                          </div>
                          {(member.status === 'online' || member.status === 'idle') && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                              member.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground">{member.role} • {member.lastSeen}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CHAT TAB ==================== */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                        <MessageCircle size={18} className="text-green-400" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-card animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">شات المجتمع</h3>
                      <p className="text-[10px] text-green-400">{onlineMembers.filter(m => m.status === 'online').length} أونلاين</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Search size={14} />
                    </Button>
                    <a
                      href="/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600 transition-all"
                    >
                      <ExternalLink size={12} />
                      افتح في واتساب
                    </a>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-background/50">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        {!msg.isSystem && (
                          <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                            msg.isOwn 
                              ? 'bg-primary/20 border-primary/30 text-primary' 
                              : 'bg-card border-border'
                          }`}>
                            {msg.user.avatar}
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`max-w-[70%] ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          {/* User Name (not for own messages) */}
                          {!msg.isOwn && !msg.isSystem && (
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-xs font-semibold">{msg.user.name}</span>
                              {msg.user.badge && <span className="text-[10px]">{msg.user.badge}</span>}
                              {msg.user.role && <span className="text-[10px] text-muted-foreground">{msg.user.role}</span>}
                            </div>
                          )}
                          
                          {/* System message styling */}
                          {msg.isSystem ? (
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 w-full">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">👑</span>
                                <span className="font-semibold text-sm text-primary">{msg.user.name}</span>
                                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Admin</span>
                              </div>
                              <p className="text-sm whitespace-pre-line">{msg.content}</p>
                            </div>
                          ) : (
                            <div className={`rounded-2xl px-4 py-2.5 ${
                              msg.isOwn 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-card border border-border rounded-tl-none'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{msg.content}</p>
                            </div>
                          )}
                          
                          {/* Time & Reactions */}
                          <div className={`flex items-center gap-2 px-1 ${msg.isOwn ? 'justify-end' : ''}`}>
                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                            
                            {/* Reactions */}
                            {msg.reactions.length > 0 && (
                              <div className="flex gap-1">
                                {msg.reactions.map((r, i) => (
                                  <button
                                    key={i}
                                    onClick={() => !msg.isOwn && handleReaction(msg.id, r.emoji)}
                                    className="flex items-center gap-0.5 text-[10px] bg-background border border-border rounded-full px-1.5 py-0.5 hover:border-primary/30 transition-all"
                                  >
                                    <span>{r.emoji}</span>
                                    <span className="text-muted-foreground">{r.count}</span>
                                  </button>
                                ))}
                                <button className="text-[10px] text-muted-foreground hover:text-primary">♥️</button>
                              </div>
                            )}
                            
                            {msg.replies !== undefined && msg.replies > 0 && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Reply size={8} /> {msg.replies}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4 bg-card">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Paperclip size={18} />
                      </button>
                      <button className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <ImageIcon size={18} />
                      </button>
                    </div>
                    
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="اكتب رسالتك..."
                        className="pr-10 min-h-[42px]"
                      />
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Smile size={16} />
                      </button>
                    </div>
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary hover:bg-primary/90 px-4"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    ⚠️ هذا شات تجريبي - للدردشة الحقيقية انقر "افتح في واتساب"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MEMBERS TAB ==================== */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 flex items-center justify-center text-lg font-bold ${
                        member.status === 'online' ? 'border-green-400' :
                        member.status === 'idle' ? 'border-yellow-400' :
                        member.status === 'dnd' ? 'border-red-400' : 'border-border'
                      }`}>
                        {member.avatar}
                      </div>
                      {(member.status === 'online' || member.status === 'idle') && (
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                          member.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock size={8} /> {member.lastSeen}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                      <MessageCircle size={12} className="ml-1" />
                      رسالة
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      <UserPlus size={12} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ==================== LEARNING TAB ==================== */}
          {activeTab === 'learning' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Current Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 cyber-grid opacity-5" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded-full">🔥 فعال الآن</span>
                      <h3 className="text-xl font-bold mt-2">{learningCommunity.currentChallenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{learningCommunity.currentChallenge.description}</p>
                    </div>
                    <Trophy size={40} className="text-yellow-400/50" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{learningCommunity.currentChallenge.participants}</div>
                      <div className="text-xs text-muted-foreground">مشارك</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-400">{learningCommunity.currentChallenge.deadline}</div>
                      <div className="text-xs text-muted-foreground">متبقي</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">🏆</div>
                      <div className="text-xs text-muted-foreground">{learningCommunity.currentChallenge.prize}</div>
                    </div>
                  </div>
                  
                  <Button className="mt-4 w-full" asChild>
                    <a href="/contact" target="_blank">
                      <BookOpen size={16} className="ml-2" />
                      انضم للتحدي
                    </a>
                  </Button>
                </div>
              </motion.div>

              {/* Leaderboard */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-400" />
                  لوحة المتصدرين - رحلة التعلم
                </h3>
                
                <div className="space-y-3">
                  {learningCommunity.leaderboard.map((user, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-background/50 rounded-xl">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-400' :
                        i === 2 ? 'bg-orange-400/20 text-orange-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{i + 1}
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold">
                        {user.name[0]}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.course}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary font-mono">{user.progress}%</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                          🔥 {user.streak} يوم
                        </div>
                      </div>
                      
                      <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${user.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Progress Card */}
              <div className="bg-card border border-primary/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" />
                  تقدمي الشخصي
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>🐍 Python Certificate (Sololearn)</span>
                      <span className="font-mono text-primary">90%</span>
                    </div>
                    <div className="h-3 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: '90%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-3">الأهداف القادمة:</p>
                    <div className="space-y-2">
                      {[
                        { goal: "freeCodeCamp Full Stack", status: "قريباً", icon: "🏆" },
                        { goal: "JavaScript Algorithms", status: "مخطط", icon: "⚡" },
                        { goal: "AWS Cloud Practitioner", status: "2027", icon: "☁️" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                          <span>{item.icon}</span>
                          <span className="flex-1 text-sm">{item.goal}</span>
                          <span className="text-xs font-mono text-muted-foreground">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Final CTA */}
        <section className="py-12 px-4 mt-8 border-t border-border">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heart size={48} className="mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">مستنايناك! 💙</h3>
              <p className="text-muted-foreground mb-6">
                سواء كنت مبتدئ أو محترف، مجتمع ZERO بيتك الثاني.
                <br />
                <span className="text-primary font-medium">تعلم • ساعد • انمو</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" asChild>
                  <a href="/contact" target="_blank">
                    <MessageCircle size={18} className="ml-2" />
                    انضم للجروب (مجاناً)
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 text-primary" asChild>
                  <a href="/cv">
                    <BookOpen size={18} className="ml-2" />
                    شاهد رحلتي التعليمية
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
