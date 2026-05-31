import React, { useEffect, useState } from 'react'
import DinoGrid from './components/DinoGrid'
import Modal from './components/Modal'
import CustomCursor from './components/CustomCursor'
import DinoForm from './components/DinoForm'

export default function App() {
  const [dinosaurs, setDinosaurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // Try REST API then fallback to local XML
    async function load() {
      try {
        const res = await fetch('/api/dinosaurs')
        if (res.ok) {
          const data = await res.json()
          setDinosaurs(data.map(mapServer))
        } else {
          await loadFromXML()
        }
      } catch (e) {
        await loadFromXML()
      } finally {
        setLoading(false)
      }
    }
    function mapServer(d) {
      return {
        id: d.id || '',
        name: d.name || '',
        period: d.period || '',
        years: d.years || '',
        diet: d.diet || '',
        length: d.length || '',
        weight: d.weight || '',
        region: d.region || '',
        description: d.description || '',
        funFact: d.funFact || d.fun_fact || '',
        emoji: d.emoji || '',
        color: d.color || '',
        image: d.image || ''
      }
    }

    async function loadFromXML() {
      try {
        const resp = await fetch('/xml/dinosaurs.xml')
        const text = await resp.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(text, 'application/xml')
        const nodes = Array.from(xml.querySelectorAll('dinosaur'))
        const result = nodes.map(n => ({
          id: n.getAttribute('id') || '',
          name: n.querySelector('name')?.textContent.trim() || '',
          period: n.querySelector('period')?.textContent.trim() || '',
          years: n.querySelector('years')?.textContent.trim() || '',
          diet: n.querySelector('diet')?.textContent.trim() || '',
          length: n.querySelector('length')?.textContent.trim() || '',
          weight: n.querySelector('weight')?.textContent.trim() || '',
          region: n.querySelector('region')?.textContent.trim() || '',
          description: n.querySelector('description')?.textContent.trim() || '',
          funFact: n.querySelector('fun_fact')?.textContent.trim() || '',
          emoji: n.querySelector('emoji')?.textContent.trim() || '',
          color: n.querySelector('color')?.textContent.trim() || '',
          image: n.querySelector('image')?.textContent.trim() || ''
        }))
        setDinosaurs(result)
      } catch (err) {
        console.error('XML load failed', err)
        setDinosaurs([])
      }
    }

    load()
  }, [])

  const eraCount = new Set(dinosaurs.map(d => d.period)).size

  function filtered() {
    let list = dinosaurs
    if (filter !== 'all') list = list.filter(d => d.period.toLowerCase() === filter.toLowerCase())
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(s) ||
        d.description.toLowerCase().includes(s) ||
        d.diet.toLowerCase().includes(s) ||
        d.region.toLowerCase().includes(s)
      )
    }
    return list
  }

  function handleSaved(saved) {
    setDinosaurs(prev => {
      const existing = prev.find(d => d.id === saved.id)
      if (existing) {
        return prev.map(d => d.id === saved.id ? saved : d)
      }
      return [saved, ...prev]
    })
    setCreating(false)
    setSelected(saved)
  }

  function handleDeleted(id) {
    setDinosaurs(prev => prev.filter(d => d.id !== id))
    if (selected && selected.id === id) setSelected(null)
  }

  return (
    <div>
      <CustomCursor />
      <header>
        <div className="header-bg" />
        <div className="site-logo">
          <span className="dino-icon">🦕</span>
        </div>
        <h1 className="site-title">Codex Draconis</h1>
        <div className="site-subtitle">Enciclopedia Dinozaurilor</div>
        <div className="divider" />
        <div className="stats-bar">
          <div>Specii: <strong id="dinoCount">{dinosaurs.length}</strong></div>
          <div>Epoci: <strong id="eraCount">{eraCount}</strong></div>
        </div>
      </header>

      <section className="controls">
        <div className="search-wrap">
          <input id="searchInput" placeholder="Caută..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <button className={`filter-btn ${filter==='all'?'active':''}`} data-filter="all" onClick={() => setFilter('all')}>Toate</button>
          <button className={`filter-btn ${filter==='Jurassic'?'active':''}`} data-filter="Jurassic" onClick={() => setFilter('Jurassic')}>Jurasic</button>
          <button className={`filter-btn ${filter==='Cretaceous'?'active':''}`} data-filter="Cretaceous" onClick={() => setFilter('Cretaceous')}>Cretacic</button>
          <button className={`filter-btn ${filter==='Triassic'?'active':''}`} data-filter="Triassic" onClick={() => setFilter('Triassic')}>Triasic</button>
          <button className="filter-btn" onClick={() => setCreating(true)} style={{marginLeft:12}}>Adaugă dinozaur</button>
        </div>
      </section>

      <main>
        {loading ? (
          <div id="loadingMsg">Încărcam dinozauri...</div>
        ) : (
          <DinoGrid dinos={filtered()} onSelect={setSelected} />
        )}
      </main>

      <footer>
        &copy; Codex Draconis — Dino Wiki
      </footer>

      {/* Modal for viewing/editing */}
      <div id="modalOverlay" className={`modal-overlay ${(selected || creating) ? 'open' : ''}`} onClick={(e)=>{ if (e.target === e.currentTarget) { setSelected(null); setCreating(false) } }}>
        <div className="modal">
          <div id="modalContent">
            {creating ? (
              <DinoForm initial={{}} onCancel={() => setCreating(false)} onSubmit={async (payload) => {
                try {
                  const resp = await fetch('/api/dinosaurs', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
                  if (resp.ok) {
                    const saved = await resp.json()
                    handleSaved(saved)
                  } else {
                    const text = await resp.text()
                    alert('Eroare la creare: ' + resp.status + ' ' + text)
                  }
                } catch (err) { alert('Eroare la creare') }
              }} submitLabel="Creează" />
            ) : (
              selected && <Modal dino={selected} onClose={() => setSelected(null)} onSaved={handleSaved} onDeleted={handleDeleted} />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
