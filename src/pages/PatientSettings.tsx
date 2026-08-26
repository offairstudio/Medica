import { useState, type ComponentType } from "react";
import { Bell, ChevronLeft, Eye, LockKeyhole, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PatientShell } from "../components/layout/AppShell";
import { Button } from "../components/primitives/Button";
import { useToast } from "../components/overlay/Toast";
import { currentPatient } from "../mock/patients";
import { cn } from "../lib/cn";
import { formatPhone } from "../lib/format";

type SettingsSection = "profile" | "preferences" | "notifications" | "security";

const sections: Array<{ key: SettingsSection; label: string; description: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "profile", label: "פרטים אישיים", description: "פרטי קשר וזיהוי", icon: UserRound },
  { key: "preferences", label: "העדפות", description: "שפה, תצוגה ונגישות", icon: Settings },
  { key: "notifications", label: "הודעות ותזכורות", description: "איך ומתי נעדכן אותך", icon: Bell },
  { key: "security", label: "פרטיות ואבטחה", description: "כניסה וניהול מידע", icon: ShieldCheck },
];

function SettingSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0">
      <div>
        <p className="font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-caption text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-fast",
          checked ? "bg-primary-700" : "bg-line",
        )}
      >
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-fast", checked ? "start-6" : "start-1")} />
      </button>
    </div>
  );
}

export function PatientSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("section") as SettingsSection | null;
  const active: SettingsSection = sections.some((section) => section.key === requested) ? requested! : "profile";
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({ sms: true, email: true, results: true, reminders: true });
  const [preferences, setPreferences] = useState({ highContrast: false, largerText: false, reducedMotion: false });

  function selectSection(section: SettingsSection) {
    setSearchParams({ section }, { replace: true });
  }

  function saved() {
    toast("success", "ההעדפות נשמרו");
  }

  return (
    <PatientShell>
      <div className="mb-7">
        <Link to="/p" className="inline-flex min-h-[44px] items-center gap-1 rounded-md font-semibold text-primary-700 hover:text-primary-900">
          <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden />
          חזרה לתורים
        </Link>
        <h1 className="mt-2 text-display text-ink">החשבון וההעדפות שלי</h1>
        <p className="mt-1 text-muted">ניהול הפרטים, אופן קבלת העדכונים והעדפות השימוש</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label="הגדרות החשבון" className="h-fit rounded-xl border border-line bg-surface p-2 shadow-sm">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => selectSection(section.key)}
                aria-current={active === section.key ? "page" : undefined}
                className={cn(
                  "flex min-h-[58px] w-full items-center gap-3 rounded-lg px-3 text-start transition-colors duration-fast",
                  active === section.key ? "bg-primary-50 text-primary-900" : "text-body hover:bg-canvas",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active === section.key ? "text-primary-700" : "text-muted")} aria-hidden />
                <span>
                  <span className="block font-semibold">{section.label}</span>
                  <span className="block text-caption text-muted">{section.description}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-7">
          {active === "profile" && (
            <div>
              <h2 className="text-h2 text-ink">פרטים אישיים</h2>
              <p className="mt-1 text-caption text-muted">פרטים המשמשים לזיהוי וליצירת קשר בנוגע לטיפול</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-caption font-semibold text-body">שם פרטי<input defaultValue={currentPatient.firstName} className="mt-1.5 h-11 w-full rounded-md border border-line bg-white px-3 text-[15px] font-normal text-ink outline-none focus:border-primary-400" /></label>
                <label className="text-caption font-semibold text-body">שם משפחה<input defaultValue={currentPatient.lastName} className="mt-1.5 h-11 w-full rounded-md border border-line bg-white px-3 text-[15px] font-normal text-ink outline-none focus:border-primary-400" /></label>
                <label className="text-caption font-semibold text-body">טלפון נייד<input defaultValue={formatPhone(currentPatient.phone)} dir="ltr" className="mt-1.5 h-11 w-full rounded-md border border-line bg-white px-3 text-start text-[15px] font-normal text-ink outline-none focus:border-primary-400" /></label>
                <label className="text-caption font-semibold text-body">קופת חולים<input value={currentPatient.hmo} disabled className="mt-1.5 h-11 w-full rounded-md border border-line bg-canvas px-3 text-[15px] font-normal text-muted" /></label>
              </div>
              <div className="mt-6"><Button onClick={saved}>שמירת פרטים</Button></div>
            </div>
          )}

          {active === "preferences" && (
            <div>
              <h2 className="text-h2 text-ink">העדפות תצוגה ונגישות</h2>
              <p className="mt-1 text-caption text-muted">התאמת האזור האישי לצורת השימוש הנוחה לך</p>
              <label className="mt-6 block max-w-sm text-caption font-semibold text-body">
                שפת הממשק
                <select defaultValue="he" className="mt-1.5 h-11 w-full rounded-md border border-line bg-white px-3 text-[15px] font-normal text-ink outline-none focus:border-primary-400">
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                </select>
              </label>
              <div className="mt-4 border-t border-line">
                <SettingSwitch checked={preferences.largerText} onChange={() => setPreferences((p) => ({ ...p, largerText: !p.largerText }))} label="טקסט גדול" description="הגדלת הטקסט והרווחים במסכים" />
                <SettingSwitch checked={preferences.highContrast} onChange={() => setPreferences((p) => ({ ...p, highContrast: !p.highContrast }))} label="ניגודיות מוגברת" description="חיזוק ההבדלים בין טקסט, רקע ופעולות" />
                <SettingSwitch checked={preferences.reducedMotion} onChange={() => setPreferences((p) => ({ ...p, reducedMotion: !p.reducedMotion }))} label="צמצום תנועה" description="הפחתת אנימציות ומעברים" />
              </div>
              <div className="mt-5"><Button onClick={saved}>שמירת העדפות</Button></div>
            </div>
          )}

          {active === "notifications" && (
            <div>
              <h2 className="text-h2 text-ink">הודעות ותזכורות</h2>
              <p className="mt-1 text-caption text-muted">בחירת הערוצים והאירועים שעליהם נשלח עדכון</p>
              <div className="mt-4">
                <SettingSwitch checked={notifications.sms} onChange={() => setNotifications((p) => ({ ...p, sms: !p.sms }))} label="הודעות SMS" description="תזכורות ועדכונים למספר הטלפון שלך" />
                <SettingSwitch checked={notifications.email} onChange={() => setNotifications((p) => ({ ...p, email: !p.email }))} label="דואר אלקטרוני" description="מסמכים ועדכונים מפורטים בדוא״ל" />
                <SettingSwitch checked={notifications.reminders} onChange={() => setNotifications((p) => ({ ...p, reminders: !p.reminders }))} label="תזכורות לפני תור" description="עדכון לפני תור, בדיקה או ניתוח" />
                <SettingSwitch checked={notifications.results} onChange={() => setNotifications((p) => ({ ...p, results: !p.results }))} label="תוצאות חדשות" description="הודעה כאשר תוצאה או סיכום חדשים זמינים" />
              </div>
              <div className="mt-5"><Button onClick={saved}>שמירת הגדרות</Button></div>
            </div>
          )}

          {active === "security" && (
            <div>
              <h2 className="text-h2 text-ink">פרטיות ואבטחה</h2>
              <p className="mt-1 text-caption text-muted">שליטה בגישה לחשבון ובמידע הרפואי</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => toast("info", "קוד אימות חדש יישלח בכניסה הבאה")} className="flex min-h-24 items-start gap-3 rounded-lg border border-line p-4 text-start transition-colors hover:border-primary-300 hover:bg-primary-50">
                  <LockKeyhole className="h-5 w-5 text-primary-700" aria-hidden /><span><span className="block font-semibold text-ink">אימות כניסה</span><span className="mt-1 block text-caption text-muted">ניהול מספר הטלפון וקוד האימות</span></span>
                </button>
                <button type="button" onClick={() => toast("info", "הבקשה לצפייה בהיסטוריית הגישה התקבלה")} className="flex min-h-24 items-start gap-3 rounded-lg border border-line p-4 text-start transition-colors hover:border-primary-300 hover:bg-primary-50">
                  <Eye className="h-5 w-5 text-primary-700" aria-hidden /><span><span className="block font-semibold text-ink">היסטוריית גישה</span><span className="mt-1 block text-caption text-muted">צפייה בכניסות האחרונות לחשבון</span></span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PatientShell>
  );
}
