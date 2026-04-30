import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';

export function MessageComposer({ contacts, onSend }) {
  const [to, setTo] = useState(contacts[0]?.id || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Por favor completa los campos");
    onSend({ to, subject, body });
    setSubject("");
    setBody("");
  };

  return (
    <div className="message-composer">
      <h3>Nuevo Mensaje</h3>
      <form onSubmit={handleSubmit}>
        <select className="select-composer" value={to} onChange={(e) => setTo(e.target.value)}>
          {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
        </select>
        <input className="input-composer"
          placeholder="Asunto" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
        />
        <textarea className="textarea-composer"
          placeholder="Escribe tu mensaje..." 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
        />
        <button type="submit" className="button">Enviar Correo</button>
      </form>
    </div>
  );
};

export function MessageThread({ thread, onReply }) {
  const [replyText, setReplyText] = useState("");

  return (
    <div className="message-thread">
      <div className="thread-header">
        <h4>Asunto: {thread.subject}</h4>
        <span className="thread-contact">Con: {thread.contactName}</span>
      </div>
      
      <div className="thread-messages">
        {thread.messages.map((msg) => (
          <div key={msg.id} className={`mail-card ${msg.senderRole === 'doctor' ? 'from-doctor' : 'from-patient'}`}>
            <div className="mail-meta">
              <strong>{msg.senderName}</strong> <span>{msg.time}</span>
            </div>
            <div className="mail-body">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="thread-reply">
        <textarea className="textarea-reply"
          placeholder="Responder a este hilo..." 
          value={replyText} 
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className="button" onClick={() => { onReply(thread.id, replyText); setReplyText(""); }}>
          Responder
        </button>
      </div>
    </div>
  );
};