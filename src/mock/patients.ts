import type { Patient } from "../types";
import { m } from "./localize";

export const patients: Patient[] = [
  {
    id: "pat-1",
    firstName: m("עידית", "Idit"),
    lastName: m("גאז", "Gaz"),
    idType: "id",
    idNumber: "37336278",
    phone: "0523372667",
    birthDate: "1984-03-12",
    gender: "female",
    hmo: m("מכבי", "Maccabi"),
    payer: m("קופת חולים", "HMO"),
  },
  {
    id: "pat-2",
    firstName: m("יוסי", "Yossi"),
    lastName: m("אברהמי", "Avrahami"),
    idType: "id",
    idNumber: "058231947",
    phone: "0528834712",
    birthDate: "1971-11-02",
    gender: "male",
    hmo: m("כללית", "Clalit"),
    payer: m("ביטוח פרטי", "Private insurance"),
  },
  {
    id: "pat-3",
    firstName: m("רחל", "Rachel"),
    lastName: m("ברקוביץ", "Berkovitz"),
    idType: "id",
    idNumber: "029384756",
    phone: "0542211903",
    birthDate: "1958-06-24",
    gender: "female",
    hmo: m("מאוחדת", "Meuhedet"),
    payer: m("קופת חולים", "HMO"),
  },
  {
    id: "pat-4",
    firstName: m("משה", "Moshe"),
    lastName: m("קליין", "Klein"),
    idType: "id",
    idNumber: "031847265",
    phone: "0503318842",
    birthDate: "1966-01-15",
    gender: "male",
    hmo: m("כללית", "Clalit"),
    payer: m("קופת חולים", "HMO"),
  },
  {
    id: "pat-5",
    firstName: m("נועה", "Noa"),
    lastName: m("שרעבי", "Sharabi"),
    idType: "id",
    idNumber: "204183957",
    phone: "0537719234",
    birthDate: "1992-08-30",
    gender: "female",
    hmo: m("מכבי", "Maccabi"),
    payer: m("מימון עצמי", "Self-funded"),
  },
  {
    id: "pat-6",
    firstName: m("אנה", "Anna"),
    lastName: m("פטרוב", "Petrov"),
    idType: "passport",
    idNumber: "K8273645",
    phone: "0526691823",
    birthDate: "1979-04-18",
    gender: "female",
    hmo: m("לאומית", "Leumit"),
    payer: m("ביטוח פרטי", "Private insurance"),
  },
  {
    id: "pat-7",
    firstName: m("דניאל", "Daniel"),
    lastName: m("כהן", "Cohen"),
    idType: "id",
    idNumber: "312845679",
    phone: "0549912384",
    birthDate: "1988-12-07",
    gender: "male",
    hmo: m("כללית", "Clalit"),
    payer: m("קופת חולים", "HMO"),
  },
  {
    id: "pat-8",
    firstName: m("שרה", "Sarah"),
    lastName: m("מזרחי", "Mizrahi"),
    idType: "id",
    idNumber: "067192834",
    phone: "0507734519",
    birthDate: "1949-09-21",
    gender: "female",
    hmo: m("מאוחדת", "Meuhedet"),
    payer: m("קופת חולים", "HMO"),
  },
  {
    id: "pat-9",
    firstName: m("אבי", "Avi"),
    lastName: m("לוי", "Levi"),
    idType: "id",
    idNumber: "025637891",
    phone: "0523318847",
    birthDate: "1975-05-11",
    gender: "male",
    hmo: m("מכבי", "Maccabi"),
    payer: m("משרד הביטחון", "Ministry of Defense"),
  },
  {
    id: "pat-10",
    firstName: m("תמר", "Tamar"),
    lastName: m("גולדשטיין", "Goldstein"),
    idType: "id",
    idNumber: "301928374",
    phone: "0528810293",
    birthDate: "1996-02-03",
    gender: "female",
    hmo: m("כללית", "Clalit"),
    payer: m("קופת חולים", "HMO"),
  },
];


/**
 * מאגר מטופלים נוסף, דטרמיניסטי - כדי שהיומנים של עשרות המנתחים
 * לא יחזרו על אותם עשרה שמות. הנתונים בדויים לחלוטין.
 */
const EXTRA_PATIENTS: [first: string, last: string, gender: Patient["gender"]][] = [
  [m("אבי", "Avi"), m("שרעבי", "Sharabi"), "male"], [m("תמר", "Tamar"), m("לוינסון", "Levinson"), "female"], [m("ניסים", "Nissim"), m("אוחיון", "Ohayon"), "male"],
  [m("ורד", "Vered"), m("כהן־ארז", "Cohen-Erez"), "female"], [m("בוריס", "Boris"), m("קרמר", "Kramer"), "male"], [m("סיגל", "Sigal"), m("מזרחי", "Mizrahi"), "female"],
  [m("יונתן", "Yonatan"), m("פרץ", "Peretz"), "male"], [m("אורנה", "Orna"), m("בן דוד", "Ben David"), "female"], [m("ראמי", "Rami"), m("חורי", "Khoury"), "male"],
  [m("לינא", "Lina"), m("סלאמה", "Salameh"), "female"], [m("גדעון", "Gideon"), m("שפירא", "Shapira"), "male"], [m("מירב", "Meirav"), m("אלקיים", "Elkayam"), "female"],
  [m("סרגיי", "Sergei"), m("וולקוב", "Volkov"), "male"], [m("חנה", "Hana"), m("רוזנטל", "Rosenthal"), "female"], [m("מוחמד", "Mohammed"), m("זועבי", "Zoabi"), "male"],
  [m("דליה", "Dalia"), m("אשכנזי", "Ashkenazi"), "female"], [m("אליהו", "Eliyahu"), m("בוזגלו", "Buzaglo"), "male"], [m("נעמי", "Naomi"), m("שטרית", "Shitrit"), "female"],
  [m("ארתור", "Arthur"), m("גרינברג", "Greenberg"), "male"], [m("רונית", "Ronit"), m("עמר", "Amar"), "female"], [m("פאדי", "Fadi"), m("נסראללה", "Nasrallah"), "male"],
  [m("יעל", "Yael"), m("דיין", "Dayan"), "female"], [m("מרדכי", "Mordechai"), m("וייסמן", "Weissman"), "male"], [m("אילנה", "Ilana"), m("צור", "Tzur"), "female"],
  [m("סמיר", "Samir"), m("חדאד", "Haddad"), "male"], [m("ציפי", "Tzipi"), m("גבאי", "Gabai"), "female"], [m("ולדימיר", "Vladimir"), m("אורלוב", "Orlov"), "male"],
  [m("שושנה", "Shoshana"), m("אזולאי", "Azoulay"), "female"], [m("עמית", "Amit"), m("רוטשילד", "Rothschild"), "male"], [m("הדס", "Hadas"), m("ניר", "Nir"), "female"],
  [m("יעקב", "Yaakov"), m("מלכה", "Malka"), "male"], [m("רבקה", "Rivka"), m("פינטו", "Pinto"), "female"], [m("איברהים", "Ibrahim"), m("מנסור", "Mansour"), "male"],
  [m("גלית", "Galit"), m("סבן", "Saban"), "female"], [m("ארנון", "Arnon"), m("בר לב", "Bar Lev"), "male"], [m("אסתר", "Esther"), m("דהן", "Dahan"), "female"],
  [m("ניקולאי", "Nikolai"), m("פטרוב", "Petrov"), "male"], [m("מיכל", "Michal"), m("אבוטבול", "Abutbul"), "female"], [m("חיים", "Haim"), m("שוורץ", "Schwartz"), "male"],
  [m("לילך", "Lilach"), m("בן חמו", "Ben Hamo"), "female"],
];

const HMOS = [m("כללית", "Clalit"), m("מכבי", "Maccabi"), m("מאוחדת", "Meuhedet"), m("לאומית", "Leumit")];
const PAYERS = [m("קופת חולים", "HMO"), m("ביטוח פרטי", "Private insurance"), m("פרטי", "Private")];

const generatedPatients: Patient[] = EXTRA_PATIENTS.map(([first, last, gender], i) => ({
  id: `pat-${i + 11}`,
  firstName: first,
  lastName: last,
  idType: "id",
  idNumber: String(200000000 + i * 3719483).slice(0, 9),
  phone: `05${2 + (i % 4)}${String(1000000 + i * 81743).slice(0, 7)}`,
  birthDate: `${1948 + ((i * 7) % 52)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`,
  gender,
  hmo: HMOS[i % HMOS.length],
  payer: PAYERS[i % PAYERS.length],
}));

patients.push(...generatedPatients);

/** המטופלת המחוברת לאזור האישי */
export const currentPatient = patients[0];

export function searchPatients(query: string): Patient[] {
  const q = query.trim();
  if (q.length < 2) return [];
  return patients
    .filter(
      (p) =>
        p.firstName.includes(q) ||
        p.lastName.includes(q) ||
        `${p.firstName} ${p.lastName}`.includes(q) ||
        p.idNumber.includes(q),
    )
    .slice(0, 5);
}
