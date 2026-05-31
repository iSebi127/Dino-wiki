import React from 'react'
import DinoCard from './DinoCard'

export default function DinoGrid({ dinos, onSelect }) {
  if (!dinos || dinos.length === 0) return <div className="no-results">🦕 Niciun dinozaur nu a supraviețuit acestei căutări...</div>
  return (
    <div id="dinoGrid">
      {dinos.map((d, i) => (
        <DinoCard key={d.id || i} dino={d} index={i} onClick={() => onSelect(d)} />
      ))}
    </div>
  )
}

