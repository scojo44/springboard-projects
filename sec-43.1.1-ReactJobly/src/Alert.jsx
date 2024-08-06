import React from 'react'
import './Alert.css'

export default function Alert({type, messages = []}) {
  return (
    <aside className={`Alert ${type}`}>
      {messages.map(m => <p>{m}</p>)}
    </aside>
  );
}
