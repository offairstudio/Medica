export const lookups = {
  documentTypes: [
    { key: "medical", label: "רפואי" },
    { key: "idCard", label: "תעודת זהות" },
    { key: "bloodTests", label: "בדיקות דם" },
    { key: "mrsaSwab", label: "משטח אף MRSA" },
    { key: "covidApproval", label: "אישור בדיקת קורונה" },
    { key: "familyDoctorHistory", label: "היסטוריה רפואית מרופא משפחה" },
    { key: "specialistApproval", label: "אישור מרופא מומחה" },
    { key: "urineCulture", label: "תרבית שתן" },
    { key: "surgeryReferral", label: "הפניה לניתוח" },
    { key: "chestXray", label: "צילום חזה" },
    { key: "bariatricCommittee", label: "אישור מועדה בריאטרית" },
    { key: "informedConsent", label: "טופס הסכמה מדעת" },
    { key: "ecg", label: "א.ק.ג" },
    { key: "greenPass", label: "תו ירוק" },
    { key: "imaging", label: "בדיקות דימות MRI / CT / US" },
    { key: "specialistConsult", label: "ייעוץ רופא מומחה (קרדיולוג / רופא ריאות וכו')" },
    { key: "medicationList", label: "רשימת תרופות" },
    { key: "medicalQuestionnaire", label: "שאלון רפואי" },
    { key: "medicalReports", label: "דוחות רפואיים" },
    { key: "anamnesis", label: "אנמנזה רפואית" },
    { key: "claimRequest", label: "בקשה לתביעה" },
    { key: "guardianOrder", label: "צו אפוטרופוס" },
    { key: "echoHolter", label: "אקו לב / הולטר" },
  ],

  anesthesiaTypes: [
    { key: "general", label: "כללית" },
    { key: "regional", label: "איזורית" },
    { key: "local", label: "מקומית" },
    { key: "sedation", label: "סדציה" },
  ],

  hmos: ["כללית", "מכבי", "מאוחדת", "לאומית"],

  payers: ["קופת חולים", "ביטוח פרטי", "מימון עצמי", "משרד הביטחון"],

  capitalEquipment: [
    "מגדל לפרוסקופיה",
    "מיקרוסקופ ניתוחי",
    "C-Arm",
    "מכשיר אולטרסאונד",
    "רובוט ניתוחי",
  ],

  treatmentTypes: ["אשפוז", "אשפוז יום", "אמבולטורי"],

  surgeryNames: [
    "מיני מעקף קיבה בלפרוסקופיה",
    "תיקון בקע מפשעתי דו צידי בלפרוסקופיה",
    "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל",
    "תיקון בקע טבורי בלפרוסקופיה",
    "Achilles tendon repair",
    "כריתת כיס מרה בלפרוסקופיה",
    "החלפת מפרק ירך",
    "החלפת מפרק ברך",
    "כריתת שד חלקית",
    "כריתת ערמונית רדיקלית",
    "אנדרטרקטומיה של עורק התרדמה",
    "שרוול קיבה בלפרוסקופיה",
  ],

  organs: ["קיבה", "ברך", "ירך", "כתף", "בטן", "שד", "ערמונית", "כיס מרה", "עורק תרדמה", "גיד אכילס"],

  requirements: [
    { key: "pacemaker", label: "המטופל בעל קוצב לב" },
    { key: "bloodTypeCross", label: "סוג דם והצלבה" },
    { key: "preOp", label: "טרום ניתוח" },
    { key: "icu", label: "טיפול נמרץ" },
    { key: "frozenSection", label: "חתך קפוא (fs)" },
    { key: "xrayTech", label: "טכנאי רנטגן" },
    { key: "agent", label: "סוכן" },
    { key: "surgicalAssistant", label: "עוזרי מנתח" },
    { key: "nerveMonitoring", label: "ניטור עצבי" },
    { key: "breastFnlMarking", label: "סימון FNL בניתוחי שד" },
    { key: "breastIsotope", label: "נדרש סימון איזוטופי בניתוחי שד" },
    { key: "guestSurgeonPrep", label: "הכנת אורח לזהוד ניתוח" },
  ] as { key: string; label: string }[],
} as const;

export function documentTypeLabel(key: string): string {
  return lookups.documentTypes.find((t) => t.key === key)?.label ?? key;
}
