import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';

import { useUser } from "../../../services/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

import { MessageComposer, MessageThread } from './MessagesHelpers';

export default function PatientMessagesPage() {
  const { userProfile, loading } = useUser();
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const patientContacts = [
    { id: 301, name: "Dr Gregorio Casa", role: "Doctor" },
    { id: 302, name: "Dra Ana Gómez", role: "Doctor" }
  ];
  
  const [threads, setThreads] = useState([
    {
      id: 101,
      subject: "Seguimiento de tratamiento - Presión Arterial",
      contactName: "Roberto Roberts",
      messages: [
        { id: 1, senderName: "Dr Gregorio Casa", senderRole: "Doctor", text: "Hola Roberto, ¿cómo vas con la dosis?", time: "2024-05-10 10:30" },
        { id: 2, senderName: "Roberto Roberts", senderRole: "Paciente", text: "Mejor, sin mareos.", time: "2024-05-10 11:00" }
      ]
    },
    {
      id: 102,
      subject: "Consulta sobre resultados de exámenes",
      contactName: "María Martínez",
      messages: [
        { id: 1, senderName: "María Martínez", senderRole: "Paciente", text: "¿Podría revisar mis últimos exámenes?", time: "2024-05-12 09:15" }
      ]
    },
    {
      id: 103,
      subject: "Revisión de síntomas - Dolor de cabeza",
      contactName: "Roberto Roberts",
      messages: [
        { id: 1, senderName: "Roberto Roberts", senderRole: "Paciente", text: "He tenido dolores de cabeza frecuentes.", time: "2024-05-15 14:45" },
        { id: 2, senderName: "Dr Gregorio Casa", senderRole: "Doctor", text: "¿Desde cuándo los tienes?", time: "2024-05-15 15:00" }
      ]
    }
  ]);

  //crear nuevo hilo
  const handleNewMessage = (data) => {
    console.log("Enviando nuevo correo:", data);
  };

  //responder a hilo existente
  const handleReply = (threadId, text) => {
    const newThreads = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [...t.messages, {
            id: Date.now(),
            senderName: userProfile.name,
            senderRole: userProfile.role,
            text: text,
            time: new Date().toLocaleString()
          }]
        };
      }
      return t;
    });
    setThreads(newThreads);
  };

  if (loading) return <div className="messages-page">Cargando perfil...</div>;
  
  if (error || !userProfile) return <div className="messages-page">{error || "Inicia sesión para continuar"}</div>;

  return (
    <div className="messages-page">
      <h1>Bandeja de Entrada</h1>

      <MessageComposer 
        contacts={userProfile.role === 'professional' ? doctorContacts : patientContacts} 
        onSend={handleNewMessage} 
      />

      <hr />

      <div className="threads-list">
        <h3>Tus Conversaciones</h3>
        {threads.map(thread => (
          <MessageThread 
            key={thread.id} 
            thread={thread} 
            onReply={handleReply} 
          />
        ))}
      </div>
    </div>
  );
}