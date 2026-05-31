import React, { useState } from 'react'

function countWords(s) {
  if (!s) return 0
  return s.trim().split(/\s+/).filter(Boolean).length
}

export default function DinoForm({ initial = {}, onCancel, onSubmit, submitLabel = 'Salvează' }) {
  const [form, setForm] = useState({
    id: initial.id || '',
    name: initial.name || '',
    period: initial.period || 'Cretaceous',
    years: initial.years || '',
    diet: initial.diet || '',
    length: initial.length || '',
    weight: initial.weight || '',
    region: initial.region || '',
    description: initial.description || '',
    funFact: initial.funFact || initial.fun_fact || '',
    emoji: initial.emoji || '',
    color: initial.color || '',
    image: initial.image || ''
  })

  const [errors, setErrors] = useState({})

  function setField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  // NEW: read an image file and convert to data URL, set to form.image
  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setField('image', reader.result)
    }
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, image: 'Nu s-a putut citi fișierul imagine' }))
    }
    reader.readAsDataURL(file)
  }

  function validate() {
    const e = {}
    if (!form.id || form.id.trim().length === 0) e.id = 'ID este obligatoriu (slug scurt, fără spații)'
    if (!form.name || form.name.trim().length === 0) e.name = 'Nume obligatoriu'
    if (countWords(form.name) > 8) e.name = 'Numele nu poate avea mai mult de 8 cuvinte'
    if (!form.diet || form.diet.trim().length === 0) e.diet = 'Dieta este obligatorie'
    if (countWords(form.diet) > 4) e.diet = 'Dieta nu poate avea mai mult de 4 cuvinte'
    if (!form.period) e.period = 'Perioada este obligatorie'
    if (!form.image || form.image.trim().length === 0) e.image = 'URL imagine obligatoriu'
    // description length guard
    if (form.description && form.description.length > 2000) e.description = 'Descriere prea lungă (max 2000 caractere)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    // map back to expected funFact field name
    const payload = { ...form, funFact: form.funFact }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="dino-form">
      <div style={{display:'grid', gap:10}}>
        <label>ID (slug, ex: tyrannosaurus)
          <input value={form.id} onChange={e => setField('id', e.target.value)} disabled={!!initial.id} />
          {errors.id && <div className="field-error">{errors.id}</div>}
        </label>

        <label>Nume
          <input value={form.name} onChange={e => setField('name', e.target.value)} />
          <small>{countWords(form.name)} cuvinte</small>
          {errors.name && <div className="field-error">{errors.name}</div>}
        </label>

        <label>Dieta
          <input value={form.diet} onChange={e => setField('diet', e.target.value)} />
          <small>{countWords(form.diet)} cuvinte</small>
          {errors.diet && <div className="field-error">{errors.diet}</div>}
        </label>

        <label>Perioadă
          <select value={form.period} onChange={e => setField('period', e.target.value)}>
            <option value="Triassic">Triassic</option>
            <option value="Jurassic">Jurassic</option>
            <option value="Cretaceous">Cretaceous</option>
          </select>
          {errors.period && <div className="field-error">{errors.period}</div>}
        </label>

        <label>Imagine (URL sau fișier)
          <input value={form.image} onChange={e => setField('image', e.target.value)} placeholder="Introdu URL sau încarcă un fișier..." />
          <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files && e.target.files[0])} />
            {form.image && (
              <div style={{width:72, height:48, borderRadius:6, overflow:'hidden', border:'1px solid rgba(0,0,0,0.12)'}}>
                <img src={form.image} alt="preview" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
              </div>
            )}
          </div>
          {errors.image && <div className="field-error">{errors.image}</div>}
        </label>

        <label>Lungime
          <input value={form.length} onChange={e => setField('length', e.target.value)} />
        </label>

        <label>Greutate
          <input value={form.weight} onChange={e => setField('weight', e.target.value)} />
        </label>

        <label>Regiune
          <input value={form.region} onChange={e => setField('region', e.target.value)} />
        </label>

        <label>Anii (ex: 68–66 milioane ani în urmă)
          <input value={form.years} onChange={e => setField('years', e.target.value)} />
        </label>

        <label>Descriere
          <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={5} />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </label>

        <label>Fapt interesant
          <input value={form.funFact} onChange={e => setField('funFact', e.target.value)} />
        </label>

        <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
          <button type="button" onClick={onCancel} className="filter-btn btn-cancel">Anulează</button>
          <button type="submit" className="filter-btn btn-create"> {submitLabel} </button>
        </div>
      </div>
    </form>
  )
}
