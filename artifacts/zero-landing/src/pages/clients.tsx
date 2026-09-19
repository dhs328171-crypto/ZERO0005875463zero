import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Award, Users, TrendingUp, Heart, Building2, Globe, CheckCircle, ArrowRight, ArrowLeft, Filter, Search, X } from "lucide-react";
import { Counter } from "@/components/ui/counter";

// Enhanced testimonials with more details
const testimonials = [
  { 
    name: "أحمد السعيد", 
    company: "متجر الرياض", 
    role: "صاحب متجر إلكتروني", 
    rating: 5, 
    text: "ZERO غيّر تصوري للتطوير المحترف. الموقع اللي بناه يتحدث عن نفسه — سرعة خارقة وتصميم يبهر الزوار من أول لحظة. المبيعات ارتفعت 60% في أول شهر.", 
    project: "متجر إلكتروني + لوحة تحكم", 
    avatar: "أ", 
    color: "from-cyan-500/20 to-blue-500/20",
    industry: "تجارة إلكترونية",
    country: "🇸🇦 السعودية"
  },
  { 
    name: "سارة القحطاني", 
    company: "أزياء لمياء", 
    role: "مصممة أزياء", 
    rating: 5, 
    text: "تعاملت مع كثير من المطورين، لكن ZERO فئة منفردة. يفهم ما تريده قبل أن تشرحه، ويسلم في وقت أقل مما وعد. متجري الآن يحقق أرقاماً لم أتخيلها.", 
    project: "متجر ملابس + تطبيق موبايل", 
    avatar: "س", 
    color: "from-purple-500/20 to-pink-500/20",
    industry: "الأزياء والموضة",
    country: "🇸🇦 السعودية"
  },
  { 
    name: "شركة TechPro", 
    company: "TechPro Solutions", 
    role: "شركة تقنية", 
    rating: 5, 
    text: "نظام SaaS المعقد الذي بناه ZERO يعمل بسلاسة مطلقة منذ الإطلاق. لا أعطال، لا شكاوى. فريقنا وفّر 15 ساعة أسبوعياً بفضل الأتمتة التي صممها.", 
    project: "منصة SaaS للأعمال", 
    avatar: "ت", 
    color: "from-green-500/20 to-emerald-500/20",
    industry: "تقنية المعلومات",
    country: "🇦🇪 الإمارات"
  },
  { 
    name: "د. محمد الغامدي", 
    company: "العيادة الخاصة", 
    role: "طبيب متخصص", 
    rating: 5, 
    text: "تطبيق الحجز حوّل عيادتي. الحجوزات ارتفعت 40% في أول شهر، والمرضى يثنون على سهولة الاستخدام. ZERO لا يبني مواقع، يبني تجارب.", 
    project: "تطبيق حجز عيادات", 
    avatar: "م", 
    color: "from-blue-500/20 to-cyan-500/20",
    industry: "الرعاية الصحية",
    country: "🇸🇦 السعودية"
  },
  { 
    name: "مجموعة الرياض", 
    company: "مجموعة الرياض العقارية", 
    role: "شركة عقارات", 
    rating: 5, 
    text: "موقع عقاراتنا أصبح مرجعاً في المنطقة. كل تفصيلة مصممة باحترافية مذهلة. العملاء يعودون للموقع مراراً وهذا ما يهمنا.", 
    project: "موقع عقارات + لوحة إدارة", 
    avatar: "ر", 
    color: "from-orange-500/20 to-yellow-500/20",
    industry: "العقارات",
    country: "🇸🇦 السعودية"
  },
  { 
    name: "أكاديمية النور", 
    company: "النور للتعليم", 
    role: "منصة تعليمية", 
    rating: 5, 
    text: "المنصة التعليمية تجاوزت توقعاتنا في كل شيء. سهولة الاستخدام للطلاب والمعلمين، سرعة رائعة، وتصميم يشجع على التعلم.", 
    project: "منصة تعليم إلكتروني", 
    avatar: "ن", 
    color: "from-yellow-500/20 to-orange-500/20",
    industry: "التعليم الإلكتروني",
    country: "🇯🇴 الأردن"
  },
];

// Client logos/companies
const clientLogos = [
  { name: "TechPro Solutions", category: "Technology" },
  { name: "متجر الرياض", category: "E-commerce" },
  { name: "أكاديمية النور", category: "Education" },
  { name: "مجموعة الرياض العقارية", category: "Real Estate" },
  { name: "عيادة د. محمد", category: "Healthcare" },
  { name: "أزياء لمياء", category: "Fashion" },
];

// Stats
const stats = [
  { value: 30, suffix: "+", label: "عميل سعيد", icon: <Users size={20} />, color: "text-primary" },
  { value: 100, suffix: "%", label: "معدل الرضا", icon: <Heart size={20} />, color: "text-red-400" },
  { value: 52, suffix: "+", label: "مشروع ناجح", icon: <Award size={20} />, color: "text-yellow-400" },
  { value: 4, suffix: ".9★", label: "متوسط التقييم", icon: <TrendingUp size={20} />, color: "text-green-400" },
];

// Industries served
const industries = [
  { name: "تجارة إلكترونية", count: 12, icon: "🛒" },
  { name: "تعليم وتدريب", count: 8, icon: "📚" },
  { name: "عقارات", count: 6, icon: "🏢" },
  { name: "رعاية صحية", count: 4, icon: "🏥" },
  { name: "تقنية المعلومات", count: 15, icon: "💻" },
  { name: "أزياء وموضة", count: 3, icon: "👗" },
];

type FilterType = 'all' | 'ecommerce' | 'saas' | 'mobile' | 'web';

export default function Clients() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(t => {
    if (searchQuery) {
      return t.name.includes(searchQuery) || t.company.includes(searchQuery) || t.text.includes(searchQuery);
    }
    return true;
  });

  // Get unique industries for filter
  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'الكل', count: testimonials.length },
    { value: 'ecommerce', label: 'متاجر إلكترونية', count: 2 },
    { value: 'saas', label: 'منصات SaaS', count: 1 },
    { value: 'mobile', label: 'تطبيقات موبايل', count: 1 },
    { value: 'web', label: 'مواقع ويب', count: 2 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
              <Building2 size={14} />
              clients.testimonials()
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              عملاؤنا و<span className="text-primary glow-cyan-text"> شركاء نجاحنا</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              نفتخر بثقة أكثر من 30 عميل ومنصة في مختلف القطاعات. كل مشروع هو قصة نجاح مشتركة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-12 bg-card/30 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="group p-6 bg-card/50 border border-border rounded-xl hover:border-primary/30 transition-all hover:bg-card">
                <div className={`flex justify-center mb-3 group-hover:scale-110 transition-transform ${s.color}`}>{s.icon}</div>
                <div className={`text-4xl font-bold font-mono mb-1 ${s.color}`}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries Served - NEW */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">قطاعات نخدمها</h2>
            <p className="text-muted-foreground">خبرة متنوعة في مجالات متعددة</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 hover:bg-card/80 transition-all group cursor-default"
              >
                <span className="text-3xl mb-2 block group-hover:scale-125 transition-transform">{ind.icon}</span>
                <p className="text-sm font-medium">{ind.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{ind.count} عميل</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter - NEW */}
      <section className="py-8 px-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عميل أو مشروع..."
                className="w-full bg-card border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter size={14} className="text-muted-foreground flex-shrink-0" />
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                    selectedFilter === opt.value
                      ? "bg-primary text-primary-foreground border-primary glow-cyan"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                  <span className="ml-1 opacity-70">({opt.count})</span>
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground font-mono mt-4">
            عرض {filteredTestimonials.length} من {testimonials.length} شهادة
          </p>
        </div>
      </section>

      {/* Testimonials Grid - Enhanced */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTestimonials.map((t, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all group relative overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Quote icon */}
                    <Quote size={28} className="text-primary/20 mb-4" />
                    
                    {/* Testimonial text */}
                    <p className="text-sm text-foreground leading-relaxed mb-6 line-clamp-4">{t.text}</p>
                    
                    {/* Rating */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Client info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{t.role}</span>
                          <span className="text-[10px]">{t.country}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project tag */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-primary/70 bg-primary/5 border border-primary/10 px-2 py-1 rounded-full">
                        📦 {t.project}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-background/50 border border-border px-2 py-1 rounded-full">
                        {t.industry}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Empty state */}
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-mono">لا توجد نتائج مطابقة للبحث</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                className="mt-4 text-primary hover:underline text-sm"
              >
                مسح الفلتر
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Client Logos Marquee - NEW */}
      <section className="py-12 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm text-muted-foreground font-mono">شركات وثقت بـ ZERO</p>
          </motion.div>
          
          <div className="overflow-hidden">
            <div className="flex gap-8 items-center justify-center animate-marquee">
              {[...clientLogos, ...clientLogos].map((client, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-card border border-border rounded-lg px-6 py-3 hover:border-primary/30 transition-all"
                >
                  <Globe size={16} className="text-primary mr-2" />
                  <span className="text-sm font-medium whitespace-nowrap">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h2 className="text-3xl font-bold mb-4">كن التالي في قائمة النجاحات</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                انضم لعائلة ZERO وابدأ رحلة مشروعك الرقمي. نعدك بـ:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
                {['✅ استشارة مجانية', '✅ عرض سعر شفاف', '✅ دعم فني مستمر', '✅ تسليم في الوقت'].map((item, i) => (
                  <div key={i} className="bg-card/50 border border-border rounded-lg p-3 text-foreground">
                    {item}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://chat.whatsapp.com/LkJJ5CIyE0mFdFIupB33J9" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-mono text-sm hover:bg-primary/90 glow-cyan transition-all">
                  ابدأ مشروعك الآن <ArrowLeft size={16} className="mr-1" />
                </a>
                <a href="/pricing" className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-xl font-mono text-sm hover:border-primary/50 transition-all">
                  شاهد الأسعار
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
