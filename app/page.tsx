'use client'

import { useEffect, useRef, useState } from 'react'

/* ========== Particle Canvas ========== */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height
    const cx = () => W() / 2
    const cy = () => H() / 2

    interface P {
      x: number; y: number; vx: number; vy: number
      size: number; alpha: number; color: string; life: number
    }

    const particles: P[] = []
    const colors = ['0,150,255', '0,200,180', '120,0,255', '0,255,150']

    // Create flowing particles from center
    for (let i = 0; i < 300; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1
      const dist = Math.random() * 100
      const isLeft = Math.random() > 0.5

      particles.push({
        x: cx() + Math.cos(angle) * dist,
        y: cy() + Math.sin(angle) * dist,
        vx: isLeft ? -(Math.random() * 4 + 1) : (Math.random() * 4 + 1),
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        color: isLeft ? '0,150,255' : '0,200,120',
        life: Math.random() * 200 + 100,
      })
    }

    // Ambient floating particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.3 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 99999,
      })
    }

    let animId: number
    let frame = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(3,6,20,0.15)'
      ctx.fillRect(0, 0, W(), H())
      frame++

      // Draw center glow
      const grad = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 150)
      grad.addColorStop(0, 'rgba(0,180,255,0.08)')
      grad.addColorStop(0.5, 'rgba(0,120,255,0.03)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(cx() - 150, cy() - 150, 300, 300)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life--

        if (p.life <= 0 || p.x < -20 || p.x > W() + 20 || p.y < -20 || p.y > H() + 20) {
          // Reset from center
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * 30
          const isLeft = Math.random() > 0.5
          p.x = cx() + Math.cos(angle) * dist
          p.y = cy() + Math.sin(angle) * dist
          p.vx = isLeft ? -(Math.random() * 4 + 1) : (Math.random() * 4 + 1)
          p.vy = (Math.random() - 0.5) * 2
          p.life = Math.random() * 200 + 100
          p.alpha = Math.random() * 0.8 + 0.2
          p.color = isLeft ? '0,150,255' : '0,200,120'
        }

        // Add some wave to the flow
        if (Math.abs(p.vx) > 1) {
          p.vy += Math.sin(frame * 0.02 + p.x * 0.01) * 0.02
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha * (p.life > 50 ? 1 : p.life / 50)})`
        ctx.fill()

        // Trail
        if (Math.abs(p.vx) > 1) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3)
          ctx.strokeStyle = `rgba(${p.color},${p.alpha * 0.2})`
          ctx.lineWidth = p.size * 0.5
          ctx.stroke()
        }
      })

      // Draw connection lines between nearby flow particles
      const flowParticles = particles.filter(p => Math.abs(p.vx) > 1)
      for (let i = 0; i < flowParticles.length; i++) {
        for (let j = i + 1; j < flowParticles.length; j++) {
          const dx = flowParticles[i].x - flowParticles[j].x
          const dy = flowParticles[i].y - flowParticles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 60) {
            ctx.beginPath()
            ctx.moveTo(flowParticles[i].x, flowParticles[i].y)
            ctx.lineTo(flowParticles[j].x, flowParticles[j].y)
            ctx.strokeStyle = `rgba(0,150,255,${0.06 * (1 - dist / 60)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" />
}

/* ========== Chart Component ========== */
function SpectrumChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState('transmission')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    const w = rect.width
    const h = rect.height

    // Background
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(0,100,255,0.06)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = 10 + (h - 25) * (i / 4)
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(w - 10, y)
      ctx.stroke()

      ctx.fillStyle = 'rgba(120,160,200,0.3)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(300 - i * 50), 26, y + 3)
    }

    // X labels
    ctx.textAlign = 'center'
    const xLabels = ['0.5', '1.0', '1.5', '2.0']
    xLabels.forEach((label, i) => {
      const x = 30 + (w - 40) * (i / (xLabels.length - 1))
      ctx.fillText(label, x, h - 5)
    })

    // Draw curves
    const drawCurve = (offset: number, color: string, amplitude: number) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      for (let x = 0; x <= w - 40; x++) {
        const t = x / (w - 40)
        const y = 15 + (h - 35) / 2 +
          Math.sin(t * 8 + offset) * amplitude * (1 - t * 0.3) +
          Math.sin(t * 15 + offset * 2) * amplitude * 0.3 +
          Math.sin(t * 3 + offset * 0.5) * amplitude * 0.5

        if (x === 0) ctx.moveTo(30 + x, y)
        else ctx.lineTo(30 + x, y)
      }
      ctx.stroke()

      // Fill
      ctx.lineTo(30 + w - 40, h - 20)
      ctx.lineTo(30, h - 20)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, color.replace('1)', '0.15)'))
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()
    }

    drawCurve(0, 'rgba(0,180,255,1)', 25)
    drawCurve(2, 'rgba(0,255,150,1)', 20)
    drawCurve(4, 'rgba(180,0,255,1)', 15)
  }, [activeTab])

  const tabs = [
    { id: 'transmission', label: '透射谱' },
    { id: 'bandwidth', label: '调制带宽' },
    { id: 'distribution', label: '客户项目分布' },
  ]

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <span className="chart-title">透射谱</span>
        <div className="chart-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`chart-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
      <div className="chart-body">
        <canvas ref={canvasRef} className="chart-canvas" />
      </div>
    </div>
  )
}

/* ========== Data Node ========== */
interface DataNodeProps {
  x: string; y: string; label: string; color: 'blue' | 'green'
}

function DataNode({ x, y, label, color }: DataNodeProps) {
  return (
    <div
      className={`data-node node-${color}`}
      style={{ left: x, top: y }}
    >
      <div className="node-circle" />
      <div className="node-label">{label}</div>
    </div>
  )
}

/* ========== Main Page ========== */
export default function Home() {
  return (
    <div className="h-screen w-screen relative overflow-hidden" style={{ background: '#030614' }}>
      <ParticleCanvas />
      <div className="grid-bg" />

      {/* Corner Decorations */}
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />
      <div className="side-line-left" />
      <div className="side-line-right" />

      {/* AI Badge */}
      <div className="ai-badge">AI 生成</div>

      {/* Header */}
      <div className="header-bar">
        <div className="flex items-center gap-6">
          <div className="header-nav-item">数据空间</div>
        </div>
        <div className="header-title">铌酸锂光学测试数据平台</div>
        <div className="flex items-center gap-6">
          <div className="header-nav-item">测试任务</div>
          <div className="header-nav-item active">报告中心</div>
        </div>
      </div>

      {/* Section Labels */}
      <div className="section-label label-blue">内部研发测试数据</div>
      <div className="section-label label-green">外部客户测试数据</div>

      {/* Center Hub */}
      <div className="center-hub">
        <div className="hub-ring hub-ring-1" />
        <div className="hub-ring hub-ring-2" />
        <div className="hub-core" />
        <div className="hub-dot" />
      </div>

      {/* Light Beams */}
      <div className="beam-glow-left" />
      <div className="light-beam-left" />
      <div className="light-beam-right" />
      <div className="beam-glow-right" />

      {/* Blue Nodes (Left - Internal R&D) */}
      <DataNode x="12%" y="30%" label="材料表征" color="blue" />
      <DataNode x="18%" y="45%" label="波导损耗" color="blue" />
      <DataNode x="24%" y="55%" label="调制响应" color="blue" />
      <DataNode x="16%" y="62%" label="频率转换" color="blue" />
      <DataNode x="30%" y="38%" label="频率转换" color="blue" />

      {/* Green Nodes (Right - External Clients) */}
      <DataNode x="72%" y="28%" label="客户样品" color="green" />
      <DataNode x="80%" y="42%" label="测试工单" color="green" />
      <DataNode x="68%" y="58%" label="原始数据" color="green" />
      <DataNode x="82%" y="60%" label="结果报告" color="green" />

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {/* Controls */}
        <div className="controls-panel">
          <div className="timeline-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,255,0.5)" strokeWidth="2">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            <div className="timeline-track">
              <div className="timeline-fill" />
              <div className="timeline-thumb" />
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,255,0.5)" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </div>
          <div className="control-buttons">
            <div className="ctrl-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              时间轴播放
            </div>
            <div className="ctrl-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="6" r="2" />
                <circle cx="19" cy="8" r="2" />
                <circle cx="8" cy="18" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              粒子密度
            </div>
            <div className="ctrl-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
              </svg>
              数据筛选
            </div>
          </div>
        </div>

        {/* Chart */}
        <SpectrumChart />
      </div>
    </div>
  )
}
