'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const CX = W * 0.46
    const CY = H * 0.47

    // Left nodes (blue) - positions relative to viewport
    const leftNodes = [
      { x: W * 0.10, y: H * 0.32, label: '材料表征' },
      { x: W * 0.14, y: H * 0.50, label: '波导损耗' },
      { x: W * 0.22, y: H * 0.58, label: '调制响应' },
      { x: W * 0.13, y: H * 0.65, label: '频率转换' },
      { x: W * 0.28, y: H * 0.35, label: '频率转换' },
    ]

    // Right nodes (green)
    const rightNodes = [
      { x: W * 0.70, y: H * 0.28, label: '客户样品' },
      { x: W * 0.80, y: H * 0.42, label: '测试工单' },
      { x: W * 0.68, y: H * 0.58, label: '原始数据' },
      { x: W * 0.82, y: H * 0.60, label: '结果报告' },
    ]

    // Left connections
    const leftConns = [[0,1],[1,2],[2,3],[0,4],[4,1]]
    // Right connections
    const rightConns = [[0,1],[1,3],[0,2],[2,3]]

    // Particles flowing along beams
    interface FlowP {
      t: number; speed: number; offset: number; size: number; alpha: number; side: 'left' | 'right'
    }
    const flowParticles: FlowP[] = []
    for (let i = 0; i < 200; i++) {
      flowParticles.push({
        t: Math.random(),
        speed: 0.001 + Math.random() * 0.003,
        offset: (Math.random() - 0.5) * 80,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        side: i < 100 ? 'left' : 'right',
      })
    }

    // Explosion particles around center
    interface ExplodeP {
      angle: number; dist: number; speed: number; size: number; alpha: number; color: string
    }
    const explodeParticles: ExplodeP[] = []
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      explodeParticles.push({
        angle,
        dist: Math.random() * 120 + 30,
        speed: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '0,160,255' : '0,200,140',
      })
    }

    // Scatter sparkles
    interface Sparkle {
      x: number; y: number; size: number; alpha: number; phase: number; color: string
    }
    const sparkles: Sparkle[] = []
    for (let i = 0; i < 60; i++) {
      sparkles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.6 ? '0,180,255' : Math.random() > 0.5 ? '0,220,150' : '200,100,255',
      })
    }

    let frame = 0
    let animId: number

    const drawBeam = (fromX: number, fromY: number, toX: number, toY: number, color1: string, color2: string, width: number) => {
      const angle = Math.atan2(toY - fromY, toX - fromX)
      const len = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2)
      const perpX = -Math.sin(angle)
      const perpY = Math.cos(angle)

      // Outer glow
      ctx.save()
      ctx.globalAlpha = 0.15
      const grad = ctx.createLinearGradient(fromX, fromY, toX, toY)
      grad.addColorStop(0, color1)
      grad.addColorStop(1, color2)
      ctx.strokeStyle = grad
      ctx.lineWidth = width * 8
      ctx.filter = 'blur(12px)'
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
      ctx.restore()

      // Mid glow
      ctx.save()
      ctx.globalAlpha = 0.3
      const grad2 = ctx.createLinearGradient(fromX, fromY, toX, toY)
      grad2.addColorStop(0, color1)
      grad2.addColorStop(1, color2)
      ctx.strokeStyle = grad2
      ctx.lineWidth = width * 3
      ctx.filter = 'blur(4px)'
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
      ctx.restore()

      // Core
      ctx.save()
      ctx.globalAlpha = 0.8
      const grad3 = ctx.createLinearGradient(fromX, fromY, toX, toY)
      grad3.addColorStop(0, color1)
      grad3.addColorStop(0.5, 'rgba(255,255,255,0.6)')
      grad3.addColorStop(1, color2)
      ctx.strokeStyle = grad3
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
      ctx.restore()
    }

    const drawNode = (x: number, y: number, label: string, color: 'blue' | 'green', pulse: number) => {
      const c = color === 'blue' ? [0, 180, 255] : [0, 220, 130]
      const cs = `rgba(${c[0]},${c[1]},${c[2]},`

      // Outer ring pulse
      const ringR = 18 + pulse * 6
      ctx.beginPath()
      ctx.arc(x, y, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = cs + (0.15 - pulse * 0.1) + ')'
      ctx.lineWidth = 1
      ctx.stroke()

      // Middle ring
      ctx.beginPath()
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.strokeStyle = cs + '0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 25)
      glow.addColorStop(0, cs + '0.4)')
      glow.addColorStop(0.5, cs + '0.1)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(x - 25, y - 25, 50, 50)

      // Core dot
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = cs + '0.9)'
      ctx.fill()

      // Center bright
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.min(c[0]+100,255)},${Math.min(c[1]+100,255)},${Math.min(c[2]+100,255)},0.9)`
      ctx.fill()

      // Label
      ctx.font = '12px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const metrics = ctx.measureText(label)
      const tw = metrics.width + 16
      const th = 22
      const lx = color === 'blue' ? x - 40 : x + 40
      const ly = y - 20

      ctx.fillStyle = color === 'blue' ? 'rgba(0,30,80,0.6)' : 'rgba(0,50,30,0.6)'
      ctx.strokeStyle = color === 'blue' ? 'rgba(0,120,255,0.25)' : 'rgba(0,180,100,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(lx - tw / 2, ly - th / 2, tw, th, 3)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = color === 'blue' ? 'rgba(120,200,255,0.85)' : 'rgba(120,230,180,0.85)'
      ctx.fillText(label, lx, ly)
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      frame++
      const t = frame * 0.01
      const pulse = (Math.sin(t * 2) + 1) / 2

      // Background gradient
      const bgGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, W * 0.6)
      bgGrad.addColorStop(0, 'rgba(0,30,80,0.12)')
      bgGrad.addColorStop(0.5, 'rgba(0,15,40,0.06)')
      bgGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,80,200,0.03)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Draw beams
      drawBeam(CX, CY, W * 0.05, H * 0.28, 'rgba(0,100,255,0.7)', 'rgba(0,180,255,0.3)', 2)
      drawBeam(CX, CY, W * 0.08, H * 0.75, 'rgba(0,80,255,0.5)', 'rgba(100,0,255,0.3)', 1.5)
      drawBeam(CX, CY, W * 0.95, H * 0.22, 'rgba(0,200,120,0.3)', 'rgba(0,255,150,0.7)', 2)
      drawBeam(CX, CY, W * 0.92, H * 0.72, 'rgba(0,180,100,0.3)', 'rgba(0,255,120,0.5)', 1.5)

      // Flow particles along beams
      flowParticles.forEach(p => {
        p.t += p.speed
        if (p.t > 1) { p.t = 0; p.offset = (Math.random() - 0.5) * 80 }

        const angle = p.side === 'left'
          ? Math.PI + (Math.random() - 0.5) * 0.8
          : (Math.random() - 0.5) * 0.8
        const dist = p.t * W * 0.55
        const baseAngle = p.side === 'left' ? Math.PI - 0.3 : 0.1

        const px = CX + Math.cos(baseAngle + (Math.random() - 0.5) * 0.6) * dist
        const py = CY + Math.sin(baseAngle + (Math.random() - 0.5) * 0.6) * dist + p.offset * p.t

        if (px > 0 && px < W && py > 0 && py < H) {
          const col = p.side === 'left' ? '0,160,255' : '0,220,140'
          ctx.beginPath()
          ctx.arc(px, py, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${p.alpha * (1 - p.t * 0.5)})`
          ctx.fill()

          // Trail
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px - (p.side === 'left' ? -3 : 3), py - 1)
          ctx.strokeStyle = `rgba(${col},${p.alpha * 0.15})`
          ctx.lineWidth = p.size * 0.6
          ctx.stroke()
        }
      })

      // Explosion particles around center
      explodeParticles.forEach(p => {
        p.dist += p.speed * 0.3
        if (p.dist > 150) p.dist = 30

        const px = CX + Math.cos(p.angle + t * 0.2) * p.dist
        const py = CY + Math.sin(p.angle + t * 0.2) * p.dist

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha * (1 - p.dist / 150)})`
        ctx.fill()
      })

      // Sparkles
      sparkles.forEach(s => {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(t * 3 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color},${a})`
        ctx.fill()
      })

      // Center hub
      // Outer glow
      const hubGlow = ctx.createRadialGradient(CX, CY, 0, CX, CY, 80)
      hubGlow.addColorStop(0, 'rgba(0,200,255,0.15)')
      hubGlow.addColorStop(0.4, 'rgba(0,120,255,0.06)')
      hubGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = hubGlow
      ctx.fillRect(CX - 80, CY - 80, 160, 160)

      // Rings
      ctx.strokeStyle = `rgba(0,180,255,${0.15 + pulse * 0.1})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(CX, CY, 50, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(150,0,255,0.1)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.arc(CX, CY, 42, t, t + Math.PI * 1.5)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = `rgba(0,200,255,${0.2 + pulse * 0.15})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(CX, CY, 32, 0, Math.PI * 2)
      ctx.stroke()

      // Core
      const coreGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 22)
      coreGrad.addColorStop(0, 'rgba(200,240,255,0.8)')
      coreGrad.addColorStop(0.3, 'rgba(0,200,255,0.5)')
      coreGrad.addColorStop(0.7, 'rgba(0,100,255,0.15)')
      coreGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(CX, CY, 22, 0, Math.PI * 2)
      ctx.fill()

      // Bright center
      ctx.beginPath()
      ctx.arc(CX, CY, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(220,250,255,0.9)'
      ctx.fill()

      // Lens flare lines
      ctx.save()
      ctx.globalAlpha = 0.2 + pulse * 0.15
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4 + t * 0.1
        ctx.beginPath()
        ctx.moveTo(CX + Math.cos(a) * 8, CY + Math.sin(a) * 8)
        ctx.lineTo(CX + Math.cos(a) * 45, CY + Math.sin(a) * 45)
        ctx.strokeStyle = 'rgba(0,200,255,0.3)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      ctx.restore()

      // Draw connection lines between left nodes
      ctx.strokeStyle = 'rgba(0,120,255,0.12)'
      ctx.lineWidth = 1
      leftConns.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(leftNodes[a].x, leftNodes[a].y)
        ctx.lineTo(leftNodes[b].x, leftNodes[b].y)
        ctx.stroke()
      })

      // Draw connection lines between right nodes
      ctx.strokeStyle = 'rgba(0,180,100,0.12)'
      rightConns.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(rightNodes[a].x, rightNodes[a].y)
        ctx.lineTo(rightNodes[b].x, rightNodes[b].y)
        ctx.stroke()
      })

      // Draw nodes
      leftNodes.forEach((n, i) => {
        drawNode(n.x, n.y, n.label, 'blue', (Math.sin(t * 2 + i) + 1) / 2)
      })
      rightNodes.forEach((n, i) => {
        drawNode(n.x, n.y, n.label, 'green', (Math.sin(t * 2 + i + 1) + 1) / 2)
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Draw chart
  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    canvas.width = rect.width * 2
    canvas.height = (rect.height - 38) * 2
    ctx.scale(2, 2)
    const w = rect.width
    const h = rect.height - 38

    ctx.clearRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(0,80,200,0.06)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = 8 + (h - 20) * (i / 4)
      ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(w - 8, y); ctx.stroke()
      ctx.fillStyle = 'rgba(120,160,200,0.3)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(300 - i * 50), 24, y + 3)
    }

    // X labels
    ctx.textAlign = 'center'
    ;['0.5', '1.0', '1.5', '2.0'].forEach((l, i) => {
      ctx.fillText(l, 28 + (w - 36) * (i / 3), h - 4)
    })

    // Curves
    const drawCurve = (offset: number, r: number, g: number, b: number, amp: number) => {
      ctx.beginPath()
      for (let x = 0; x <= w - 36; x++) {
        const t = x / (w - 36)
        const y = 12 + (h - 28) / 2 +
          Math.sin(t * 7 + offset) * amp * (1 - t * 0.2) +
          Math.sin(t * 14 + offset * 2) * amp * 0.3 +
          Math.sin(t * 3 + offset * 0.5) * amp * 0.4
        if (x === 0) ctx.moveTo(28 + x, y)
        else ctx.lineTo(28 + x, y)
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Fill
      ctx.lineTo(28 + w - 36, h - 16)
      ctx.lineTo(28, h - 16)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.12)`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()
    }

    drawCurve(0, 0, 180, 255, 22)
    drawCurve(2, 0, 230, 150, 18)
    drawCurve(4, 180, 0, 255, 14)
  }, [activeTab])

  const tabs = ['透射谱', '调制带宽', '客户项目分布']

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#020410' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Corners */}
      <div className="corner c-tl" />
      <div className="corner c-tr" />
      <div className="corner c-bl" />
      <div className="corner c-br" />
      <div className="side-v side-v-l" />
      <div className="side-v side-v-r" />

      {/* Header */}
      <div className="hdr">
        <div className="hdr-ai">AI 生成</div>
        <div className="hdr-nav">数据空间</div>
        <div className="hdr-title">铌酸锂光学测试数据平台</div>
        <div className="hdr-nav">测试任务</div>
        <div className="hdr-nav on">报告中心</div>
      </div>

      {/* Section Labels */}
      <div className="sec-label sec-blue">内部研发测试数据</div>
      <div className="sec-label sec-green">外部客户测试数据</div>

      {/* Bottom Controls */}
      <div className="ctrl-area">
        <div className="timeline-row">
          <div className="tl-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
          <div className="tl-track">
            <div className="tl-fill" />
            <div className="tl-thumb" />
          </div>
          <div className="tl-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="5" height="18" /><rect x="14" y="3" width="5" height="18" /></svg>
          </div>
        </div>
        <div className="ctrl-btns">
          <div className="cbtn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
            时间轴播放
          </div>
          <div className="cbtn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="2" /><circle cx="19" cy="8" r="2" /></svg>
            粒子密度
          </div>
          <div className="cbtn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" /></svg>
            数据筛选
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-area">
        <div className="chart-hdr">
          <span className="chart-title">透射谱</span>
          <div className="chart-tabs">
            {tabs.map((tab, i) => (
              <div key={tab} className={`ctab ${activeTab === i ? 'on' : ''}`} onClick={() => setActiveTab(i)}>
                {tab}
              </div>
            ))}
          </div>
        </div>
        <div className="chart-body">
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}
