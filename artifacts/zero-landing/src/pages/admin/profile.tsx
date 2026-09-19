import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Save, CheckCircle, Camera, Briefcase, Star,
  MessageSquare, Award, Globe, Edit2, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiGet, apiPut, apiPost, getImageUrl } from "@/lib/api";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProfileData {
  name: string;
  bio: string;
  phone: string;
  country: string;
  website: string;
  avatar: string;
}

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [form, setForm] = useState<ProfileData>({
    name: "",
    bio: "",
    phone: "",
    country: "",
    website: "",
    avatar: "",
  });

  const [passForm, setPassForm] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });

  // Load user data into form on mount / when user changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        bio: user.bio ?? "",
        phone: user.phone ?? "",
        country: user.country ?? "",
        website: user.website ?? "",
        avatar: user.avatar ?? "",
      });
    }
  }, [user]);

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    setSaving(true);
    try {
      await apiPut("/auth/profile", {
        name: form.name,
        bio: form.bio,
        phone: form.phone,
        country: form.country,
        website: form.website,
        avatar: form.avatar,
      });
      updateProfile(form);
      toast.success("تم حفظ الملف الشخصي");
      setEditBio(false);
    } catch (e: any) {
      toast.error(e.message ?? "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passForm.currentPass || !passForm.newPass) {
      toast.error("يرجى ملء كل حقول كلمة المرور");
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقتين");
      return;
    }
    if (passForm.newPass.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setChangingPass(true);
    try {
      await apiPost("/auth/change-password", {
        currentPassword: passForm.currentPass,
        newPassword: passForm.newPass,
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPassForm({ currentPass: "", newPass: "", confirmPass: "" });
    } catch (e: any) {
      toast.error(e.message ?? "فشل تغيير كلمة المرور");
    } finally {
      setChangingPass(false);
    }
  };

  const stats = [
    { icon: <Briefcase size={16} className="text-primary" />, label: "المشاريع", value: "52+" },
    { icon: <Star size={16} className="text-yellow-400" />, label: "التقييم", value: "4.9★" },
    { icon: <MessageSquare size={16} className="text-green-400" />, label: "العملاء", value: "30+" },
    { icon: <Award size={16} className="text-purple-400" />, label: "سنوات خبرة", value: "5+" },
  ];

  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">ملفي الشخصي</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            // profile.edit() — {user?.role}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Avatar card */}
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={getImageUrl(form.avatar)}
                  alt="ZERO"
                  className="w-full h-full rounded-2xl object-cover border-2 border-primary/40 drop-shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/zero-logo.png"; }}
                />
              </div>
              <h2 className="text-lg font-bold">{form.name || "ZERO"}</h2>
              <p className="text-xs text-primary font-mono mb-2">Software Architect</p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Globe size={11} className="text-primary" />
                <span>{form.country || "—"}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-mono">متاح للمشاريع</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p className="font-bold font-mono">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Account info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-4">معلومات الحساب</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">البريد الإلكتروني</p>
                  <p className="font-mono text-foreground text-xs">{user?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">الصلاحية</p>
                  <span className="text-xs font-mono bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">تاريخ الإنشاء</p>
                  <p className="font-mono text-foreground text-xs">{joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — edit form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Edit2 size={15} className="text-primary" /> تعديل البيانات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "الاسم الكامل", key: "name" as const },
                  { label: "الدولة", key: "country" as const },
                  { label: "رقم الهاتف / واتساب", key: "phone" as const },
                  { label: "الموقع / القناة", key: "website" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground">النبذة الشخصية</label>
                  <button
                    onClick={() => setEditBio(!editBio)}
                    className="text-xs text-primary hover:underline font-mono"
                  >
                    {editBio ? "إخفاء" : "تعديل"}
                  </button>
                </div>
                {editBio ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all resize-none"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-3 border border-border/50">
                    {form.bio || "لا توجد نبذة بعد — اضغط تعديل لإضافتها."}
                  </p>
                )}
              </div>

              {/* Avatar upload */}
              <div className="mt-4">
                <ImageUpload
                  label="الصورة الشخصية"
                  value={form.avatar}
                  onChange={(url) => setForm((p) => ({ ...p, avatar: url }))}
                  allowUrl
                />
              </div>
            </div>

            {/* Change password */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Camera size={15} className="text-primary" /> تغيير كلمة المرور
              </h2>
              <div className="space-y-3">
                {[
                  { label: "كلمة المرور الحالية", key: "currentPass" as const },
                  { label: "كلمة المرور الجديدة", key: "newPass" as const },
                  { label: "تأكيد كلمة المرور الجديدة", key: "confirmPass" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                    <input
                      type="password"
                      value={passForm[key]}
                      onChange={(e) => setPassForm((p) => ({ ...p, [key]: e.target.value }))}
                      autoComplete="new-password"
                      dir="ltr"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={changePassword}
                  disabled={changingPass}
                  className="flex items-center gap-2 bg-background border border-border text-foreground px-4 py-2 rounded-lg text-xs font-mono hover:border-primary/50 transition-all disabled:opacity-60"
                >
                  {changingPass ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  {changingPass ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </button>
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-mono hover:bg-primary/90 glow-cyan transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
