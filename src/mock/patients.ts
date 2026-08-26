import type { Patient } from "../types";

export const patients: Patient[] = [
  {
    id: "pat-1",
    firstName: "עידית",
    lastName: "גאז",
    idType: "id",
    idNumber: "37336278",
    phone: "0523372667",
    birthDate: "1984-03-12",
    gender: "female",
    hmo: "מכבי",
    payer: "קופת חולים",
  },
  {
    id: "pat-2",
    firstName: "יוסי",
    lastName: "אברהמי",
    idType: "id",
    idNumber: "058231947",
    phone: "0528834712",
    birthDate: "1971-11-02",
    gender: "male",
    hmo: "כללית",
    payer: "ביטוח פרטי",
  },
  {
    id: "pat-3",
    firstName: "רחל",
    lastName: "ברקוביץ",
    idType: "id",
    idNumber: "029384756",
    phone: "0542211903",
    birthDate: "1958-06-24",
    gender: "female",
    hmo: "מאוחדת",
    payer: "קופת חולים",
  },
  {
    id: "pat-4",
    firstName: "משה",
    lastName: "קליין",
    idType: "id",
    idNumber: "031847265",
    phone: "0503318842",
    birthDate: "1966-01-15",
    gender: "male",
    hmo: "כללית",
    payer: "קופת חולים",
  },
  {
    id: "pat-5",
    firstName: "נועה",
    lastName: "שרעבי",
    idType: "id",
    idNumber: "204183957",
    phone: "0537719234",
    birthDate: "1992-08-30",
    gender: "female",
    hmo: "מכבי",
    payer: "מימון עצמי",
  },
  {
    id: "pat-6",
    firstName: "אנה",
    lastName: "פטרוב",
    idType: "passport",
    idNumber: "K8273645",
    phone: "0526691823",
    birthDate: "1979-04-18",
    gender: "female",
    hmo: "לאומית",
    payer: "ביטוח פרטי",
  },
  {
    id: "pat-7",
    firstName: "דניאל",
    lastName: "כהן",
    idType: "id",
    idNumber: "312845679",
    phone: "0549912384",
    birthDate: "1988-12-07",
    gender: "male",
    hmo: "כללית",
    payer: "קופת חולים",
  },
  {
    id: "pat-8",
    firstName: "שרה",
    lastName: "מזרחי",
    idType: "id",
    idNumber: "067192834",
    phone: "0507734519",
    birthDate: "1949-09-21",
    gender: "female",
    hmo: "מאוחדת",
    payer: "קופת חולים",
  },
  {
    id: "pat-9",
    firstName: "אבי",
    lastName: "לוי",
    idType: "id",
    idNumber: "025637891",
    phone: "0523318847",
    birthDate: "1975-05-11",
    gender: "male",
    hmo: "מכבי",
    payer: "משרד הביטחון",
  },
  {
    id: "pat-10",
    firstName: "תמר",
    lastName: "גולדשטיין",
    idType: "id",
    idNumber: "301928374",
    phone: "0528810293",
    birthDate: "1996-02-03",
    gender: "female",
    hmo: "כללית",
    payer: "קופת חולים",
  },
];

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
