'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─── Particle System ─── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string }[] = []
    const colors = ['rgba(0,212,255,', 'rgba(0,255,168,', 'rgba(100,180,255,']

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.a + ')'
        ctx.fill()

        // glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color + (p.a * 0.15) + ')'
        ctx.fill()
      })

      // connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,180,255,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
}

/* ─── Flow Lines (animated horizontal lines) ─── */
function FlowLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const lines = Array.from({ length: 8 }, (_, i) => ({
      y: 80 + i * (canvas.height / 8),
      speed: 0.3 + Math.random() * 0.5,
      len: 80 + Math.random() * 200,
      offset: Math.random() * canvas.width,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 1

      lines.forEach((l) => {
        const x = ((l.offset + t * l.speed * 2) % (canvas.width + l.len * 2)) - l.len
        const grad = ctx.createLinearGradient(x, 0, x + l.len, 0)
        grad.addColorStop(0, 'rgba(0,180,255,0)')
        grad.addColorStop(0.5, 'rgba(0,180,255,0.06)')
        grad.addColorStop(1, 'rgba(0,180,255,0)')
        ctx.beginPath()
        ctx.moveTo(x, l.y)
        ctx.lineTo(x + l.len, l.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
}

/* ─── Chart ─── */
function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let progress = 0

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    const dpr = 2
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width, h = rect.height

    const d1 = [280, 350, 420, 520, 450, 380, 500, 650]
    const d2 = [180, 220, 300, 380, 320, 280, 400, 520]

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      progress = Math.min(progress + 0.015, 1)
      const ease = 1 - Math.pow(1 - progress, 3)

      // grid
      ctx.strokeStyle = 'rgba(0,180,255,0.06)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 5; i++) {
        const y = 8 + (h - 26) * (i / 5)
        ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(w - 8, y); ctx.stroke()
      }

      // line 1
      const pts1 = d1.map((v, i) => ({
        x: 28 + (w - 36) * (i / (d1.length - 1)),
        y: 8 + (h - 26) * (1 - v / 1000),
      }))
      const visible1 = Math.floor(pts1.length * ease)

      ctx.beginPath()
      for (let i = 0; i <= visible1 && i < pts1.length; i++) {
        if (i === 0) ctx.moveTo(pts1[i].x, pts1[i].y); else ctx.lineTo(pts1[i].x, pts1[i].y)
      }
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      // glow dots 1
      for (let i = 0; i <= visible1 && i < pts1.length; i++) {
        ctx.beginPath(); ctx.arc(pts1[i].x, pts1[i].y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0
      }

      // line 2
      const pts2 = d2.map((v, i) => ({
        x: 28 + (w - 36) * (i / (d2.length - 1)),
        y: 8 + (h - 26) * (1 - v / 1000),
      }))
      const visible2 = Math.floor(pts2.length * ease)

      ctx.beginPath()
      for (let i = 0; i <= visible2 && i < pts2.length; i++) {
        if (i === 0) ctx.moveTo(pts2[i].x, pts2[i].y); else ctx.lineTo(pts2[i].x, pts2[i].y)
      }
      ctx.strokeStyle = '#00ffa8'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ffa8'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      for (let i = 0; i <= visible2 && i < pts2.length; i++) {
        ctx.beginPath(); ctx.arc(pts2[i].x, pts2[i].y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#00ffa8'; ctx.shadowColor = '#00ffa8'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0
      }

      if (progress < 1) animId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

/* ─── Gauge ─── */
function Gauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let progress = 0
    const dpr = 2
    const size = 110
    canvas.width = size * dpr; canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2, cy = size / 2, r = 42

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      progress = Math.min(progress + 0.02, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const angle = -Math.PI / 2 + Math.PI * ease

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0,180,255,0.08)'
      ctx.lineWidth = 6
      ctx.stroke()

      const grad = ctx.createLinearGradient(0, 0, size, size)
      grad.addColorStop(0, '#00d4ff'); grad.addColorStop(1, '#0080ff')

      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, angle)
      ctx.strokeStyle = grad
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 15
      ctx.stroke()
      ctx.shadowBlur = 0

      // endpoint dot
      const ex = cx + r * Math.cos(angle)
      const ey = cy + r * Math.sin(angle)
      ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0

      if (progress < 1) animId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div
      style={{ position: 'relative', width: 110, height: 110, cursor: 'pointer', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas ref={canvasRef} style={{ width: 110, height: 110 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.5)' }}>50%</div>
        <div style={{ fontSize: 9, color: 'rgba(0,200,255,0.4)', letterSpacing: 1 }}>完成率</div>
      </div>
    </div>
  )
}

/* ─── Interactive Card ─── */
function GlowCard({ title, items, cylinderLabel, glowColor = '#00d4ff' }: {
  title: string; items: { label: string; icon: string }[]; cylinderLabel: string; glowColor?: string
}) {
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        flex: 1,
        background: hovered ? `rgba(0,10,30,0.55)` : `rgba(0,10,30,0.4)`,
        backdropFilter: 'blur(20px)',
        borderRadius: 12,
        border: `1px solid ${hovered ? glowColor + '44' : glowColor + '18'}`,
        boxShadow: hovered
          ? `0 0 40px ${glowColor}15, inset 0 0 40px ${glowColor}08`
          : `0 0 20px ${glowColor}08`,
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Mouse follow glow */}
      {hovered && (
        <div style={{
          position: 'absolute',
          left: mousePos.x - 80, top: mousePos.y - 80,
          width: 160, height: 160,
          background: `radial-gradient(circle, ${glowColor}12, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'left 0.1s, top 0.1s',
        }} />
      )}

      {/* Corner accents */}
      {[
        { top: 0, left: 0, borderTop: `1px solid ${glowColor}55`, borderLeft: `1px solid ${glowColor}55` },
        { top: 0, right: 0, borderTop: `1px solid ${glowColor}55`, borderRight: `1px solid ${glowColor}55` },
        { bottom: 0, left: 0, borderBottom: `1px solid ${glowColor}55`, borderLeft: `1px solid ${glowColor}55` },
        { bottom: 0, right: 0, borderBottom: `1px solid ${glowColor}55`, borderRight: `1px solid ${glowColor}55` },
      ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...s }} />)}

      {/* Animated scan line on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${glowColor}66, transparent)`,
          animation: 'scan 1.5s linear infinite',
        }} />
      )}

      <div style={{ fontSize: 13, fontWeight: 600, color: glowColor, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, textShadow: `0 0 8px ${glowColor}44` }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: glowColor, boxShadow: `0 0 8px ${glowColor}`, animation: 'pulse 2s ease-in-out infinite' }} />
        {title}
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={item.label} style={{
              background: `linear-gradient(135deg, ${glowColor}08, ${glowColor}03)`,
              border: `1px solid ${glowColor}18`,
              borderRadius: 8,
              padding: '8px 10px',
              color: 'rgba(180,230,255,0.8)',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.3s',
              animationDelay: `${idx * 0.1}s`,
            }}>
              <span style={{ color: glowColor, fontSize: 12, textShadow: `0 0 4px ${glowColor}66` }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{
          width: 90,
          background: `${glowColor}06`,
          borderRadius: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${glowColor}12`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '55%',
            background: `linear-gradient(to top, ${glowColor}22, transparent)`,
            borderRadius: '50% 50% 0 0',
            animation: 'cylinderPulse 3s ease-in-out infinite',
          }} />
          <div style={{ fontSize: 10, color: `${glowColor}88`, textAlign: 'center', padding: '0 6px', position: 'relative', zIndex: 1 }}>
            {cylinderLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Floating Data Panel (right side like in the image) ─── */
function FloatingData() {
  const [hovered, setHovered] = useState(false)

  const data = [
    { label: '光学损耗', value: '0.3 dB/cm', bar: 0.7 },
    { label: '调制带宽', value: '40 GHz', bar: 0.85 },
    { label: '转换效率', value: '68%', bar: 0.68 },
    { label: '信噪比', value: '42 dB', bar: 0.75 },
  ]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        right: 28, top: '50%',
        transform: `translateY(-50%) ${hovered ? 'scale(1.02)' : 'scale(1)'}`,
        width: 200,
        background: 'rgba(0,10,30,0.45)',
        backdropFilter: 'blur(16px)',
        borderRadius: 12,
        border: `1px solid rgba(0,180,255,${hovered ? 0.3 : 0.15})`,
        padding: 14,
        transition: 'all 0.35s ease',
        zIndex: 5,
        boxShadow: hovered ? '0 0 30px rgba(0,150,255,0.1)' : 'none',
      }}
    >
      {[
        { top: 0, left: 0, borderTop: '1px solid rgba(0,212,255,0.4)', borderLeft: '1px solid rgba(0,212,255,0.4)' },
        { top: 0, right: 0, borderTop: '1px solid rgba(0,212,255,0.4)', borderRight: '1px solid rgba(0,212,255,0.4)' },
        { bottom: 0, left: 0, borderBottom: '1px solid rgba(0,212,255,0.4)', borderLeft: '1px solid rgba(0,212,255,0.4)' },
        { bottom: 0, right: 0, borderBottom: '1px solid rgba(0,212,255,0.4)', borderRight: '1px solid rgba(0,212,255,0.4)' },
      ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 12, height: 12, ...s }} />)}

      <div style={{ fontSize: 11, fontWeight: 600, color: '#00d4ff', marginBottom: 10, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>
        实时监测参数
      </div>
      {data.map((d) => (
        <div key={d.label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(180,230,255,0.5)', marginBottom: 3 }}>
            <span>{d.label}</span>
            <span style={{ color: '#00d4ff' }}>{d.value}</span>
          </div>
          <div style={{ height: 3, background: 'rgba(0,180,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${d.bar * 100}%`, background: 'linear-gradient(90deg, #00d4ff, #00ffa8)', borderRadius: 2, boxShadow: '0 0 6px rgba(0,212,255,0.4)', transition: 'width 1s ease' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Main ─── */
export default function Home() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour12: false }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: '#020810' }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes cylinderPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { width: 0; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.5) saturate(1.1)',
      }} />

      {/* Particle layer */}
      <Particles />
      <FlowLines />

      {/* Subtle scan overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,180,255,0.015) 2px, rgba(0,180,255,0.015) 4px)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,5,15,0.7) 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 28px',
          background: 'rgba(0,8,20,0.4)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,180,255,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['首页', '内部研发'].map((t, i) => (
              <div key={t} style={{
                color: i === 0 ? '#00d4ff' : 'rgba(0,200,255,0.3)',
                fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                cursor: 'pointer', letterSpacing: 1,
                textShadow: i === 0 ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
                borderBottom: i === 0 ? `1px solid ${'#00d4ff'}44` : '1px solid transparent',
                paddingBottom: 2,
              }}>{t}</div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'pulse 3s ease-in-out infinite' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e0f4ff', letterSpacing: 3, textShadow: '0 0 20px rgba(0,180,255,0.3)' }}>
              铌酸锂光学测试数据平台
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'pulse 3s ease-in-out infinite 1.5s' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 18 }}>
              {['客户数据', '测试分析', '报告中心'].map((t) => (
                <div key={t} style={{ color: 'rgba(0,200,255,0.3)', fontSize: 12, cursor: 'pointer', letterSpacing: 1, transition: 'color 0.3s' }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(0,200,255,0.4)', fontFamily: 'monospace', letterSpacing: 1 }}>{time}</div>
              {['bell', 'user'].map((icon) => (
                <div key={icon} style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(0,180,255,0.06)',
                  border: '1px solid rgba(0,180,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.3s',
                }}>
                  {icon === 'bell' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, padding: '0 280px 18px 28px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Two Cards */}
          <div style={{ display: 'flex', gap: 14, flex: '0 0 auto', animation: 'fadeIn 0.8s ease' }}>
            <GlowCard
              title="内部研发测试数据"
              items={[
                { label: '薄膜铌酸锂', icon: '◉' },
                { label: '波导传输损耗', icon: '◈' },
                { label: '电光调制', icon: '◎' },
                { label: '频率转换', icon: '◉' },
              ]}
              cylinderLabel="长期可靠性"
              glowColor="#00d4ff"
            />
            <GlowCard
              title="外部客户测试数据"
              items={[
                { label: '客户样品', icon: '☰' },
                { label: '委托测试', icon: '▥' },
                { label: '测试工单', icon: '❋' },
                { label: '原始数据', icon: '⊞' },
              ]}
              cylinderLabel="结果报告"
              glowColor="#00ffa8"
            />
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0, animation: 'fadeIn 0.8s ease 0.2s both' }}>
            {/* Chart */}
            <div style={{
              flex: 1,
              background: 'rgba(0,10,30,0.45)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: '14px 18px',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              {[
                { top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', ...s }} />)}

              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,212,255,0.8)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', animation: 'pulse 2s ease-in-out infinite' }} />
                项目仪表盘统计
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                  {[
                    { l: '项目数量', c: '#00d4ff' },
                    { l: '新项目数量', c: '#00ffa8' },
                  ].map((x) => (
                    <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: `${x.c}66` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: x.c, boxShadow: `0 0 4px ${x.c}66` }} />
                      {x.l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}><LineChart /></div>
            </div>

            {/* Gauge */}
            <div style={{
              width: 180, flex: '0 0 180px',
              background: 'rgba(0,10,30,0.45)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              position: 'relative', overflow: 'hidden',
            }}>
              {[
                { top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', ...s }} />)}

              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,212,255,0.7)', letterSpacing: 1, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>标准仪表盘组件</div>
              <Gauge />
              <div style={{ display: 'flex', gap: 10, fontSize: 9, color: 'rgba(0,200,255,0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 4px #00d4ff66' }} />
                  内部数据
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0060aa', boxShadow: '0 0 4px #0060aa66' }} />
                  外部数据
                </div>
              </div>
            </div>

            {/* Recent */}
            <div style={{
              width: 200, flex: '0 0 200px',
              background: 'rgba(0,10,30,0.45)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: 14,
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              {[
                { top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderLeft: '1px solid rgba(0,212,255,0.35)' },
                { bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.35)', borderRight: '1px solid rgba(0,212,255,0.35)' },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', ...s }} />)}

              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,212,255,0.8)', marginBottom: 10, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>最近更新</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(0,200,255,0.3)', marginBottom: 6, paddingBottom: 5, borderBottom: '1px solid rgba(0,180,255,0.08)', letterSpacing: 1 }}>
                <span>信息</span><span>版本</span>
              </div>
              {[
                { info: '铌酸锂薄膜器件性能', ver: 'V2.3' },
                { info: '铌酸锂波导损耗数据', ver: 'V1.8' },
                { info: '铌酸锂调制器频率', ver: 'V3.1' },
                { info: '铌酸锂可靠性老化', ver: 'V2.5' },
              ].map((row) => (
                <div key={row.info} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: '1px solid rgba(0,180,255,0.05)', fontSize: 10,
                }}>
                  <span style={{ color: 'rgba(180,230,255,0.6)' }}>{row.info}</span>
                  <span style={{ color: '#00d4ff', fontWeight: 600, textShadow: '0 0 4px rgba(0,212,255,0.3)' }}>{row.ver}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating right panel */}
        <FloatingData />
      </div>
    </div>
  )
}
