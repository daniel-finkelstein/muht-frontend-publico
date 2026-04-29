import "./Notifications.css";
import {
  Bell,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    patient: "Ana María Rodríguez",
    subject: "Molestias abdominales",
    date: "10/04/2026 08:30",
    type: "urgent",
    unread: true,
    status: "pending",
    message:
      "Doctora, desde ayer en la noche he tenido molestias abdominales intermitentes. No son muy fuertes pero me preocupan. ¿Debería ir a urgencias o esperar a mi control?",
  },
  {
    id: 2,
    patient: "Juan Pérez",
    subject: "Duda sobre suplementación",
    date: "09/04/2026 15:45",
    type: "normal",
    unread: false,
    status: "answered",
    message:
      "Tengo una duda sobre los suplementos indicados después del control.",
  },
  {
    id: 3,
    patient: "María López",
    subject: "Confirmación de asistencia",
    date: "09/04/2026 11:20",
    type: "normal",
    unread: false,
    status: "pending",
    message: "Confirmo mi asistencia al próximo control.",
  },
  {
    id: 4,
    patient: "Carlos Fuentes",
    subject: "Actividad física",
    date: "08/04/2026 18:00",
    type: "normal",
    unread: false,
    status: "answered",
    message: "Quería consultar si puedo aumentar la intensidad del ejercicio.",
  },
  {
    id: 5,
    patient: "Felipe Rojas",
    subject: "Vómitos persistentes",
    date: "08/04/2026 09:15",
    type: "urgent",
    unread: false,
    status: "answered",
    message: "He tenido vómitos persistentes durante el día.",
  },
];

export default function NotificationsPage() {
  const selectedNotification = notifications[0];

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <h1>Notificaciones</h1>
        {/* <p>Mensajes y consultas recibidas de los pacientes</p> */}
      </header>

      <section className="notifications-summary">
        <div className="notification-stat-card">
          <div className="notification-stat-icon purple">
            <Bell size={20} />
          </div>
          <span>No Leídas</span>
          <strong>1</strong>
        </div>

        <div className="notification-stat-card">
          <div className="notification-stat-icon red">
            <AlertCircle size={20} />
          </div>
          <span>Urgentes Pendientes</span>
          <strong>1</strong>
        </div>

        <div className="notification-stat-card">
          <div className="notification-stat-icon purple">
            <CheckCircle size={20} />
          </div>
          <span>Respondidas Hoy</span>
          <strong>3</strong>
        </div>
      </section>

      <section className="notifications-content">
        <aside className="notifications-inbox">
          <h2>Bandeja de Entrada</h2>

          <div className="notifications-list">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className={`notification-list-item ${notification.type} ${
                  selectedNotification.id === notification.id ? "active" : ""
                }`}
              >
                <div className="notification-list-icon">
                  {notification.type === "urgent" ? (
                    <AlertCircle size={16} />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                </div>

                <div className="notification-list-text">
                  <span>{notification.patient}</span>
                  <strong>{notification.subject}</strong>
                  <small>{notification.date}</small>
                </div>

                <div className="notification-list-status">
                  {notification.unread && <span className="unread-dot" />}
                  {notification.status === "answered" && (
                    <CheckCircle size={14} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <article className="notification-detail-card">
          <div className="notification-detail-header">
            <div>
              <h2>{selectedNotification.subject}</h2>
              <p>De: {selectedNotification.patient}</p>

              <div className="notification-detail-date">
                <Clock size={14} />
                <span>{selectedNotification.date}</span>
              </div>
            </div>

            <span className="notification-badge">Urgente</span>
          </div>

          <div className="notification-message-box">
            {selectedNotification.message}
          </div>

          <div className="notification-reply">
            <h3>Responder</h3>

            <textarea placeholder="Escribe tu respuesta al paciente..." />

            <div className="notification-reply-actions">
              <button className="notification-send-button">
                <Send size={16} />
                Enviar Respuesta
              </button>

              <button className="notification-cancel-button">Cancelar</button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}