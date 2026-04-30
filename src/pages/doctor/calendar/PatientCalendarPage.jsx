import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

import { useUser } from "../../../services/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

import { EventCreator, EventCard } from './CalendarHelper';

export default function PatientCalendarPage() {
  const { userProfile, loading } = useUser();
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const [dates, setDates] = useState([
    { id: 1, title: "Control Nutricional", date: "02-05-2026", time: "10:30", duration: "30 min", location: "Clínica Alemana Vitaucura", patient: "Roberto Roberts", doctor: "Dr. Gregorio Casa", status: "Pendiente", reminder: "Ayuno de 12 horas previas" },
    { id: 2, title: "Control Cardiológico", date: "08-05-2026", time: "14:00", duration: "45 min", location: "Clínica Las Condes", patient: "Roberto Roberts", doctor: "Dr. Juan Pérez", status: "Pendiente", reminder: "Comer al menos 5 horas antes" },
    { id: 3, title: "Control Endocrinológico", date: "15-05-2026", time: "9:00", duration: "30 min", location: "Clínica Santa María", patient: "Roberto Roberts", doctor: "Dra. Ana López", status: "Pendiente", reminder: "" },
    { id: 4, title: "Control General", date: "25-05-2026", time: "11:00", duration: "1 hr", location: "Clínica Dávila", patient: "Roberto Roberts", doctor: "Dr. Carlos Martínez", status: "Cancelada", reminder: "" },
    { id: 5, title: "Control Dermatológico", date: "04-06-2026", time: "15:30", duration: "30 min", location: "Clínica RedSalud", patient: "Roberto Roberts", doctor: "Dra. Laura Fernández", status: "Completada", reminder: "No usar cremas por de piel por 12 horas previo al control" },
  ]);

  const orderByDate = (a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  };

  const pending = dates.filter(event => event.status === 'Pendiente').sort(orderByDate);
  const completed = dates.filter(event => event.status === 'Completada').sort(orderByDate);
  const cancelled = dates.filter(event => event.status === 'Cancelada').sort(orderByDate);

  const nextAppointment = pending.length > 0 ? pending[0] : null;

  const renderEventsList = (eventsList) => {
    if (eventsList.length === 0) {
      return <p className="no-events-message">No hay citas en esta categoría.</p>;
    }
    return (
      <div className="calendar-events">
        {eventsList.map((event) => (
            <EventCard event={event} role={userProfile.role} />
        ))}
      </div>
    );
  }

  if (loading) return <div className="messages-page">Cargando perfil...</div>;
  
  if (error || !userProfile) return <div className="messages-page">{error || "Inicia sesión para continuar"}</div>;

  return (
    <div className="calendar-container">
      <h1>Calendario</h1>

      <div className="calendar-subtitle">Próximas Citas y Controles Programados</div>
      <div className="appointments-container">

        <section className="events-upcoming">
          <div className="events-header">Próxima Cita</div>
          {renderEventsList(nextAppointment ? [nextAppointment] : [])}
        </section>

        <section className="events-pending">
          <div className="events-header">Citas Pendientes ({pending.length})</div>
          {renderEventsList(pending)}
        </section>
        
        <section className="events-completed">
          <div className="events-header">Citas Completadas ({completed.length})</div>
          {renderEventsList(completed)}
        </section>

        <section className="events-cancelled">
          <div className="events-header">Citas Canceladas ({cancelled.length})</div>
          {renderEventsList(cancelled)}
        </section>

      </div>
    </div>
  );
}