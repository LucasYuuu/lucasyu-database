'use client'

import { useEffect, useRef, useState } from 'react'

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

    ctx.strokeStyle = 'rgba(0,180,255,0.12)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = 10 + (h - 30) * (i / 5)
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(w - 10, y); ctx.stroke()
      ctx.fillStyle = 'rgba(120,200,255,0.4)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(1000 - i * 200), 26, y + 3)
    }

    ctx.textAlign = 'center'
    const xLabels = ['20-10', '20-10', '40-10', '20-10', '30-00', '20-16', '20-10', '70-40']
    xLabels.forEach((l, i) => {
      ctx.fillText(l, 30 + (w - 40) * (i / (xLabels.length - 1)), h - 8)
    })

    const data1 = [280, 350, 420, 520, 450, 380, 500, 650]
    ctx.beginPath()
    data1.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data1.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(0,220,255,0.9)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineTo(30 + w - 40, h - 20)
    ctx.lineTo(30, h - 20)
    ctx.closePath()
    const grad1 = ctx.createLinearGradient(0, 0, 0, h)
    grad1.addColorStop(0, 'rgba(0,200,255,0.2)')
    grad1.addColorStop(1, 'transparent')
    ctx.fillStyle = grad1
    ctx.fill()

    data1.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data1.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,220,255,0.9)'; ctx.fill()
    })

    const data2 = [180, 220, 300, 380, 320, 280, 400, 520]
    ctx.beginPath()
    data2.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data2.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(0,255,200,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()

    data2.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data2.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,255,200,0.8)'; ctx.fill()
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
    const size = 120
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = 48

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,150,255,0.15)'
    ctx.lineWidth = 8
    ctx.stroke()

    const startAngle = -Math.PI / 2
    const endAngle = startAngle + Math.PI

    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, 'rgba(0,220,255,0.9)')
    grad.addColorStop(1, 'rgba(0,120,200,0.5)')

    ctx.beginPath()
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.strokeStyle = grad
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [])

  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      <canvas ref={canvasRef} style={{ width: 120, height: 120 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center'
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#00e0ff' }}>50%</div>
        <div style={{ fontSize: 11, color: 'rgba(180,220,255,0.6)' }}>项目完成率</div>
      </div>
    </div>
  )
}

function GlowCard({ title, items, cylinderLabel }: {
  title: string; items: { label: string; icon: string }[]; cylinderLabel: string
}) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(5,20,45,0.65)',
      backdropFilter: 'blur(16px)',
      borderRadius: 16,
      border: '1px solid rgba(0,180,255,0.2)',
      padding: '20px 24px',
      boxShadow: '0 0 40px rgba(0,150,255,0.08), inset 0 1px 0 rgba(0,200,255,0.1)',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(200,240,255,0.9)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#00d4ff', fontSize: 18 }}>›</span> {title}
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map((item) => (
            <div key={item.label} style={{
              background: 'rgba(0,180,255,0.08)',
              border: '1px solid rgba(0,180,255,0.15)',
              borderRadius: 10,
              padding: '10px 12px',
              color: 'rgba(180,230,255,0.85)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ color: '#00d4ff', fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{
          width: 100,
          background: 'rgba(0,150,255,0.06)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0,180,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '60%',
            background: 'linear-gradient(to top, rgba(0,200,255,0.15), transparent)',
            borderRadius: '50% 50% 0 0',
          }} />
          <div style={{ fontSize: 11, color: 'rgba(150,210,255,0.6)', textAlign: 'center', padding: '0 8px', position: 'relative', zIndex: 1 }}>
            {cylinderLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: '#050e1c',
    }}>
      {/* Full-screen background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7)',
        zIndex: 0,
      }} />

      {/* Subtle overlay gradient for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(5,15,35,0.5) 0%, rgba(5,15,35,0.2) 30%, rgba(5,15,35,0.3) 70%, rgba(5,15,35,0.6) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          background: 'rgba(5,15,35,0.5)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,180,255,0.15)',
        }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {['首页', '内部研发'].map((t, i) => (
              <div key={t} style={{
                color: i === 0 ? '#00d4ff' : 'rgba(180,220,255,0.5)',
                fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                cursor: 'pointer',
                borderBottom: i === 0 ? '2px solid #00d4ff' : '2px solid transparent',
                paddingBottom: 2,
              }}>{t}</div>
            ))}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#e0f0ff', letterSpacing: 2 }}>
            铌酸锂光学测试数据平台
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              {['客户数据', '测试分析', '报告中心'].map((t) => (
                <div key={t} style={{
                  color: 'rgba(180,220,255,0.5)',
                  fontSize: 13, cursor: 'pointer',
                }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,180,255,0.1)',
                border: '1px solid rgba(0,180,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.7)" strokeWidth="1.5">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,180,255,0.1)',
                border: '1px solid rgba(0,180,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,0.7)" strokeWidth="1.5">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ padding: '12px 32px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e0f0ff' }}>数据概览</div>
            <div style={{ fontSize: 12, color: 'rgba(150,200,240,0.5)' }}>内部研发数据与外部客户数据分类管理</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          {/* Two Data Cards */}
          <div style={{ display: 'flex', gap: 16, flex: '0 0 auto' }}>
            <GlowCard
              title="内部研发测试数据"
              items={[
                { label: '薄膜铌酸锂', icon: '◉' },
                { label: '波导传输损耗', icon: '◈' },
                { label: '电光调制', icon: '◎' },
                { label: '频率转换', icon: '◉' },
              ]}
              cylinderLabel="长期可靠性"
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
            />
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
            {/* Chart */}
            <div style={{
              flex: 1,
              background: 'rgba(5,20,45,0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              border: '1px solid rgba(0,180,255,0.2)',
              padding: '16px 20px',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 40px rgba(0,150,255,0.08), inset 0 1px 0 rgba(0,200,255,0.1)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(200,240,255,0.9)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                项目仪表盘统计
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(150,210,255,0.5)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(0,220,255,0.8)' }} />
                    项目数量
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(150,210,255,0.5)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(0,255,200,0.7)' }} />
                    新项目数量
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <LineChart />
              </div>
            </div>

            {/* Gauge */}
            <div style={{
              width: 200, flex: '0 0 200px',
              background: 'rgba(5,20,45,0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              border: '1px solid rgba(0,180,255,0.2)',
              padding: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              boxShadow: '0 0 40px rgba(0,150,255,0.08), inset 0 1px 0 rgba(0,200,255,0.1)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(200,240,255,0.7)' }}>标准仪表盘组件</div>
              <Gauge />
              <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'rgba(150,210,255,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,220,255,0.8)' }} />
                  内部数据总量
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,120,180,0.5)' }} />
                  外部数据总量
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div style={{
              width: 220, flex: '0 0 220px',
              background: 'rgba(5,20,45,0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              border: '1px solid rgba(0,180,255,0.2)',
              padding: 16,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 40px rgba(0,150,255,0.08), inset 0 1px 0 rgba(0,200,255,0.1)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(200,240,255,0.9)', marginBottom: 12 }}>最近更新</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(150,210,255,0.4)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(0,180,255,0.1)' }}>
                <span>信息</span>
                <span>更改</span>
              </div>
              {[
                { info: '铌酸锂薄膜器件性能测试', count: 'V2.3' },
                { info: '铌酸锂波导损耗测试数据', count: 'V1.8' },
                { info: '铌酸锂调制器频率响应', count: 'V3.1' },
                { info: '铌酸锂可靠性加速老化', count: 'V2.5' },
              ].map((row) => (
                <div key={row.info} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 0',
                  borderBottom: '1px solid rgba(0,180,255,0.06)',
                  fontSize: 11,
                }}>
                  <span style={{ color: 'rgba(180,230,255,0.7)' }}>{row.info}</span>
                  <span style={{ color: '#00d4ff', fontWeight: 600, fontSize: 11 }}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
