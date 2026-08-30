import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
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
import { PatientHome } from "./pages/PatientHome";
import { AppointmentDetails } from "./pages/AppointmentDetails";
import { PatientPast } from "./pages/PatientPast";
import { PatientDocuments } from "./pages/PatientDocuments";
import { PatientResults } from "./pages/PatientResults";
import { KitchenSink } from "./pages/KitchenSink";
import { NoAccess } from "./pages/NoAccess";
import { NotFound } from "./pages/NotFound";

/** איפוס גלילה במעבר בין מסכים */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
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
            <Route path="/p" element={<PatientHome />} />
            {/* קישורים ישנים - מסך הבית הוא מסך התורים */}
            <Route path="/p/appointments" element={<Navigate to="/p" replace />} />
            <Route path="/p/upcoming" element={<Navigate to="/p" replace />} />
            <Route path="/p/past" element={<PatientPast />} />
            <Route path="/p/appointment/:id" element={<AppointmentDetails />} />
            <Route path="/p/results" element={<PatientResults />} />
            <Route path="/p/documents" element={<PatientDocuments />} />

            {/* פיתוח */}
            <Route path="/kitchen-sink" element={<KitchenSink />} />
            <Route path="/no-access" element={<NoAccess />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </DataProvider>
  );
}
