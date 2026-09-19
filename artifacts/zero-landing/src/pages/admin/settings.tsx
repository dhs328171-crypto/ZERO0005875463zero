import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { User, Lock, Bell, Palette, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Field, SettingsCard } from "@/components/admin/SettingsField";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  country?: string;
  website?: string;
  avatar?: string;
  role: string;
}

export default function AdminSettings() {
  const { updateProfile } = useAuth();
  const { settings: siteSettings, saveSettings } = useSiteSettings();
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Profile state — loaded from API
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    phone: "",      // maps to whatsapp/phone
    country: "",
    website: "",    // maps to channel
    avatar: "",
  });

  // Password change state
  const [security, setSecurity] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });

  const [notifs, setNotifs] = useState({
    newMessage: true,
    projectUpdate: true,
    weeklyReport: false,
  });

  const [appearance, setAppearance] = useState({
    accentColor: "#00D9FF",
    primaryFont: "Tajawal",
  });

  useEffect(() => {
    try {
      const storedNotifs = localStorage.getItem("zero_admin_notifications");
      if (storedNotifs) setNotifs((current) => ({ ...current, ...JSON.parse(storedNotifs) }));
    } catch {
      // Ignore malformed notification settings and keep safe defaults.
    }
  }, []);

  useEffect(() => {
    setAppearance({
      accentColor: siteSettings.accentColor,
      primaryFont: siteSettings.primaryFont,
    });
  }, [siteSettings]);

  // Load current user profile on mount
  useEffect(() => {
    apiGet<{ user: UserProfile | null }>("/auth/me")
      .then(({ user }) => {
        if (user) {
          setUserEmail(user.email ?? "");
          setProfile({
            name: user.name ?? "",
            bio: user.bio ?? "",
            phone: user.phone ?? "",
            country: user.country ?? "",
            website: user.website ?? "",
            avatar: user.avatar ?? "",
          });
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, []);

  /** Save profile via AuthContext.updateProfile (keeps auth state in sync) */
  const saveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    setSaving("profile");
    try {
      await updateProfile({
        name: profile.name.trim(),
        bio: profile.bio,
        phone: profile.phone,
        country: profile.country,
        website: profile.website,
        avatar: profile.avatar,
      });
      setSaved("profile");
      toast.success("✅ تم حفظ الملف الشخصي بنجاح");
      setTimeout(() => setSaved(null), 3000);
    } catch (e: any) {
      toast.error(e.message ?? "فشل الحفظ");
    } finally {
      setSaving(null);
    }
  };

  /** Change password via POST /api/auth/change-password */
  const savePassword = async () => {
    if (!security.currentPass || !security.newPass) {
      toast.error("يرجى ملء جميع حقول كلمة المرور");
      return;
    }
    if (security.newPass !== security.confirmPass) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقتين");
      return;
    }
    if (security.newPass.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setSaving("security");
    try {
      await apiPost("/auth/change-password", {
        currentPassword: security.currentPass,
        newPassword: security.newPass,
      });
      setSaved("security");
      setSecurity({ currentPass: "", newPass: "", confirmPass: "" });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setTimeout(() => setSaved(null), 2500);
    } catch (e: any) {
      toast.error(e.message ?? "فشل تغيير كلمة المرور");
    } finally {
      setSaving(null);
    }
  };

  const saveSection = async (section: string) => {
    if (section === "profile") { await saveProfile(); return; }
    if (section === "security") { await savePassword(); return; }
    setSaving(section);
    try {
      if (section === "notifications") {
        localStorage.setItem("zero_admin_notifications", JSON.stringify(notifs));
      } else if (section === "appearance") {
        await saveSettings(appearance);
      }
      setSaved(section);
      toast.success("✅ تم حفظ التغييرات بنجاح");
      setTimeout(() => setSaved(null), 3000);
    } catch (e: any) {
      toast.error(e.message ?? "فشل الحفظ");
    } finally {
      setSaving(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">// إعدادات لوحة التحكم والموقع</p>
        </div>

        {/* Profile */}
        <SettingsCard
          id="profile"
          icon={User}
          label="الملف الشخصي"
          saved={saved}
          onSave={saveSection}
          loading={saving === "profile"}
        >
          {!profileLoaded ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <Loader2 size={16} className="animate-spin" /> جاري التحميل...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="الاسم المعروض"
                value={profile.name}
                onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
              />
              <Field
                label="البريد الإلكتروني (للعرض فقط)"
                value={userEmail}
                onChange={() => {}}
                disabled
                placeholder="لا يمكن تغيير البريد الإلكتروني"
              />
              <Field
                label="رقم الهاتف / واتساب"
                value={profile.phone}
                onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
              />
              <Field
                label="الدولة"
                value={profile.country}
                onChange={(v) => setProfile((p) => ({ ...p, country: v }))}
              />
              <Field
                label="الموقع / رابط القناة"
                value={profile.website}
                onChange={(v) => setProfile((p) => ({ ...p, website: v }))}
              />
              <Field
                label="رابط الصورة الشخصية"
                value={profile.avatar}
                onChange={(v) => setProfile((p) => ({ ...p, avatar: v }))}
              />
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">النبذة الشخصية</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          )}
        </SettingsCard>

        {/* Security */}
        <SettingsCard
          id="security"
          icon={Lock}
          label="الأمان وكلمة المرور"
          saved={saved}
          onSave={saveSection}
          loading={saving === "security"}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs font-mono text-primary">
              <Shield size={14} />
              تغيير كلمة المرور يتطلب إدخال كلمة المرور الحالية
            </div>
            {[
              { label: "كلمة المرور الحالية", field: "currentPass" },
              { label: "كلمة المرور الجديدة", field: "newPass" },
              { label: "تأكيد كلمة المرور الجديدة", field: "confirmPass" },
            ].map(({ label, field }) => (
              <div key={field} className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={(security as Record<string, string>)[field]}
                    onChange={(e) =>
                      setSecurity((p) => ({ ...p, [field]: e.target.value }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 pr-3 pl-10 py-2 text-sm font-mono focus:outline-none focus:border-primary"
                    dir="ltr"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard
          id="notifications"
          icon={Bell}
          label="الإشعارات"
          saved={saved}
          onSave={saveSection}
          loading={saving === "notifications"}
        >
          <div className="space-y-4">
            {[
              { key: "newMessage", label: "رسالة جديدة من عميل", desc: "إشعار عند وصول استفسار جديد" },
              { key: "projectUpdate", label: "تحديث المشاريع", desc: "إشعار عند تغيير حالة مشروع" },
              { key: "weeklyReport", label: "تقرير أسبوعي", desc: "ملخص أداء المشاريع كل أسبوع" },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
              >
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifs[key as keyof typeof notifs]
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifs[key as keyof typeof notifs]
                        ? "translate-x-5 rtl:-translate-x-5"
                        : "translate-x-0.5 rtl:translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </SettingsCard>

        {/* Appearance */}
        <SettingsCard
          id="appearance"
          icon={Palette}
          label="المظهر"
          saved={saved}
          onSave={saveSection}
          loading={saving === "appearance"}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">اللون الرئيسي</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.accentColor}
                  onChange={(e) =>
                    setAppearance((a) => ({ ...a, accentColor: e.target.value }))
                  }
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <span className="font-mono text-sm">{appearance.accentColor}</span>
                <div
                  className="w-8 h-8 rounded-full border border-border"
                  style={{ backgroundColor: appearance.accentColor }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">الخط الرئيسي</label>
              <select
                value={appearance.primaryFont}
                onChange={(e) =>
                  setAppearance((a) => ({ ...a, primaryFont: e.target.value }))
                }
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {["IBM Plex Sans Arabic", "Tajawal", "Cairo", "Almarai", "Noto Kufi Arabic"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </SettingsCard>
      </div>
    </AdminLayout>
  );
}
