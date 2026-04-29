import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, AlertCircle, Clock, ChevronRight, ExternalLink } from "lucide-react";
import './Documents.css';

export default function Documents() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fixedExamTypes = [
        "Exámenes de laboratorio",
        "Ecografía abdominal",
        "Endoscopía digestiva alta",
        "Bioimpedanciometría",
        "Electrocardiograma",
        "Ecocardiograma"
    ];

    const [documentList, setDocumentList] = useState([
        { id: 1, name: "Resultado Lab Enero", date: "2024-01-15", type: "Exámenes de laboratorio" },
        { id: 2, name: "Eco Abdominal Preventiva", date: "2023-10-20", type: "Ecografía abdominal" },
        { id: 3, name: "Electrocardiograma Anual", date: "2023-11-05", type: "Electrocardiograma" },
        { id: 4, name: "Receta Médica Gripe", date: "2023-11-15", type: "Otros" },
        { id: 5, name: "Certificado de Salud", date: "2023-12-01", type: "Otros" },
    ]);

    const getLatestExam = (type) => {
        return documentList
            .filter(doc => doc.type === type)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    const otherDocs = documentList.filter(doc => !fixedExamTypes.includes(doc.type));

    return (
        <div className="documents-container">
            <header className="documents-header">
                <div>
                    <h1>Mis Documentos Médicos</h1>
                    <p className="documents-subtitle">Gestiona tus exámenes obligatorios y documentos adicionales.</p>
                </div>
                <button className="documents-upload-button" onClick={() => setIsPanelOpen(true)}>
                    <Upload size={18} /> Subir contenido
                </button>
            </header>

            <hr className="divider" />

            <section className="fixed-exams-section">
                <h2 className="section-subtitle">Exámenes de Control</h2>
                <div className="exams-grid">
                    {fixedExamTypes.map((type, index) => {
                        const lastExam = getLatestExam(type);
                        return (
                            <div key={index} className={`exam-card ${!lastExam ? 'missing' : ''}`}>
                                <div className="exam-card-header">
                                    <FileText size={20} className="icon" />
                                    <h3>{type}</h3>
                                </div>
                                
                                {lastExam ? (
                                    <div className="exam-card-body">
                                        <p className="exam-name">{lastExam.name}</p>
                                        <span className="exam-date">Actualizado: {lastExam.date}</span>
                                        <div className="exam-actions">
                                            <button className="view-history">Ver historial</button>
                                            <button className="download-small">Ver</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="exam-card-body empty">
                                        <AlertCircle size={16} />
                                        <p>Este examen aún no ha sido guardado</p>
                                        <button className="upload-link">Subir ahora</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <hr className="divider" />

            <section className="others-section">
                <h2 className="section-subtitle">Otros Documentos</h2>
                <div className="others-list">
                    {otherDocs.length > 0 ? (
                        otherDocs.map((doc) => (
                            <div key={doc.id} className="other-doc-row">
                                <div className="doc-main-info">
                                    <Clock size={16} />
                                    <span className="doc-date">{doc.date}</span>
                                    <span className="doc-name">{doc.name}</span>
                                </div>
                                <div className="doc-tags">
                                    <span className="tag">{doc.type}</span>
                                    <button className="download-row-btn">Descargar</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">No hay otros documentos registrados.</p>
                    )}
                </div>
            </section>
        
        {isPanelOpen && (
        <div className="education-panel-backdrop">
          <aside className="education-upload-panel">
            <div className="education-panel-header">
              <div>
                <h2>Subir documente</h2>
                <p>Agrega tus exámenes y documentos imprtantes para tenerlos en un lugar!</p>
              </div>
            </div>

            <form className="education-upload-form">
              <label>
                <span>Título</span>
                <input type="text" placeholder="Ej: Ecocardiograma" />
              </label>

              <label>
                <span>Tipo de documento</span>
                <select className="documents-select">
                    <option value="">Selecciona un tipo</option>
                    {fixedExamTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                    <option value="Otros">Otros</option>
                </select>
              </label>

              <label>
                <span>Descripción</span>
                <textarea placeholder="Describe brevemente el contenido..." rows="4" />
              </label>

              <label>
                <span>Imagen o archivo</span>
                <div className="education-file-input">
                  <Upload size={24} />
                  <p>Arrastra un archivo o haz click para subir</p>
                  <small>PNG, JPG, MP4 o MOV</small>
                  <input type="file" accept="image/*,pdf/*" />
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