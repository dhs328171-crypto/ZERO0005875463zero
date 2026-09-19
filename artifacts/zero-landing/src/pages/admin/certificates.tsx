import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Plus, Search, Edit2, Trash2, Award, X, Save, ExternalLink,
  Star, Loader2, Calendar, Shield, CheckCircle
} from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete, getImageUrl, qs, type Paginated } from "@/lib/api";
import { Pager } from "@/components/ui/pager";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  image: string | null;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

const CATEGORIES = ["general", "cloud", "security", "development", "design", "database", "devops", "ai"];

const emptyForm = {
  title: "", issuer: "", issueDate: "", expiryDate: "",
  credentialId: "", credentialUrl: "", image: "", category: "general",
  featured: false, order: 0,
};

const categoryColors: Record<string, string> = {
  cloud: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  security: "text-red-400 bg-red-400/10 border-red-400/30",
  development: "text-primary bg-primary/10 border-primary/30",
  design: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  database: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  devops: "text-green-400 bg-green-400/10 border-green-400/30",
  ai: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  general: "text-muted-foreground bg-muted/30 border-border",
};

export default function AdminCertificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = qs({ page, limit: 12, q: search });
      const res = await apiGet<Paginated<Certificate>>(`/certificates${query}`);
      setItems(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (c: Certificate) => {
    setEditing(c);
    setForm({
      title: c.title, issuer: c.issuer, issueDate: c.issueDate,
      expiryDate: c.expiryDate || "", credentialId: c.credentialId || "",
      credentialUrl: c.credentialUrl || "", image: c.image || "",
      category: c.category, featured: c.featured, order: c.order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.issuer || !form.issueDate) {
      toast.error("العنوان والجهة وتاريخ الإصدار مطلوبة");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await apiPut(`/certificates/${editing.id}`, form);
        toast.success("تم تحديث الشهادة");
      } else {
        await apiPost("/certificates", form);
        toast.success("تمت إضافة الشهادة");
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDelete(`/certificates/${deleteId}`);
      toast.success("تم حذف الشهادة");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-mono text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award size={22} className="text-primary" />
              الشهادات والإنجازات
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              // certificates.manage() — {total} شهادة
            </p>
          <a href="/certificates" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
            <ExternalLink size={11} /> فتح صفحة عرض الشهادات
          </a>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> إضافة شهادة
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالعنوان أو الجهة..."
            className="w-full bg-card border border-border rounded-lg pl-3 pr-9 py-2 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Award size={48} className="opacity-20" />
            <p className="font-mono text-sm">لا توجد شهادات بعد</p>
            <button onClick={openAdd} className="text-primary text-sm hover:underline font-mono">+ إضافة أول شهادة</button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {items.map((c) => (
              <motion.div
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all group relative overflow-hidden"
              >
                {/* glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                {/* top row */}
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      {c.image ? (
                        <img src={getImageUrl(c.image)} alt={c.issuer} className="w-8 h-8 object-contain rounded" />
                      ) : (
                        <Award size={18} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${categoryColors[c.category] ?? categoryColors.general}`}>
                        {c.category}
                      </span>
                      {c.featured && (
                        <span className="mr-1 text-xs font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                          ★ مميّز
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="w-7 h-7 rounded-lg bg-background hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="w-7 h-7 rounded-lg bg-background hover:bg-red-400/10 hover:text-red-400 flex items-center justify-center text-muted-foreground transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* content */}
                <h3 className="font-semibold text-foreground mb-1 relative z-10">{c.title}</h3>
                <p className="text-sm text-primary font-mono mb-3 relative z-10">{c.issuer}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono relative z-10">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} className="text-primary" />
                    {c.issueDate}
                  </span>
                  {c.expiryDate && (
                    <span className="flex items-center gap-1">
                      <Shield size={11} className="text-yellow-400" />
                      حتى {c.expiryDate}
                    </span>
                  )}
                </div>

                {c.credentialId && (
                  <p className="text-xs text-muted-foreground font-mono mt-2 relative z-10">
                    ID: {c.credentialId}
                  </p>
                )}

                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 relative z-10"
                  >
                    <ExternalLink size={11} /> عرض الشهادة
                  </a>
                )}

                {/* bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {pages > 1 && <Pager page={page} pages={pages} onChange={setPage} />}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Award size={16} className="text-primary" />
                  {editing ? "تعديل الشهادة" : "إضافة شهادة جديدة"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <Field label="عنوان الشهادة *">
                  <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="AWS Certified Solutions Architect" />
                </Field>
                <Field label="الجهة المانحة *">
                  <input className={inputCls} value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} placeholder="Amazon Web Services" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="تاريخ الإصدار *">
                    <input type="date" className={inputCls} value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} />
                  </Field>
                  <Field label="تاريخ الانتهاء">
                    <input type="date" className={inputCls} value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
                  </Field>
                </div>
                <Field label="رقم الشهادة (Credential ID)">
                  <input className={inputCls} value={form.credentialId} onChange={e => setForm(f => ({ ...f, credentialId: e.target.value }))} placeholder="ABC123XYZ" />
                </Field>
                <Field label="رابط التحقق">
                  <input className={inputCls} value={form.credentialUrl} onChange={e => setForm(f => ({ ...f, credentialUrl: e.target.value }))} placeholder="https://verify.example.com/..." />
                </Field>
                <ImageUpload
                  label="صورة الشهادة / شعار الجهة"
                  value={form.image}
                  onChange={(url) => setForm(f => ({ ...f, image: url }))}
                  allowUrl
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="الفئة">
                    <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="الترتيب">
                    <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
                  </Field>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-primary w-4 h-4" />
                  <span className="text-sm text-foreground">شهادة مميّزة (تظهر في الصفحة الرئيسية)</span>
                </label>
              </div>

              <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">إلغاء</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editing ? "حفظ التعديلات" : "إضافة"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">حذف الشهادة</h3>
                  <p className="text-sm text-muted-foreground">هذا الإجراء لا يمكن التراجع عنه.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">إلغاء</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium">حذف</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
