import React, { useEffect, useState } from 'react'
import DinoForm from './DinoForm'

export default function Modal({ dino, onClose, onSaved, onDeleted }) {
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const dietClass = dino.diet.toLowerCase().includes('carnivor') ? 'diet-carnivor' : 'diet-ierbivor'
  const raw = dino.image ? dino.image.replace(/'/g, "%27") : `images/${dino.id}.jpg`
  // If the image is a data URL (base64) leave it intact. Otherwise preserve absolute URLs or root-relative paths.
  let inferred
  if (raw.startsWith('data:')) {
    inferred = raw
  } else if (raw.startsWith('/')) {
    inferred = raw
  } else if (raw.match(/^[a-zA-Z]+:\/\//)) {
    inferred = raw
  } else {
    inferred = '/' + raw
  }

  let heroPosY = '50%'
  if (dino.id === 'trex') heroPosY = '25%'
  else if (dino.id === 'brachiosaurus') heroPosY = '10%'

  useEffect(() => {
    // verify hero image
    const img = new Image()
    img.onerror = () => {
      const hero = document.querySelector('.modal-hero')
      if (hero) hero.remove()
    }
    img.src = inferred
  }, [inferred])

  async function handleDelete() {
    if (!confirm('Sigur vrei să ștergi acest dinozaur?')) return
    try {
      const resp = await fetch(`/api/dinosaurs/${dino.id}`, { method: 'DELETE' })
      if (resp.status === 204) {
        if (onDeleted) onDeleted(dino.id)
        onClose()
      } else {
        alert('Ștergere eșuată')
      }
    } catch (err) { alert('Eroare la ștergere') }
  }

  async function handleSave(payload) {
    try {
      const method = dino.id ? 'PUT' : 'POST'
      const url = dino.id ? `/api/dinosaurs/${dino.id}` : `/api/dinosaurs`
      const resp = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if (resp.ok) {
        const saved = await resp.json()
        if (onSaved) onSaved(saved)
        setEditing(false)
      } else {
        const text = await resp.text()
        alert('Eroare la salvare: ' + resp.status + ' ' + text)
      }
    } catch (err) { alert('Eroare la salvare') }
  }

  return (
    <div>
      <div className="modal-content">
          <div className="modal-hero" style={{backgroundImage:`url('${inferred}')`, backgroundPosition:`center ${heroPosY}`}} data-emoji={dino.emoji || '🦕'} data-id={dino.id} />
          <button className="modal-close" id="modalClose" aria-label="Închide" onClick={onClose}>✕</button>
          <div className="modal-actions">
              {!editing && <button className="filter-btn" onClick={() => setEditing(true)}>Editează</button>}
              {!editing && <button className="filter-btn btn-delete" onClick={handleDelete}>Șterge</button>}
          </div>
          {editing ? (
          <DinoForm initial={dino} onCancel={() => setEditing(false)} onSubmit={handleSave} submitLabel="Actualizează" />
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-emoji" style={{backgroundImage:`url('${inferred}')`, backgroundPosition:`center ${heroPosY}`}} aria-hidden="true" data-emoji={dino.emoji || '🦕'} data-id={dino.id} />
              <div className="modal-title-block">
                <h2 className="modal-dino-name">{dino.name}</h2>
                <div className="modal-badges">
                  <span className="dino-period">{dino.period}</span>
                  <span className={`dino-diet-badge ${dietClass}`}>{dino.diet}</span>
                </div>
              </div>
            </div>

            <div className="modal-divider" />

            <div className="modal-stats-grid">
              <div className="modal-stat"><div className="modal-stat-label">Lungime</div><div className="modal-stat-value">{dino.length}</div></div>
              <div className="modal-stat"><div className="modal-stat-label">Greutate</div><div className="modal-stat-value">{dino.weight}</div></div>
              <div className="modal-stat"><div className="modal-stat-label">Regiune</div><div className="modal-stat-value">{dino.region}</div></div>
              <div className="modal-stat"><div className="modal-stat-label">Perioadă</div><div className="modal-stat-value">{dino.years}</div></div>
              <div className="modal-stat" style={{gridColumn:'2 / 4'}}><div className="modal-stat-label">Epocă Geologică</div><div className="modal-stat-value">{dino.period}</div></div>
            </div>

            <p className="modal-description">{dino.description}</p>

            <div className="fun-fact-box">
              <div className="fun-fact-label">💡 Faptul Zilei</div>
              <p className="fun-fact-text">{dino.funFact}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
