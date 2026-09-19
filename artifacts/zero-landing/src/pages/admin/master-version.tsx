import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  GitBranch, Plus, Crown, Trash2, X, Save, Loader2,
  Globe, CheckCircle, Circle, AlertTriangle, ExternalLink,
  ShieldCheck, Copy, Check
} from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";

interface SiteVersion {
  id: string;
  label: string;
  url: string;
  isMaster: boolean;
  isActive: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = { label: "", url: "", isMaster: false, isActive: true, note: "" };

export default function AdminMasterVersion() {
  const [versions, setVersions] = useState<SiteVersion[]>([]);
  const [master, setMaster] = useState<SiteVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SiteVersion | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<{ versions: SiteVersion[]; master: SiteVersion | null }>("/admin/versions");
      setVersions(res.versions);
      setMaster(res.master);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (v: SiteVersion) => {
    setEditing(v);
    setForm({ label: v.label, url: v.url, isMaster: v.isMaster, isActive: v.isActive, note: v.note || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.url) { toast.error("الاسم والرابط مطلوبان"); return; }
    setSaving(true);
    try {
      if (editing) {
        await apiPut(`/admin/versions/${editing.id}`, form);
        toast.success("تم تحديث النسخة");
      } else {
        await apiPost("/admin/versions", form);
        toast.success("تمت إضافة النسخة");
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async (id: string) => {
    setPromotingId(id);
    try {
      await apiPost(`/admin/versions/${id}/set-master`, {});
      toast.success("تم تعيينها نسخة رئيسية ✓");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPromotingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDelete(`/admin/versions/${deleteId}`);
      toast.success("تم الحذف");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GitBranch size={22} className="text-primary" />
              إدارة نسخ الموقع
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              // versions.manage() — نسخة رئيسية واحدة تتحكم في الباقي
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> إضافة نسخة
          </button>
        </div>

        {/* Master version banner */}
        {master && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-primary/5 border border-primary/30 rounded-2xl p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 to-transparent" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Crown size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary tracking-widest uppercase">// النسخة الرئيسية</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">{master.label}</h2>
                <div className="flex items-center gap-2">
                  <a
                    href={master.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-mono hover:underline flex items-center gap-1"
                  >
                    <Globe size={12} /> {master.url}
                    <ExternalLink size={11} />
                  </a>
                  <button onClick={() => copyUrl(master.url)} className="text-muted-foreground hover:text-primary transition-colors">
                    {copied === master.url ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
                {master.note && (
                  <p className="text-sm text-muted-foreground mt-2">{master.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="flex items-center gap-1 text-xs font-mono bg-green-400/10 text-green-400 border border-green-400/30 px-3 py-1 rounded-full">
                  <CheckCircle size={11} /> مفعّل
                </span>
                <span className="flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full">
                  <ShieldCheck size={11} /> رئيسي
                </span>
              </div>
            </div>
            {/* scan line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </motion.div>
        )}

        {!master && !loading && (
          <div className="flex items-center gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
            <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">لم يتم تعيين نسخة رئيسية بعد. أضف نسخة وعيّنها كـ Master.</p>
          </div>
        )}

        {/* Info box */}
        <div className="bg-card/50 border border-border rounded-xl p-4 text-xs font-mono text-muted-foreground space-y-1">
          <p className="text-primary">// كيف يعمل نظام النسخ؟</p>
          <p>1. أضف روابط جميع نسخ موقعك (production, staging, dev)</p>
          <p>2. عيّن نسخة واحدة كـ "رئيسية" — تكون هي المرجع الأساسي</p>
          <p>3. النسخة الرئيسية تُستخدم كـ canonical URL في الـ SEO وتُشار إليها من الإعدادات</p>
          <p>4. يمكن تفعيل/تعطيل أي نسخة بدون حذفها</p>
        </div>

        {/* Versions list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <GitBranch size={48} className="mx-auto opacity-20 mb-3" />
            <p className="font-mono text-sm">لا توجد نسخ بعد</p>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {versions.map((v) => (
              <motion.div
                key={v.id}
                variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                className={`relative bg-card border rounded-xl p-5 transition-all group ${
                  v.isMaster ? "border-primary/40 shadow-[0_0_20px_rgba(0,217,255,0.05)]" : "border-border hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* status dot */}
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${v.isActive ? "bg-green-400" : "bg-muted"} ${v.isActive && v.isMaster ? "animate-pulse" : ""}`} />

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground">{v.label}</span>
                      {v.isMaster && (
                        <span className="flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                          <Crown size={10} /> رئيسي
                        </span>
                      )}
                      {!v.isActive && (
                        <span className="text-xs font-mono bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                          معطّل
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-mono hover:underline flex items-center gap-1 truncate">
                        <Globe size={11} /> {v.url}
                      </a>
                      <button onClick={() => copyUrl(v.url)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                        {copied === v.url ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                      </button>
                    </div>
                    {v.note && <p className="text-xs text-muted-foreground mt-1">{v.note}</p>}
                    <p className="text-xs text-muted-foreground/50 font-mono mt-1">
                      {new Date(v.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!v.isMaster && (
                      <button
                        onClick={() => handlePromote(v.id)}
                        disabled={promotingId === v.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                      >
                        {promotingId === v.id ? <Loader2 size={11} className="animate-spin" /> : <Crown size={11} />}
                        جعلها رئيسية
                      </button>
                    )}
                    <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg bg-background hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors border border-border">
                      <GitBranch size={13} />
                    </button>
                    {!v.isMaster && (
                      <button onClick={() => setDeleteId(v.id)} className="w-8 h-8 rounded-lg bg-background hover:bg-red-400/10 hover:text-red-400 flex items-center justify-center text-muted-foreground transition-colors border border-border">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
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
              className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <GitBranch size={16} className="text-primary" />
                  {editing ? "تعديل النسخة" : "إضافة نسخة جديدة"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">اسم النسخة *</label>
                  <input className={inputCls} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Production / Staging / Dev" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">رابط النسخة *</label>
                  <input className={inputCls} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://zero.dev" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">ملاحظة (اختياري)</label>
                  <textarea className={inputCls + " resize-none"} rows={2} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="النسخة الحية على السيرفر الرئيسي..." />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isMaster} onChange={e => setForm(f => ({ ...f, isMaster: e.target.checked }))} className="accent-primary w-4 h-4" />
                    <span className="text-sm flex items-center gap-1"><Crown size={13} className="text-primary" /> رئيسية</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-primary w-4 h-4" />
                    <span className="text-sm">مفعّلة</span>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">إلغاء</button>
                <button
                  onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editing ? "حفظ" : "إضافة"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete */}
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
                <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold">حذف النسخة</h3>
                  <p className="text-sm text-muted-foreground">هذا الإجراء لا يمكن التراجع عنه.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">إلغاء</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-400 text-white rounded-lg hover:bg-red-500 font-medium">حذف</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
