import { useState } from "react";
import { useUser } from "../../services/UserContext";
import { BookOpen, CheckCircle, Circle, Upload, X } from "lucide-react";
import { educationModulesMock, educationStatsMock } from "../../data/mock/educationMock";
import "./Education.css";

export default function EducationPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const { userProfile } = useUser();
  const userRole = userProfile?.role;
  const canUpload = userRole !== "patient";

  return (
    <div className="education-page">
      <section className="education-header">
        <div>
          <h1>Contenido Educativo</h1>
          <p className="education-subtitle">
            Material informativo y recursos para el proceso postoperatorio
          </p>
        </div>
        {canUpload && (
          <button
            className="education-upload-button"
            onClick={() => setIsPanelOpen(true)}
          >
            <Upload size={18} />
            Subir contenido
          </button>
        )}
      </section>

      <section className="education-stats-grid">
        {educationStatsMock.map((stat) => (
          <article className="education-stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <div className="education-progress-track">
              <div style={{ width: `${stat.progress}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="education-modules">
        {educationModulesMock.map((module) => {
          const progress = Math.round((module.completed / module.total) * 100);

          return (
            <article className="education-module-card" key={module.id}>
              <div className="education-module-header">
                <div className="education-module-title-wrap">
                  <BookOpen size={24} />
                  <h2>{module.title}</h2>
                </div>

                <span>{module.completed}/{module.total} completados</span>
              </div>

              <div className="education-progress-track module">
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="education-lessons-grid">
                {module.lessons.map((lesson) => (
                  <div
                    className={`education-lesson-item ${lesson.status}`}
                    key={lesson.title}
                  >
                    {lesson.status === "completed" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {isPanelOpen && canUpload && (
        <div className="education-panel-backdrop">
          <aside className="education-upload-panel">
            <div className="education-panel-header">
              <div>
                <h2>Subir contenido</h2>
                <p>Agrega material educativo para pacientes.</p>
              </div>
            </div>

            <form className="education-upload-form">
              <label>
                <span>Título</span>
                <input type="text" placeholder="Ej: Alimentación en fase líquida" />
              </label>

              <label>
                <span>Descripción</span>
                <textarea placeholder="Describe brevemente el contenido..." rows="4" />
              </label>

              <label>
                <span>Imagen o video</span>
                <div className="education-file-input">
                  <Upload size={24} />
                  <p>Arrastra un archivo o haz click para subir</p>
                  <small>PNG, JPG, MP4 o MOV</small>
                  <input type="file" accept="image/*,video/*" />
                </div>
              </label>

              <div className="education-form-actions">
                <button type="button" className="education-secondary-button" onClick={() => setIsPanelOpen(false)}>
                  Cancelar
                </button>
                <button type="button" className="education-primary-button">
                  Guardar contenido
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}