import { Calendar, ClipboardList, Hospital, Stethoscope } from "lucide-react";
import { Card } from "../components/shared/Card";
import "./SurgeryPage.css";

const surgery = {
  patientName: "Ana María Rodríguez",
  surgeryDate: "08/10/2025",
  dischargeDate: "11/10/2025",
  surgeryType: "Manga Gástrica",
  status: "Postoperatorio activo",
  statusType: "active",
  basicInstructions: [
    "Mantener dieta líquida según indicación nutricional.",
    "Evitar esfuerzos físicos durante las primeras semanas.",
    "Tomar medicamentos según pauta médica.",
    "Asistir a controles postoperatorios programados.",
  ],
  notes: [
    {
      title: "Evolución inicial",
      text: "Paciente evoluciona estable, sin signos de complicaciones inmediatas.",
    },
    {
      title: "Cuidados generales",
      text: "Reforzar hidratación, control de dolor y seguimiento de tolerancia alimentaria.",
    },
  ],
};

export default function SurgeryPage() {
  return (
    <div className="surgery-page">
      <div className="surgery-page-header">
        <div>
          <h1>Cirugía</h1>
          <p>Información quirúrgica e indicaciones postoperatorias</p>
        </div>

        <StatusBadge label={surgery.status} type={surgery.statusType} />
      </div>

      <div className="surgery-grid">
        <SurgeryInfoCard surgery={surgery} />
        <PostOpNotesCard surgery={surgery} />
      </div>
    </div>
  );
}

function SurgeryInfoCard({ surgery }) {
  return (
    <Card className="surgery-info-card">
      <h3>Datos de Cirugía</h3>

      <div className="surgery-info-list">
        <InfoItem
          icon={<Calendar size={20} />}
          label="Fecha cirugía"
          value={surgery.surgeryDate}
        />

        <InfoItem
          icon={<Hospital size={20} />}
          label="Fecha alta"
          value={surgery.dischargeDate}
        />

        <InfoItem
          icon={<Stethoscope size={20} />}
          label="Tipo cirugía"
          value={surgery.surgeryType}
        />
      </div>

      <div className="basic-instructions">
        <h4>Indicaciones básicas</h4>

        <ul>
          {surgery.basicInstructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function PostOpNotesCard({ surgery }) {
  return (
    <Card className="post-op-notes-card">
      <h3>Notas Postoperatorias</h3>

      <div className="post-op-notes-list">
        {surgery.notes.map((note) => (
          <div className="post-op-note" key={note.title}>
            <div className="post-op-note-icon">
              <ClipboardList size={20} />
            </div>

            <div>
              <h4>{note.title}</h4>
              <p>{note.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatusBadge({ label, type = "default" }) {
  return <span className={`status-badge ${type}`}>{label}</span>;
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="surgery-info-item">
      <div className="surgery-info-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <p>{value}</p>
      </div>
    </div>
  );
}