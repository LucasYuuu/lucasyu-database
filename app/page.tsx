'use client'

import { useEffect, useRef, useState } from 'react'

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string; life: number }[] = []
    const colors = ['rgba(0,212,255,', 'rgba(0,255,168,', 'rgba(255,180,80,', 'rgba(100,180,255,']

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 1000,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life += 1
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        const flicker = 0.5 + 0.5 * Math.sin(p.life * 0.02)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + (p.a * flicker) + ')'; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = p.color + (p.a * flicker * 0.1) + ')'; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,180,255,${0.04 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
}

function GlowingOrbs() {
  const [orbs, setOrbs] = useState([
    { x: 15, y: 35, size: 200, color: 'rgba(0,180,255,0.06)', delay: 0 },
    { x: 50, y: 55, size: 300, color: 'rgba(0,255,180,0.04)', delay: 1 },
    { x: 80, y: 30, size: 180, color: 'rgba(255,150,50,0.03)', delay: 2 },
    { x: 30, y: 70, size: 220, color: 'rgba(100,150,255,0.04)', delay: 0.5 },
    { x: 70, y: 65, size: 160, color: 'rgba(0,200,255,0.05)', delay: 1.5 },
  ])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${o.x}%`, top: `${o.y}%`,
          width: o.size, height: o.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          animation: `orbFloat 8s ease-in-out ${o.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  )
}

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: '#020810', cursor: 'crosshair' }}
    >
      <style>{`
        @keyframes orbFloat { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; } 100% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; } }
        @keyframes slowZoom { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
        @keyframes breathe { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes drift { 0% { transform: translate(0, 0); } 50% { transform: translate(8px, -5px); } 100% { transform: translate(0, 0); } }
        @keyframes scanline { 0% { top: -5%; } 100% { top: 105%; } }
      `}</style>

      {/* Background image with zoom + drift */}
      <div style={{
        position: 'absolute',
        inset: '-3%',
        width: '106%', height: '106%',
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.55) saturate(1.2)',
        animation: 'slowZoom 30s ease-in-out infinite alternate, drift 20s ease-in-out infinite',
        transformOrigin: `${50 + (mousePos.x - 50) * 0.02}% ${50 + (mousePos.y - 50) * 0.02}%`,
        transition: 'transform-origin 0.3s ease',
      }} />

      {/* Floating glow orbs */}
      <GlowingOrbs />

      {/* Particle overlay */}
      <Particles />

      {/* Slow scanning line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.08), transparent)',
        zIndex: 3, pointerEvents: 'none',
        animation: 'scanline 12s linear infinite',
      }} />

      {/* Center glow pulse */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,255,0.04), transparent 60%)',
        animation: 'breathe 6s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(2,8,16,0.8) 100%)',
        pointerEvents: 'none', zIndex: 4,
      }} />
    </div>
  )
}
