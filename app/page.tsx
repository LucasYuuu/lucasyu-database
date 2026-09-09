'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // Center of the portal
    const CX = W * 0.45
    const CY = H * 0.48

    // ====== Beam curve control points ======
    // Left blue beam curves upward-left
    const blueBeam1 = { // upper-left main beam
      start: { x: CX, y: CY },
      cp1: { x: CX - W * 0.12, y: CY - H * 0.08 },
      cp2: { x: CX - W * 0.22, y: CY - H * 0.18 },
      end: { x: W * 0.04, y: H * 0.18 }
    }
    const blueBeam2 = { // lower-left
      start: { x: CX, y: CY },
      cp1: { x: CX - W * 0.10, y: CY + H * 0.05 },
      cp2: { x: CX - W * 0.18, y: CY + H * 0.12 },
      end: { x: W * 0.06, y: H * 0.72 }
    }

    // Right green beam curves right
    const greenBeam1 = { // upper-right
      start: { x: CX, y: CY },
      cp1: { x: CX + W * 0.12, y: CY - H * 0.06 },
      cp2: { x: CX + W * 0.22, y: CY - H * 0.14 },
      end: { x: W * 0.92, y: H * 0.18 }
    }
    const greenBeam2 = { // lower-right
      start: { x: CX, y: CY },
      cp1: { x: CX + W * 0.10, y: CY + H * 0.04 },
      cp2: { x: CX + W * 0.18, y: CY + H * 0.10 },
      end: { x: W * 0.90, y: H * 0.68 }
    }

    function bezierPoint(t: number, p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}, p3: {x:number,y:number}) {
      const u = 1 - t
      return {
        x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
        y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
      }
    }

    function bezierTangent(t: number, p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}, p3: {x:number,y:number}) {
      const u = 1 - t
      return {
        x: -3*u*u*p0.x + 3*(u*u - 2*u*t)*p1.x + 3*(2*u*t - t*t)*p2.x + 3*t*t*p3.x,
        y: -3*u*u*p0.y + 3*(u*u - 2*u*t)*p1.y + 3*(2*u*t - t*t)*p2.y + 3*t*t*p3.y
      }
    }

    // ====== Nodes positioned along beams ======
    const leftNodes = [
      { beam: blueBeam1, t: 0.35, label: '材料表征', labelDir: 'left' as const },
      { beam: blueBeam1, t: 0.55, label: '频率转换', labelDir: 'left' as const },
      { beam: blueBeam2, t: 0.35, label: '波导损耗', labelDir: 'left' as const },
      { beam: blueBeam2, t: 0.55, label: '调制响应', labelDir: 'left' as const },
      { beam: blueBeam1, t: 0.75, label: '频率转换', labelDir: 'left' as const },
    ]

    const rightNodes = [
      { beam: greenBeam1, t: 0.35, label: '客户样品', labelDir: 'right' as const },
      { beam: greenBeam1, t: 0.60, label: '测试工单', labelDir: 'right' as const },
      { beam: greenBeam2, t: 0.45, label: '原始数据', labelDir: 'right' as const },
      { beam: greenBeam2, t: 0.70, label: '结果报告', labelDir: 'right' as const },
    ]

    // Node connections (indices)
    const leftConns = [[0,1],[0,2],[1,4],[2,3],[3,4]]
    const rightConns = [[0,1],[0,2],[1,3],[2,3]]

    // ====== Flow particles ======
    interface FlowP {
      t: number; speed: number; side: 'left'|'right'; beamIdx: number;
      size: number; alpha: number; drift: number
    }
    const flowParticles: FlowP[] = []
    for (let i = 0; i < 250; i++) {
      const side = i < 130 ? 'left' : 'right'
      flowParticles.push({
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        side,
        beamIdx: Math.random() > 0.5 ? 0 : 1,
        size: Math.random() * 2.2 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        drift: (Math.random() - 0.5) * 20,
      })
    }

    // ====== Explosion particles ======
    interface ExplodeP {
      angle: number; dist: number; speed: number; size: number; alpha: number
    }
    const explodeP: ExplodeP[] = []
    for (let i = 0; i < 200; i++) {
      explodeP.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 100 + 20,
        speed: 0.3 + Math.random() * 0.8,
        size: Math.random() * 2 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
      })
    }

    // ====== Sparkles ======
    interface Sparkle { x: number; y: number; size: number; phase: number; alpha: number }
    const sparkles: Sparkle[] = []
    for (let i = 0; i < 80; i++) {
      sparkles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }

    let animId: number

    const drawCurvedBeam = (
      beam: typeof blueBeam1,
      color1: string, color2: string, coreWidth: number
    ) => {
      // Outer glow
      ctx.save()
      ctx.globalAlpha = 0.12
      ctx.filter = 'blur(16px)'
      ctx.strokeStyle = color1
      ctx.lineWidth = coreWidth * 10
      ctx.beginPath()
      ctx.moveTo(beam.start.x, beam.start.y)
      ctx.bezierCurveTo(beam.cp1.x, beam.cp1.y, beam.cp2.x, beam.cp2.y, beam.end.x, beam.end.y)
      ctx.stroke()
      ctx.restore()

      // Mid glow
      ctx.save()
      ctx.globalAlpha = 0.25
      ctx.filter = 'blur(6px)'
      const gMid = ctx.createLinearGradient(beam.start.x, beam.start.y, beam.end.x, beam.end.y)
      gMid.addColorStop(0, color1)
      gMid.addColorStop(1, color2)
      ctx.strokeStyle = gMid
      ctx.lineWidth = coreWidth * 4
      ctx.beginPath()
      ctx.moveTo(beam.start.x, beam.start.y)
      ctx.bezierCurveTo(beam.cp1.x, beam.cp1.y, beam.cp2.x, beam.cp2.y, beam.end.x, beam.end.y)
      ctx.stroke()
      ctx.restore()

      // Core bright line
      ctx.save()
      ctx.globalAlpha = 0.7
      const gCore = ctx.createLinearGradient(beam.start.x, beam.start.y, beam.end.x, beam.end.y)
      gCore.addColorStop(0, color1)
      gCore.addColorStop(0.4, 'rgba(255,255,255,0.5)')
      gCore.addColorStop(1, color2)
      ctx.strokeStyle = gCore
      ctx.lineWidth = coreWidth
      ctx.beginPath()
      ctx.moveTo(beam.start.x, beam.start.y)
      ctx.bezierCurveTo(beam.cp1.x, beam.cp1.y, beam.cp2.x, beam.cp2.y, beam.end.x, beam.end.y)
      ctx.stroke()
      ctx.restore()
    }

    const drawDataNode = (
      x: number, y: number, label: string, isBlue: boolean, pulse: number
    ) => {
      const c = isBlue ? [0, 180, 255] : [0, 220, 130]
      const cs = `rgba(${c[0]},${c[1]},${c[2]},`

      // Outer pulse ring
      ctx.beginPath()
      ctx.arc(x, y, 20 + pulse * 8, 0, Math.PI * 2)
      ctx.strokeStyle = cs + (0.12 - pulse * 0.08) + ')'
      ctx.lineWidth = 1
      ctx.stroke()

      // Glow aura
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 30)
      glow.addColorStop(0, cs + '0.35)')
      glow.addColorStop(0.5, cs + '0.08)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(x - 30, y - 30, 60, 60)

      // Middle ring
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.strokeStyle = cs + '0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Inner ring
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      ctx.fillStyle = cs + '0.25)'
      ctx.fill()
      ctx.strokeStyle = cs + '0.5)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Core bright dot
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      const bright = ctx.createRadialGradient(x, y, 0, x, y, 3.5)
      bright.addColorStop(0, `rgba(${Math.min(c[0]+120,255)},${Math.min(c[1]+120,255)},${Math.min(c[2]+120,255)},1)`)
      bright.addColorStop(1, cs + '0.7)')
      ctx.fillStyle = bright
      ctx.fill()

      // Label box
      const isLeft = isBlue
      const lx = isLeft ? x - 38 : x + 38
      const ly = y - 24
      ctx.font = '12px -apple-system, sans-serif'
      const tw = ctx.measureText(label).width + 16
      const th = 22

      ctx.fillStyle = isLeft ? 'rgba(0,25,70,0.7)' : 'rgba(0,45,25,0.7)'
      ctx.strokeStyle = isLeft ? 'rgba(0,120,255,0.3)' : 'rgba(0,180,100,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(lx - tw / 2, ly - th / 2, tw, th, 3)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = isLeft ? 'rgba(120,200,255,0.9)' : 'rgba(120,230,180,0.9)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, lx, ly)
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      frameRef.current++
      const f = frameRef.current
      const t = f * 0.01
      const pulse = (Math.sin(t * 2) + 1) / 2

      // === Background ===
      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, W * 0.55)
      bg.addColorStop(0, 'rgba(0,25,70,0.1)')
      bg.addColorStop(0.6, 'rgba(0,10,30,0.04)')
      bg.addColorStop(1, 'transparent')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,60,180,0.025)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // === Draw beams ===
      drawCurvedBeam(blueBeam1, 'rgba(0,100,255,0.8)', 'rgba(0,180,255,0.3)', 2)
      drawCurvedBeam(blueBeam2, 'rgba(0,80,255,0.6)', 'rgba(100,0,255,0.3)', 1.5)
      drawCurvedBeam(greenBeam1, 'rgba(0,180,100,0.3)', 'rgba(0,255,150,0.8)', 2)
      drawCurvedBeam(greenBeam2, 'rgba(0,160,90,0.3)', 'rgba(0,255,120,0.6)', 1.5)

      // === Flow particles along beams ===
      flowParticles.forEach(fp => {
        fp.t += fp.speed
        if (fp.t > 1) { fp.t = 0; fp.drift = (Math.random() - 0.5) * 20 }

        const beams = fp.side === 'left' ? [blueBeam1, blueBeam2] : [greenBeam1, greenBeam2]
        const beam = beams[fp.beamIdx]
        const pt = bezierPoint(fp.t, beam.start, beam.cp1, beam.cp2, beam.end)
        const tg = bezierTangent(fp.t, beam.start, beam.cp1, beam.cp2, beam.end)
        const len = Math.sqrt(tg.x * tg.x + tg.y * tg.y)
        const nx = -tg.y / (len || 1)
        const ny = tg.x / (len || 1)

        const px = pt.x + nx * fp.drift
        const py = pt.y + ny * fp.drift

        if (px > 0 && px < W && py > 0 && py < H) {
          const col = fp.side === 'left' ? '0,160,255' : '0,220,140'
          const fade = fp.t < 0.1 ? fp.t / 0.1 : fp.t > 0.9 ? (1 - fp.t) / 0.1 : 1

          ctx.beginPath()
          ctx.arc(px, py, fp.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${fp.alpha * fade})`
          ctx.fill()

          // Small trail
          const prevPt = bezierPoint(Math.max(0, fp.t - 0.02), beam.start, beam.cp1, beam.cp2, beam.end)
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(prevPt.x + nx * fp.drift, prevPt.y + ny * fp.drift)
          ctx.strokeStyle = `rgba(${col},${fp.alpha * fade * 0.2})`
          ctx.lineWidth = fp.size * 0.5
          ctx.stroke()
        }
      })

      // === Explosion particles around center ===
      explodeP.forEach(ep => {
        ep.dist += ep.speed * 0.4
        if (ep.dist > 130) { ep.dist = 20; ep.angle = Math.random() * Math.PI * 2 }

        const px = CX + Math.cos(ep.angle + t * 0.15) * ep.dist
        const py = CY + Math.sin(ep.angle + t * 0.15) * ep.dist
        const fade = 1 - ep.dist / 130

        // Determine color based on direction
        const col = ep.angle > -Math.PI * 0.3 && ep.angle < Math.PI * 0.8 ? '0,200,140' : '0,160,255'

        ctx.beginPath()
        ctx.arc(px, py, ep.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col},${ep.alpha * fade})`
        ctx.fill()
      })

      // === Sparkles ===
      sparkles.forEach(s => {
        const a = s.alpha * (0.4 + 0.6 * Math.sin(t * 4 + s.phase))
        if (a > 0.05) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,220,255,${a})`
          ctx.fill()
        }
      })

      // === Connection lines between nodes ===
      // Left
      ctx.strokeStyle = 'rgba(0,120,255,0.1)'
      ctx.lineWidth = 1
      leftConns.forEach(([a, b]) => {
        const na = leftNodes[a], nb = leftNodes[b]
        const pa = bezierPoint(na.t, na.beam.start, na.beam.cp1, na.beam.cp2, na.beam.end)
        const pb = bezierPoint(nb.t, nb.beam.start, nb.beam.cp1, nb.beam.cp2, nb.beam.end)
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke()
      })
      // Right
      ctx.strokeStyle = 'rgba(0,180,100,0.1)'
      rightConns.forEach(([a, b]) => {
        const na = rightNodes[a], nb = rightNodes[b]
        const pa = bezierPoint(na.t, na.beam.start, na.beam.cp1, na.beam.cp2, na.beam.end)
        const pb = bezierPoint(nb.t, nb.beam.start, nb.beam.cp1, nb.beam.cp2, nb.beam.end)
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke()
      })

      // === Draw nodes ===
      leftNodes.forEach((n, i) => {
        const p = bezierPoint(n.t, n.beam.start, n.beam.cp1, n.beam.cp2, n.beam.end)
        drawDataNode(p.x, p.y, n.label, true, (Math.sin(t * 2.5 + i * 1.2) + 1) / 2)
      })
      rightNodes.forEach((n, i) => {
        const p = bezierPoint(n.t, n.beam.start, n.beam.cp1, n.beam.cp2, n.beam.end)
        drawDataNode(p.x, p.y, n.label, false, (Math.sin(t * 2.5 + i * 1.2 + 1) + 1) / 2)
      })

      // === Center Hub ===
      // Outer glow
      const hubGlow = ctx.createRadialGradient(CX, CY, 0, CX, CY, 90)
      hubGlow.addColorStop(0, 'rgba(0,200,255,0.12)')
      hubGlow.addColorStop(0.4, 'rgba(0,100,255,0.04)')
      hubGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = hubGlow
      ctx.fillRect(CX - 90, CY - 90, 180, 180)

      // Ring 1 (outer)
      ctx.strokeStyle = `rgba(0,160,255,${0.15 + pulse * 0.1})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(CX, CY, 55, 0, Math.PI * 2)
      ctx.stroke()

      // Ring 2 (dashed, rotating)
      ctx.save()
      ctx.translate(CX, CY)
      ctx.rotate(t * 0.3)
      ctx.strokeStyle = 'rgba(140,0,255,0.12)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(0, 0, 45, 0, Math.PI * 1.6)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Ring 3 (inner)
      ctx.strokeStyle = `rgba(0,200,255,${0.25 + pulse * 0.15})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(CX, CY, 35, 0, Math.PI * 2)
      ctx.stroke()

      // Core gradient
      const coreGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 25)
      coreGrad.addColorStop(0, 'rgba(220,245,255,0.85)')
      coreGrad.addColorStop(0.25, 'rgba(0,200,255,0.5)')
      coreGrad.addColorStop(0.6, 'rgba(0,100,255,0.12)')
      coreGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(CX, CY, 25, 0, Math.PI * 2)
      ctx.fill()

      // Bright center dot
      ctx.beginPath()
      ctx.arc(CX, CY, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(230,250,255,0.95)'
      ctx.fill()

      // Lens flare streaks
      ctx.save()
      ctx.globalAlpha = 0.18 + pulse * 0.12
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 + t * 0.08
        ctx.beginPath()
        ctx.moveTo(CX + Math.cos(a) * 6, CY + Math.sin(a) * 6)
        ctx.lineTo(CX + Math.cos(a) * 50, CY + Math.sin(a) * 50)
        ctx.strokeStyle = 'rgba(0,200,255,0.25)'
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
      ctx.restore()

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

  // Chart
  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    const dpr = 2
    canvas.width = rect.width * dpr
    canvas.height = (rect.height - 38) * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height - 38

    ctx.clearRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(0,80,200,0.06)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = 8 + (h - 22) * (i / 4)
      ctx.beginPath(); ctx.moveTo(28, y); ctx.lineTo(w - 8, y); ctx.stroke()
      ctx.fillStyle = 'rgba(120,160,200,0.3)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(300 - i * 50), 24, y + 3)
    }
    ctx.textAlign = 'center'
    ;['0.5', '1.0', '1.5', '2.0'].forEach((l, i) => {
      ctx.fillText(l, 28 + (w - 36) * (i / 3), h - 4)
    })

    const drawCurve = (offset: number, r: number, g: number, b: number, amp: number) => {
      ctx.beginPath()
      for (let x = 0; x <= w - 36; x++) {
        const t = x / (w - 36)
        const y = 12 + (h - 30) / 2 +
          Math.sin(t * 7 + offset) * amp * (1 - t * 0.15) +
          Math.sin(t * 14 + offset * 2) * amp * 0.25 +
          Math.sin(t * 3 + offset * 0.5) * amp * 0.35
        if (x === 0) ctx.moveTo(28 + x, y)
        else ctx.lineTo(28 + x, y)
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.lineTo(28 + w - 36, h - 16)
      ctx.lineTo(28, h - 16)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.1)`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()
    }

    drawCurve(0, 0, 180, 255, 22)
    drawCurve(2, 0, 230, 150, 18)
    drawCurve(4, 180, 0, 255, 14)
  }, [activeTab])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#020410' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div className="corner c-tl" />
      <div className="corner c-tr" />
      <div className="corner c-bl" />
      <div className="corner c-br" />
      <div className="side-v side-v-l" />
      <div className="side-v side-v-r" />

      <div className="hdr">
        <div className="hdr-ai">AI 生成</div>
        <div className="hdr-nav">数据空间</div>
        <div className="hdr-title">铌酸锂光学测试数据平台</div>
        <div className="hdr-nav">测试任务</div>
        <div className="hdr-nav on">报告中心</div>
      </div>

      <div className="sec-label sec-blue">内部研发测试数据</div>
      <div className="sec-label sec-green">外部客户测试数据</div>

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

      <div className="chart-area">
        <div className="chart-hdr">
          <span className="chart-title">透射谱</span>
          <div className="chart-tabs">
            {['透射谱', '调制带宽', '客户项目分布'].map((tab, i) => (
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
