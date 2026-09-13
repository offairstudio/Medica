import { m } from "./localize";

export const lookups = {
  documentTypes: [
    { key: "medical", label: m("רפואי", "Medical") },
    { key: "idCard", label: m("תעודת זהות", "ID card") },
    { key: "bloodTests", label: m("בדיקות דם", "Blood tests") },
    { key: "mrsaSwab", label: m("משטח אף MRSA", "MRSA nasal swab") },
    { key: "covidApproval", label: m("אישור בדיקת קורונה", "COVID test certificate") },
    { key: "familyDoctorHistory", label: m("היסטוריה רפואית מרופא משפחה", "Medical history from family doctor") },
    { key: "specialistApproval", label: m("אישור מרופא מומחה", "Specialist approval") },
    { key: "urineCulture", label: m("תרבית שתן", "Urine culture") },
    { key: "surgeryReferral", label: m("הפניה לניתוח", "Surgery referral") },
    { key: "chestXray", label: m("צילום חזה", "Chest X-ray") },
    { key: "bariatricCommittee", label: m("אישור מועדה בריאטרית", "Bariatric committee approval") },
    { key: "informedConsent", label: m("טופס הסכמה מדעת", "Informed consent form") },
    { key: "ecg", label: m("א.ק.ג", "ECG") },
    { key: "greenPass", label: m("תו ירוק", "Green pass") },
    { key: "imaging", label: m("בדיקות דימות MRI / CT / US", "Imaging: MRI / CT / US") },
    {
      key: "specialistConsult",
      label: m(
        "ייעוץ רופא מומחה (קרדיולוג / רופא ריאות וכו')",
        "Specialist consult (cardiologist / pulmonologist etc.)",
      ),
    },
    { key: "medicationList", label: m("רשימת תרופות", "Medication list") },
    { key: "medicalQuestionnaire", label: m("שאלון רפואי", "Medical questionnaire") },
    { key: "medicalReports", label: m("דוחות רפואיים", "Medical reports") },
    { key: "anamnesis", label: m("אנמנזה רפואית", "Medical anamnesis") },
    { key: "claimRequest", label: m("בקשה לתביעה", "Claim request") },
    { key: "guardianOrder", label: m("צו אפוטרופוס", "Guardianship order") },
    { key: "echoHolter", label: m("אקו לב / הולטר", "Echocardiogram / Holter") },
  ],

  anesthesiaTypes: [
    { key: "general", label: m("כללית", "General") },
    { key: "regional", label: m("איזורית", "Regional") },
    { key: "local", label: m("מקומית", "Local") },
    { key: "sedation", label: m("סדציה", "Sedation") },
  ],

  hmos: [m("כללית", "Clalit"), m("מכבי", "Maccabi"), m("מאוחדת", "Meuhedet"), m("לאומית", "Leumit")],

  payers: [
    m("קופת חולים", "HMO"),
    m("ביטוח פרטי", "Private insurance"),
    m("מימון עצמי", "Self-funded"),
    m("משרד הביטחון", "Ministry of Defense"),
  ],

  capitalEquipment: [
    m("מגדל לפרוסקופיה", "Laparoscopy tower"),
    m("מיקרוסקופ ניתוחי", "Surgical microscope"),
    "C-Arm",
    m("מכשיר אולטרסאונד", "Ultrasound machine"),
    m("רובוט ניתוחי", "Surgical robot"),
  ],

  treatmentTypes: [m("אשפוז", "Inpatient"), m("אשפוז יום", "Day surgery"), m("אמבולטורי", "Ambulatory")],

  surgeryNames: [
    m("מיני מעקף קיבה בלפרוסקופיה", "Laparoscopic mini gastric bypass"),
    m("תיקון בקע מפשעתי דו צידי בלפרוסקופיה", "Laparoscopic bilateral inguinal hernia repair"),
    m("תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", "Laparoscopic ventral hernia repair with mesh"),
    m("תיקון בקע טבורי בלפרוסקופיה", "Laparoscopic umbilical hernia repair"),
    "Achilles tendon repair",
    m("כריתת כיס מרה בלפרוסקופיה", "Laparoscopic cholecystectomy"),
    m("החלפת מפרק ירך", "Hip replacement"),
    m("החלפת מפרק ברך", "Knee replacement"),
    m("כריתת שד חלקית", "Partial mastectomy"),
    m("כריתת ערמונית רדיקלית", "Radical prostatectomy"),
    m("אנדרטרקטומיה של עורק התרדמה", "Carotid endarterectomy"),
    m("שרוול קיבה בלפרוסקופיה", "Laparoscopic sleeve gastrectomy"),
  ],

  organs: [
    m("קיבה", "Stomach"),
    m("ברך", "Knee"),
    m("ירך", "Hip"),
    m("כתף", "Shoulder"),
    m("בטן", "Abdomen"),
    m("שד", "Breast"),
    m("ערמונית", "Prostate"),
    m("כיס מרה", "Gallbladder"),
    m("עורק תרדמה", "Carotid artery"),
    m("גיד אכילס", "Achilles tendon"),
  ],

  requirements: [
    { key: "pacemaker", label: m("המטופל בעל קוצב לב", "Patient has a pacemaker") },
    { key: "bloodTypeCross", label: m("סוג דם והצלבה", "Blood type & crossmatch") },
    { key: "preOp", label: m("טרום ניתוח", "Pre-op workup") },
    { key: "icu", label: m("טיפול נמרץ", "Intensive care") },
    { key: "frozenSection", label: m("חתך קפוא (fs)", "Frozen section (FS)") },
    { key: "xrayTech", label: m("טכנאי רנטגן", "X-ray technician") },
    { key: "agent", label: m("סוכן", "Agent") },
    { key: "surgicalAssistant", label: m("עוזרי מנתח", "Surgical assistants") },
    { key: "nerveMonitoring", label: m("ניטור עצבי", "Nerve monitoring") },
    { key: "breastFnlMarking", label: m("סימון FNL בניתוחי שד", "FNL marking for breast surgery") },
    {
      key: "breastIsotope",
      label: m("נדרש סימון איזוטופי בניתוחי שד", "Isotope marking required for breast surgery"),
    },
    { key: "guestSurgeonPrep", label: m("הכנת אורח לזהוד ניתוח", "Guest surgeon preparation") },
  ] as { key: string; label: string }[],
} as const;

export function documentTypeLabel(key: string): string {
  return lookups.documentTypes.find((type) => type.key === key)?.label ?? key;
}
