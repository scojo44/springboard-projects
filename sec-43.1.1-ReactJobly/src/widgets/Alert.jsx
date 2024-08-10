import React from 'react'
import './Alert.css'

export default function Alert({type, messages = []}) {
  return (
    <aside className={`Alert ${type}`}>
      {messages.map((m,i) => <p key={i}>{m}</p>)}
    </aside>
  );
}
