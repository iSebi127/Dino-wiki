import React, { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    function move(e) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    function onDown() { /* slightly scale or hide if needed */ }
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
    }
  }, [])

  useEffect(() => {
    // add listeners to toggle hover when over interactive elements
    function onMouseOver(e) {
      const tag = e.target
      if (!tag) return
      // treat buttons, links, inputs and items with clickable cursor as interactive
      if (tag.closest('button') || tag.closest('a') || tag.closest('.dino-card') || tag.closest('.filter-btn') || tag.closest('.modal-close')) {
        setHover(true)
      }
    }
    function onMouseOut(e) {
      // when moving out, reset hover — we keep it simple
      setHover(false)
    }
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mouseout', onMouseOut)
    return () => {
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  const style = {
    left: pos.x + 'px',
    top: pos.y + 'px'
  }

  return (
    <div
      className={`custom-cursor ${hover ? 'cursor-hover' : ''}`}
      style={style}
      aria-hidden="true"
    />
  )
}

