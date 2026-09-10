'use client'

import { useEffect, useRef } from 'react'

function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    const dpr = 2
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height

    ctx.strokeStyle = 'rgba(0,180,255,0.08)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = 8 + (h - 26) * (i / 5)
      ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(w - 8, y); ctx.stroke()
      ctx.fillStyle = 'rgba(100,200,255,0.3)'
      ctx.font = '9px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(String(1000 - i * 200), 24, y + 3)
    }

    ctx.textAlign = 'center'
    const xL = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
    xL.forEach((l, i) => {
      ctx.fillText(l, 28 + (w - 36) * (i / (xL.length - 1)), h - 6)
    })

    const d1 = [280, 350, 420, 520, 450, 380, 500, 650]
    ctx.beginPath()
    d1.forEach((v, i) => {
      const x = 28 + (w - 36) * (i / (d1.length - 1))
      const y = 8 + (h - 26) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#00d4ff'
    ctx.lineWidth = 1.5
    ctx.shadowColor = '#00d4ff'
    ctx.shadowBlur = 8
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.lineTo(28 + w - 36, h - 18)
    ctx.lineTo(28, h - 18)
    ctx.closePath()
    const g1 = ctx.createLinearGradient(0, 0, 0, h)
    g1.addColorStop(0, 'rgba(0,212,255,0.12)')
    g1.addColorStop(1, 'transparent')
    ctx.fillStyle = g1
    ctx.fill()

    d1.forEach((v, i) => {
      const x = 28 + (w - 36) * (i / (d1.length - 1))
      const y = 8 + (h - 26) * (1 - v / 1000)
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0
    })

    const d2 = [180, 220, 300, 380, 320, 280, 400, 520]
    ctx.beginPath()
    d2.forEach((v, i) => {
      const x = 28 + (w - 36) * (i / (d2.length - 1))
      const y = 8 + (h - 26) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#00ffa8'
    ctx.lineWidth = 1.5
    ctx.shadowColor = '#00ffa8'
    ctx.shadowBlur = 8
    ctx.stroke()
    ctx.shadowBlur = 0

    d2.forEach((v, i) => {
      const x = 28 + (w - 36) * (i / (d2.length - 1))
      const y = 8 + (h - 26) * (1 - v / 1000)
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#00ffa8'; ctx.shadowColor = '#00ffa8'; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0
    })
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

function Gauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = 2
    const size = 110
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = 42

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,180,255,0.1)'
    ctx.lineWidth = 6
    ctx.stroke()

    const sa = -Math.PI / 2
    const ea = sa + Math.PI

    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#00d4ff')
    grad.addColorStop(1, '#0080ff')

    ctx.beginPath()
    ctx.arc(cx, cy, r, sa, ea)
    ctx.strokeStyle = grad
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.shadowColor = '#00d4ff'
    ctx.shadowBlur = 12
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [])

  return (
    <div style={{ position: 'relative', width: 110, height: 110 }}>
      <canvas ref={canvasRef} style={{ width: 110, height: 110 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.5)' }}>50%</div>
        <div style={{ fontSize: 9, color: 'rgba(0,200,255,0.4)', letterSpacing: 1 }}>完成率</div>
      </div>
    </div>
  )
}

function HoloCard({ title, items, cylinderLabel, glowColor = '#00d4ff' }: {
  title: string; items: { label: string; icon: string }[]; cylinderLabel: string; glowColor?: string
}) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(0,10,30,0.5)',
      backdropFilter: 'blur(20px)',
      borderRadius: 12,
      border: `1px solid ${glowColor}22`,
      boxShadow: `0 0 30px ${glowColor}0a, inset 0 0 30px ${glowColor}05`,
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: `1px solid ${glowColor}44`, borderLeft: `1px solid ${glowColor}44` }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: `1px solid ${glowColor}44`, borderRight: `1px solid ${glowColor}44` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: `1px solid ${glowColor}44`, borderLeft: `1px solid ${glowColor}44` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: `1px solid ${glowColor}44`, borderRight: `1px solid ${glowColor}44` }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${glowColor}44, transparent)`,
      }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: glowColor, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, textShadow: `0 0 8px ${glowColor}44` }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: glowColor, boxShadow: `0 0 8px ${glowColor}` }} />
        {title}
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {items.map((item) => (
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
            }}>
              <span style={{ color: glowColor, fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{
          width: 90,
          background: `${glowColor}06`,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${glowColor}12`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '55%',
            background: `linear-gradient(to top, ${glowColor}18, transparent)`,
            borderRadius: '50% 50% 0 0',
          }} />
          <div style={{ fontSize: 10, color: `${glowColor}88`, textAlign: 'center', padding: '0 6px', position: 'relative', zIndex: 1 }}>
            {cylinderLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: '#020810' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.55) saturate(1.1)',
      }} />

      {/* HUD grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,180,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,180,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,5,15,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 28px',
          background: 'rgba(0,8,20,0.6)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,180,255,0.12)',
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['首页', '内部研发'].map((t, i) => (
              <div key={t} style={{
                color: i === 0 ? '#00d4ff' : 'rgba(0,200,255,0.35)',
                fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                cursor: 'pointer', letterSpacing: 1,
                textShadow: i === 0 ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
              }}>{t}</div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e0f4ff', letterSpacing: 3, textShadow: '0 0 20px rgba(0,180,255,0.3)' }}>
              铌酸锂光学测试数据平台
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 18 }}>
              {['客户数据', '测试分析', '报告中心'].map((t) => (
                <div key={t} style={{ color: 'rgba(0,200,255,0.3)', fontSize: 12, cursor: 'pointer', letterSpacing: 1 }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['bell', 'user'].map((icon) => (
                <div key={icon} style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(0,180,255,0.06)',
                  border: '1px solid rgba(0,180,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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

        {/* Sub header */}
        <div style={{ padding: '10px 28px 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#00d4ff', letterSpacing: 2, textShadow: '0 0 10px rgba(0,212,255,0.3)' }}>
            数据概览
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,180,255,0.3), transparent)' }} />
          <div style={{ fontSize: 10, color: 'rgba(0,200,255,0.3)', letterSpacing: 1 }}>INTERNAL R&D & CLIENT DATA MANAGEMENT</div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '0 24px 18px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Two Cards */}
          <div style={{ display: 'flex', gap: 14, flex: '0 0 auto' }}>
            <HoloCard
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
            <HoloCard
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
          <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
            {/* Chart */}
            <div style={{
              flex: 1,
              background: 'rgba(0,10,30,0.5)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: '14px 18px',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,212,255,0.8)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }} />
                项目仪表盘统计
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                  {[
                    { label: '项目数量', color: '#00d4ff' },
                    { label: '新项目数量', color: '#00ffa8' },
                  ].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: `${l.color}66` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, boxShadow: `0 0 4px ${l.color}66` }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <LineChart />
              </div>
            </div>

            {/* Gauge */}
            <div style={{
              width: 180, flex: '0 0 180px',
              background: 'rgba(0,10,30,0.5)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />

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
              background: 'rgba(0,10,30,0.5)',
              backdropFilter: 'blur(20px)',
              borderRadius: 12,
              border: '1px solid rgba(0,180,255,0.12)',
              padding: 14,
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderLeft: '1px solid rgba(0,212,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(0,212,255,0.3)', borderRight: '1px solid rgba(0,212,255,0.3)' }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,212,255,0.8)', marginBottom: 10, textShadow: '0 0 6px rgba(0,212,255,0.3)' }}>最近更新</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(0,200,255,0.3)', marginBottom: 6, paddingBottom: 5, borderBottom: '1px solid rgba(0,180,255,0.08)', letterSpacing: 1 }}>
                <span>信息</span>
                <span>版本</span>
              </div>
              {[
                { info: '铌酸锂薄膜器件性能', ver: 'V2.3' },
                { info: '铌酸锂波导损耗数据', ver: 'V1.8' },
                { info: '铌酸锂调制器频率', ver: 'V3.1' },
                { info: '铌酸锂可靠性老化', ver: 'V2.5' },
              ].map((row) => (
                <div key={row.info} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid rgba(0,180,255,0.05)',
                  fontSize: 10,
                }}>
                  <span style={{ color: 'rgba(180,230,255,0.6)' }}>{row.info}</span>
                  <span style={{ color: '#00d4ff', fontWeight: 600, textShadow: '0 0 4px rgba(0,212,255,0.3)' }}>{row.ver}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
