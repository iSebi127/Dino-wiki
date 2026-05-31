import React, { useEffect, useRef } from 'react'

export default function DinoCard({ dino, index, onClick }) {
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const onLoad = () => img.classList.add('loaded')
    const onError = () => {
      const emoji = document.createElement('span')
      emoji.className = 'dino-emoji'
      emoji.textContent = img.parentElement?.dataset?.emoji || '🦕'
      img.parentElement.replaceWith(emoji)
    }
    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
    // cached images
    setTimeout(() => { if (img.complete && img.naturalWidth) img.classList.add('loaded') }, 80)
    return () => {
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }
  }, [])

  const dietClass = dino.diet.toLowerCase().includes('carnivor') ? 'diet-carnivor' : 'diet-ierbivor'
  const shortDesc = dino.description.length > 200 ? dino.description.slice(0,200) + '…' : dino.description
  const rawImage = dino.image ? dino.image.replace(/'/g, "%27") : `images/${dino.id}.jpg`
  const inferred = rawImage.startsWith('/') || rawImage.match(/^[a-zA-Z]+:\/\//) ? (rawImage.startsWith('/') ? rawImage : ('/' + rawImage.split('://').pop())) : ('/' + rawImage)

  return (
    <article className="dino-card" style={{animationDelay: `${index * 0.07}s`}} onClick={onClick}>
      <div className="card-inner">
        <div className="card-header">
          <span className="dino-image" aria-hidden="true" data-emoji={dino.emoji || '🦕'}>
            <img ref={imgRef} className="dino-img-element" src={inferred} alt={dino.name} />
          </span>
          <div className="card-title-group">
            <h2 className="dino-name">{dino.name}</h2>
            <span className="dino-period">{dino.period}</span><br/>
            <span className={`dino-diet-badge ${dietClass}`}>{dino.diet}</span>
          </div>
        </div>
        <div className="card-separator" />
        <p className="dino-description">{shortDesc}</p>
        <div className="card-stats">
          <div className="stat-item"><span className="stat-label">Lungime</span><span className="stat-value">{dino.length}</span></div>
          <div className="stat-item"><span className="stat-label">Greutate</span><span className="stat-value">{dino.weight}</span></div>
          <div className="stat-item"><span className="stat-label">Regiune</span><span className="stat-value">{dino.region.split(',')[0]}</span></div>
          <div className="stat-item"><span className="stat-label">Epocă</span><span className="stat-value">{dino.years.split('–')[0]}M ani</span></div>
        </div>
        <p className="card-cta">✦ Click pentru mai multe detalii ✦</p>
      </div>
    </article>
  )
}

