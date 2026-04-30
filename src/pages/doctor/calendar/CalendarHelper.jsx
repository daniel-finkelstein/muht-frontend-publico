import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

import { useUser } from "../../../services/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

export function EventCreator({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time || !duration || !location || !patient || !doctor) {
      return alert("Por favor completa todos los campos");
    }
    onCreate({ title, date, time, duration, location, patient, doctor });
    setTitle("");
    setDate("");
    setTime("");
    setDuration("");
    setLocation("");
    setPatient("");
    setDoctor("");
  }

  return (
    <div className="event-creator">
      <h3>Crear Nueva Cita</h3>
      <form onSubmit={handleSubmit} className="event-creator-form">
        <div className="form-column">
          <div className="form-row">
            <input className="event-creator-input"
              placeholder="Título" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <input className="event-creator-input"
              type="date"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
            <input className="event-creator-input"
              type="time"
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />
            <input className="event-creator-input"
              placeholder="Duración (ej: 30 min)" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
          </div>
          <div className="form-row">
            <input className="event-creator-input"
              placeholder="Lugar" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
            <input className="event-creator-input"
              placeholder="Paciente" 
              value={patient} 
              onChange={(e) => setPatient(e.target.value)} 
            />
            <input className="event-creator-input"
              placeholder="Médico" 
              value={doctor} 
              onChange={(e) => setDoctor(e.target.value)} 
            />
          </div>  
        </div>  
        <div className="form-column">
          <button type="submit" className="button">Crear Cita</button>
        </div>
      </form>
    </div>
  );
}

export function EventCard({ event, role }) {
  const renderDoctorButtons = (event) => {
    return (
      <div className="doctor-actions">
        <button 
          className="button-complete" 
          onClick={() => { setSelectedEvent(event); setShowCompleteModal(true); }}
        >
          Completar
        </button>
        <button 
          className="button-cancel-outline" 
          onClick={() => { setSelectedEvent(event); setShowCancelConfirm(true); }}
        >
          Cancelar
        </button>
      </div>
    );
  };

  const renderReminder = (reminder, status) => {
    if (reminder == "" || status != "Pendiente") { 
      return;
    }
    return (<div className="event-reminder"><strong>Recordatorio:</strong> {reminder}</div>);
  }

  return (
    <div key={event.id} className="calendar-event">
      <div className="event-info">
        <div className="event-left-info">
          <div className="event-date">{event.date}</div>
          <div className="event-time">{event.time}</div>
        </div>
        <div className="event-right-info">
          <div className="event-title"><strong>{event.title}</strong></div>
          <div className="event-duration"><strong>Duración:</strong> {event.duration}</div>
          <div className="event-right-subinfo">
            <div className="event-location"><strong>Lugar:</strong> {event.location}</div>
            <div className="event-doctor"><strong>Médico:</strong> {event.doctor}</div>
          </div>
        </div>
      </div>
      {event.status === 'Pendiente' && (
        role === 'professional' ? (renderDoctorButtons(event)) : renderReminder(event.reminder, event.status)
      )}
    </div>
  )
}