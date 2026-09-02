import { useState, type ReactNode } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { Select } from "../components/primitives/Select";
import { Checkbox } from "../components/primitives/Checkbox";
import { Radio, RadioGroup } from "../components/primitives/Radio";
import { Toggle } from "../components/primitives/Toggle";
import { Textarea } from "../components/primitives/Textarea";
import { Card } from "../components/data/Card";
import { Chip, FilterChip, HospitalChip, KindChip } from "../components/data/Chip";
import { Badge } from "../components/data/Badge";
import { Avatar } from "../components/data/Avatar";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Table } from "../components/data/Table";
import { Modal } from "../components/overlay/Modal";
import { Drawer } from "../components/overlay/Drawer";
import { Dropdown } from "../components/overlay/Dropdown";
import { Tooltip } from "../components/overlay/Tooltip";
import { useToast } from "../components/overlay/Toast";
import { Field } from "../components/form/Field";
import { DatePicker } from "../components/form/DatePicker";
import { TimePicker } from "../components/form/TimePicker";
import { FileUpload, type UploadedFile } from "../components/form/FileUpload";
import { Stepper } from "../components/form/Stepper";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { BlockLegend } from "../components/calendar/BlockLegend";
import { MOCK_TODAY } from "../mock/doctors";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 border-b border-line pb-2 text-h2 text-ink">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-caption font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const selectOptions = [
  { value: "a", label: "כירורגיה כללית" },
  { value: "b", label: "אורתופדיה" },
  { value: "c", label: "אורולוגיה" },
];

export function KitchenSink() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [radio, setRadio] = useState<string | null>("a");
  const [select1, setSelect1] = useState<string | null>(null);
  const [selectMulti, setSelectMulti] = useState<string[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [calDate, setCalDate] = useState<string | null>(MOCK_TODAY);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-1 text-h1 text-ink">Kitchen Sink</h1>
      <p className="mb-8 text-muted">
        כל רכיבי המערכת העיצובית בכל המצבים. עמוד פיתוח - אינו חלק מהמוצר.
      </p>

      <Section title="Button">
        <Row label="variants">
          <Button>ראשי</Button>
          <Button variant="secondary">משני</Button>
          <Button variant="ghost">שקוף</Button>
          <Button variant="danger">מחיקה</Button>
        </Row>
        <Row label="sizes">
          <Button size="sm">קטן</Button>
          <Button size="md">בינוני</Button>
          <Button size="lg">גדול</Button>
        </Row>
        <Row label="states">
          <Button disabled>מושבת</Button>
          <Button loading>טוען</Button>
          <Button icon={<Plus className="h-4 w-4" />}>עם אייקון</Button>
        </Row>
      </Section>

      <Section title="Input / Textarea">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="רגיל" placeholder="טקסט..." />
          <Input label="עם אייקון" icon={<Search />} placeholder="חיפוש..." />
          <Input label="שגיאה" error="שדה חובה" defaultValue="ערך שגוי" />
          <Input label="מושבת" disabled defaultValue="לא ניתן לעריכה" />
          <Input label="עם רמז" hint="עד 9 ספרות" />
          <Textarea label="טקסט ארוך" placeholder="הערות..." />
        </div>
      </Section>

      <Section title="Select">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="בסיסי" options={selectOptions} value={select1} onChange={(v) => setSelect1(v as string | null)} clearable />
          <Select label="עם חיפוש" options={selectOptions} value={select1} onChange={(v) => setSelect1(v as string | null)} searchable />
          <Select label="מרובה" options={selectOptions} value={selectMulti} onChange={(v) => setSelectMulti((v as string[]) ?? [])} multiple />
        </div>
      </Section>

      <Section title="Checkbox / Radio / Toggle">
        <Row label="checkbox">
          <Checkbox label="ברירת מחדל" />
          <Checkbox label="מסומן" defaultChecked />
          <Checkbox label="מושבת" disabled />
          <Checkbox label="שגיאה" error />
        </Row>
        <Row label="radio">
          <RadioGroup
            name="ks-radio"
            options={[
              { value: "a", label: "אפשרות א" },
              { value: "b", label: "אפשרות ב" },
            ]}
            value={radio}
            onChange={setRadio}
          />
          <Radio name="ks-radio-d" label="מושבת" disabled />
        </Row>
        <Row label="toggle">
          <Toggle checked={toggle} onChange={setToggle} label="ניתוח משולב" />
          <Toggle checked={false} onChange={() => {}} label="כבוי" />
        </Row>
      </Section>

      <Section title="Chip / Badge / Avatar">
        <Row label="chips">
          <Chip color="primary">ראשי</Chip>
          <Chip color="success">הצלחה</Chip>
          <Chip color="warning">אזהרה</Chip>
          <Chip color="danger">שגיאה</Chip>
          <Chip color="neutral" onRemove={() => {}}>עם הסרה</Chip>
        </Row>
        <Row label="hospital / kind">
          <HospitalChip hospital="refael" />
          <HospitalChip hospital="elisha" />
          <KindChip kind="surgery" />
          <KindChip kind="consult" />
          <KindChip kind="test" />
          <KindChip kind="followup" />
        </Row>
        <Row label="filter chips">
          <FilterChip active>פעיל</FilterChip>
          <FilterChip>רגיל</FilterChip>
          <FilterChip active onClear={() => {}}>עם ניקוי</FilterChip>
        </Row>
        <Row label="badge / avatar">
          <Badge count={3} />
          <Badge count={120} />
          <Avatar name="דוחנו אולג" src="/avatars/doc-1.jpg" size="sm" />
          <Avatar name="דרקסלר מיכאל" src="/avatars/doc-2.jpg" size="md" />
          <Avatar name="חזן דוד" src="/avatars/doc-5.jpg" size="lg" />
          <Avatar name="בניקם שלווה" size="md" />
          <Avatar name="פריאל אילת" size="lg" />
        </Row>
      </Section>

      <Section title="Card / EmptyState / Skeleton">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-h3 text-ink">כרטיס</p>
            <p className="mt-1 text-muted">תוכן הכרטיס עם ריפוד ו-radius.</p>
          </Card>
          <Card padding="none">
            <EmptyState
              illustration="calendar"
              title="אין ניתוחים ליום זה"
              action={<Button variant="secondary" size="sm">יצירת ניתוח</Button>}
            />
          </Card>
        </div>
        <Row label="skeleton">
          <div className="flex w-full items-center gap-4">
            <Skeleton variant="circle" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="w-2/3" />
              <Skeleton className="w-1/3" />
            </div>
            <Skeleton variant="block" className="w-28" />
          </div>
        </Row>
      </Section>

      <Section title="Table">
        <Table
          caption="טבלת הדגמה"
          columns={[
            { key: "name", header: "שם", render: (r: { name: string; value: number }) => r.name, sortValue: (r) => r.name },
            { key: "value", header: "ערך", numeric: true, render: (r) => r.value, sortValue: (r) => r.value },
          ]}
          rows={[
            { name: "פריט ראשון", value: 42 },
            { name: "פריט שני", value: 7 },
          ]}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section title="Overlay">
        <Row label="modal / drawer / toast">
          <Button onClick={() => setModalOpen(true)}>פתיחת מודל</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>פתיחת מגירה</Button>
          <Button variant="ghost" onClick={() => toast("success", "פעולה הושלמה בהצלחה")}>Toast הצלחה</Button>
          <Button variant="ghost" onClick={() => toast("error", "אירעה שגיאה, נסו שוב")}>Toast שגיאה</Button>
          <Button variant="ghost" onClick={() => toast("info", "הודעת מידע", { label: "ביטול פעולה", onUndo: () => {} })}>Toast עם Undo</Button>
        </Row>
        <Row label="dropdown / tooltip">
          <Dropdown
            trigger={<Button variant="secondary">תפריט</Button>}
            items={[
              { key: "a", label: "עריכה", onSelect: () => {} },
              { key: "b", label: "מחיקה", danger: true, onSelect: () => {} },
            ]}
          />
          <Tooltip content="טקסט מלא שמופיע ב-tooltip">
            <span className="cursor-help text-body underline decoration-dotted">רחפו עליי</span>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Form">
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker label="תאריך" value={date} onChange={setDate} />
          <TimePicker label="שעה" value={time} onChange={setTime} />
        </div>
        <Field label="קובץ מצורף" hint="עד 4.5 מגה">
          {() => <FileUpload value={file} onChange={setFile} />}
        </Field>
        <Row label="stepper">
          <div className="w-full max-w-md">
            <Stepper steps={["פרטי המטופל", "פרטי הניתוח", "צירוף מסמכים"]} current={1} />
          </div>
        </Row>
      </Section>

      <Section title="Calendar">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <MonthCalendar
              today={MOCK_TODAY}
              selectedDate={calDate}
              onSelect={setCalDate}
              markedDates={{ "2026-07-28": "elisha", "2026-07-30": "refael", "2026-07-31": "telAviv" }}
              loadMinutes={{ "2026-07-29": 260, "2026-07-31": 45 }}
            />
          </Card>
          <Card>
            <BlockLegend />
          </Card>
        </div>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="מודל הדגמה"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>ביטול</Button>
            <Button onClick={() => setModalOpen(false)}>אישור</Button>
          </>
        }
      >
        <p className="text-body">
          תוכן המודל. סגירה ב-Escape, בלחיצה מחוץ למודל או בכפתור.
        </p>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="מגירה">
        <p className="text-body">תוכן המגירה.</p>
      </Drawer>
    </div>
  );
}
