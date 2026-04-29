import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Activity,
  CheckCircle,
  Search,
  UserPlus,
} from "lucide-react";
import { patientsMock } from "../../data/mock/patientsMock";
import "./Patients.css";

const riskOrder = {
  "riesgo vital": 1,
  urgente: 2,
  estable: 3,
};

function getRiskIcon(risk) {
  if (risk === "riesgo vital") return <AlertTriangle size={28} />;
  if (risk === "urgente") return <Activity size={28} />;
  return <CheckCircle size={28} />;
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("urgency");

  const filteredPatients = useMemo(() => {
    let result = patientsMock.filter((patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase())
    );

    if (orderBy === "urgency") {
      result = result.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
    }

    if (orderBy === "nextControl") {
      result = result.sort(
        (a, b) =>
          new Date(a.nextControl.split("/").reverse().join("-")) -
          new Date(b.nextControl.split("/").reverse().join("-"))
      );
    }

    if (orderBy === "postOpDays") {
      result = result.sort((a, b) => b.postOpDays - a.postOpDays);
    }

    return result;
  }, [search, orderBy]);

  const counts = {
    vital: patientsMock.filter((p) => p.risk === "riesgo vital").length,
    urgent: patientsMock.filter((p) => p.risk === "urgente").length,
    stable: patientsMock.filter((p) => p.risk === "estable").length,
  };

  return (
    <div className="patients-page">
      <section className="patients-header">
        <div>
          <h1>Pacientes</h1>
          {/* <p className="patients-subtitle">
            Gestión y seguimiento de pacientes bariátricos
          </p> */}
        </div>

        <button className="patients-add-button">
          <UserPlus size={20} />
          Agregar Paciente
        </button>
      </section>

      <section className="patients-risk-grid">
        <div className="patients-risk-card vital">
          <div>
            <p>Riesgo Vital</p>
            <h2>{counts.vital}</h2>
          </div>
          <AlertTriangle size={48} />
        </div>

        <div className="patients-risk-card urgent">
          <div>
            <p>Urgente</p>
            <h2>{counts.urgent}</h2>
          </div>
          <Activity size={48} />
        </div>

        <div className="patients-risk-card stable">
          <div>
            <p>Estable</p>
            <h2>{counts.stable}</h2>
          </div>
          <CheckCircle size={48} />
        </div>
      </section>

      <section className="patients-list-card">
        <div className="patients-filters">
          <div className="patients-search">
            <Search size={22} />
            <input
              type="text"
              placeholder="Buscar paciente por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="patients-order-select"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="urgency">Ordenar por urgencia</option>
            <option value="nextControl">Próximo control</option>
            <option value="postOpDays">Días post-op</option>
          </select>
        </div>

        <div className="patients-list">
          {filteredPatients.map((patient) => (
            <article
              key={patient.id}
              className={`patient-card ${patient.risk.replace(" ", "-")}`}
            >
              <div className="patient-card-top">
                <div className="patient-main-info">
                  <div className="patient-risk-icon">
                    {getRiskIcon(patient.risk)}
                  </div>

                  <div>
                    <h2>{patient.name}</h2>
                    <p>
                      {patient.age} años <span>•</span> {patient.surgeryType}{" "}
                      <span>•</span> {patient.postOpDays} días post-op
                    </p>
                  </div>
                </div>

                <span className={`patient-risk-badge ${patient.risk.replace(" ", "-")}`}>
                  {patient.risk}
                </span>
              </div>

              <div className="patient-alert-box">
                <div className="patient-alert-title">
                  <AlertTriangle size={18} />
                  <span>Motivo de alerta:</span>
                </div>
                <p>{patient.alertReason}</p>
              </div>

              <div className="patient-metrics-grid">
                <div className="patient-metric">
                  <span>Peso Actual</span>
                  <strong>{patient.currentWeight}</strong>
                </div>

                <div className="patient-metric">
                  <span>IMC</span>
                  <strong>{patient.imc}</strong>
                </div>

                <div className="patient-metric">
                  <span>Último Control</span>
                  <strong>{patient.lastControl}</strong>
                </div>

                <div className="patient-metric">
                  <span>Próximo Control</span>
                  <strong>{patient.nextControl}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}