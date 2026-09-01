import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ToastProvider } from "./components/overlay/Toast";
import { DataProvider } from "./state/data";
import { LoginDoctor } from "./pages/LoginDoctor";
import { LoginPatient } from "./pages/LoginPatient";
import { Verify } from "./pages/Verify";
import { DoctorSchedule } from "./pages/DoctorSchedule";
import { DoctorAllSurgeries } from "./pages/DoctorAllSurgeries";
import { SurgeryView } from "./pages/SurgeryView";
import { PatientDashboard } from "./pages/PatientDashboard";
import { PatientAppointments } from "./pages/PatientAppointments";
import { AppointmentDetails } from "./pages/AppointmentDetails";
import { AppointmentDetailsSheet } from "./features/patient-appointments/AppointmentDetailsSheet";
import { appointments } from "./mock/appointments";
import { PatientDocuments } from "./pages/PatientDocuments";
import { PatientResults } from "./pages/PatientResults";
import { KitchenSink } from "./pages/KitchenSink";
import { NoAccess } from "./pages/NoAccess";
import { NotFound } from "./pages/NotFound";

/** איפוס גלילה במעבר בין מסכים */
function ScrollToTop() {
  const location = useLocation();
  const overlay = Boolean((location.state as { background?: unknown } | null)?.background);
  useEffect(() => {
    // שכבת-על נפתחת מעל הרשימה - אין לאפס את הגלילה שמאחוריה
    if (overlay) return;
    window.scrollTo(0, 0);
  }, [location.pathname, overlay]);
  return null;
}

/** /surgery/new נפתח כמודל מעל היומן - הפניה עם פרמטרים */
function NewSurgeryRedirect() {
  const [sp] = useSearchParams();
  const params = new URLSearchParams({ new: "1" });
  const date = sp.get("date");
  const time = sp.get("time");
  if (date) params.set("date", date);
  if (time) params.set("time", time);
  return <Navigate to={`/doctor/doc-1/schedule?${params.toString()}`} replace />;
}

/** עריכת ניתוח מתבצעת inline במסך הצפייה */
function EditSurgeryRedirect() {
  const { surgeryId } = useParams();
  return <Navigate to={`/surgery/${surgeryId}?edit=1`} replace />;
}

/** פרטי תור כשכבת-על מעל הרשימה; סגירה מחזירה לרשימה שממנה נכנסו */
function AppointmentOverlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return null;
  return <AppointmentDetailsSheet appointment={appointment} onClose={() => navigate(-1)} />;
}

function AppRoutes() {
  const location = useLocation();
  // ניווט מתוך רשימה שולח את המיקום הקודם ב-state; הרשימה נשארת מאחורי השכבה
  const background = (location.state as { background?: typeof location } | null)?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* מנתח */}
        <Route path="/login" element={<LoginDoctor />} />
        <Route path="/verify" element={<Verify audience="doctor" />} />
        <Route path="/doctor/:doctorId/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/:doctorId/all" element={<DoctorAllSurgeries />} />
        <Route path="/surgery/new" element={<NewSurgeryRedirect />} />
        <Route path="/surgery/:surgeryId/edit" element={<EditSurgeryRedirect />} />
        <Route path="/surgery/:surgeryId" element={<SurgeryView />} />

        {/* מטופל */}
        <Route path="/p/login" element={<LoginPatient />} />
        <Route path="/p/verify" element={<Verify audience="patient" />} />
        <Route path="/p" element={<PatientDashboard />} />
        <Route path="/p/appointments" element={<PatientAppointments mode="upcoming" />} />
        <Route path="/p/appointments/past" element={<PatientAppointments mode="past" />} />
        {/* קישורים ישנים */}
        <Route path="/p/upcoming" element={<Navigate to="/p/appointments" replace />} />
        <Route path="/p/past" element={<Navigate to="/p/appointments/past" replace />} />
        <Route path="/p/appointment/:id" element={<AppointmentDetails />} />
        <Route path="/p/results" element={<PatientResults />} />
        <Route path="/p/documents" element={<PatientDocuments />} />

        {/* פיתוח */}
        <Route path="/kitchen-sink" element={<KitchenSink />} />
        <Route path="/no-access" element={<NoAccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/p/appointment/:id" element={<AppointmentOverlay />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </DataProvider>
  );
}
