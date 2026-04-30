import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';

import { useUser } from "../../../services/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

import PatientMessagesPage from './PatientMessagesPage';
import DoctorMessagesPage from './DoctorMessagesPage';

export default function MessagesPage() {
  const { userProfile, loading } = useUser();
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  if (loading) {
      return (
        <div className="message-container">
          <div className="loading-spinner">Cargando mensajes...</div>
        </div>
      );
    }
  
    if (!userProfile) {
      return <div className="message-container">No se pudo cargar el perfil. Reintenta iniciar sesión.</div>;
    }
  
    if (userProfile.role === 'professional') {
      return <DoctorMessagesPage />;
    }
  
    if (userProfile.role === 'patient') {
      return <PatientMessagesPage />;
    }
  
    return <div className="message-container">Acceso no autorizado o rol desconocido.</div>;
}