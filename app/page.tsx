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

    // Grid
    ctx.strokeStyle = 'rgba(0,120,180,0.06)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 6; i++) {
      const y = 10 + (h - 30) * (i / 6)
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(w - 10, y); ctx.stroke()
      ctx.fillStyle = 'rgba(120,160,200,0.3)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(1000 - i * 150), 26, y + 3)
    }

    // X labels
    ctx.textAlign = 'center'
    const xLabels = ['20-10', '20-10', '40-10', '20-10', '30-00', '20-16', '20-10', '70-40', '20-16', '10-16']
    xLabels.forEach((l, i) => {
      ctx.fillText(l, 30 + (w - 40) * (i / (xLabels.length - 1)), h - 8)
    })

    // Data line 1 (项目数量) - cyan
    const data1 = [280, 350, 420, 520, 450, 380, 500, 650, 580, 400]
    ctx.beginPath()
    data1.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data1.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(0,220,255,0.8)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill under line 1
    ctx.lineTo(30 + w - 40, h - 20)
    ctx.lineTo(30, h - 20)
    ctx.closePath()
    const grad1 = ctx.createLinearGradient(0, 0, 0, h)
    grad1.addColorStop(0, 'rgba(0,200,255,0.15)')
    grad1.addColorStop(1, 'transparent')
    ctx.fillStyle = grad1
    ctx.fill()

    // Data dots
    data1.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data1.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,220,255,0.9)'
      ctx.fill()
    })

    // Data line 2 (新项目数量) - green
    const data2 = [180, 220, 300, 380, 320, 280, 400, 520, 450, 300]
    ctx.beginPath()
    data2.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data2.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(0,200,180,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()

    data2.forEach((v, i) => {
      const x = 30 + (w - 40) * (i / (data2.length - 1))
      const y = 10 + (h - 30) * (1 - v / 1000)
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,200,180,0.8)'
      ctx.fill()
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
    const size = 140
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = 55

    // Background ring
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,100,150,0.15)'
    ctx.lineWidth = 10
    ctx.stroke()

    // Progress ring (50%)
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + Math.PI // 50%

    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, 'rgba(0,220,255,0.9)')
    grad.addColorStop(0.5, 'rgba(0,180,220,0.7)')
    grad.addColorStop(1, 'rgba(0,120,200,0.5)')

    ctx.beginPath()
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.strokeStyle = grad
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.stroke()

    // Glow effect
    ctx.beginPath()
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.strokeStyle = 'rgba(0,200,255,0.15)'
    ctx.lineWidth = 20
    ctx.filter = 'blur(8px)'
    ctx.stroke()
    ctx.filter = 'none'
  }, [])

  return (
    <div className="gauge-ring">
      <canvas ref={canvasRef} style={{ width: 140, height: 140 }} />
      <div className="gauge-value">
        <div className="gauge-num">50<span style={{ fontSize: 16 }}>%</span></div>
        <div className="gauge-sub">项目完成率</div>
      </div>
    </div>
  )
}

function DataCard({ title, items, cylinderLabel }: {
  title: string; items: { label: string; icon: string }[]; cylinderLabel: string
}) {
  return (
    <div className="panel flex-1">
      <div className="card-header">
        <span className="arrow">›</span>
        {title}
      </div>
      <div style={{ display: 'flex', gap: 20, padding: '0 24px 24px' }}>
        <div className="btn-grid" style={{ flex: 1, padding: 0 }}>
          {items.map((item) => (
            <div key={item.label} className="data-btn cyan">
              <div className="icon">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>
        <div className="cylinder-wrap" style={{ padding: 0, flex: '0 0 120px' }}>
          <div className="cylinder">
            <div className="cyl-top" />
            <div className="cyl-body" />
            <div className="cyl-bottom" />
            <div className="cyl-label">{cylinderLabel}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <div className="corner-dec c-tl" />
      <div className="corner-dec c-tr" />
      <div className="corner-dec c-bl" />
      <div className="corner-dec c-br" />

      {/* Header */}
      <div className="top-bar">
        <div className="nav-group">
          <div className="nav-tab active">首页</div>
          <div className="nav-tab">内部研发</div>
        </div>
        <div className="header-title">铌酸锂光学测试数据平台</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="nav-group">
            <div className="nav-tab">客户数据</div>
            <div className="nav-tab">测试分析</div>
            <div className="nav-tab">报告中心</div>
          </div>
          <div className="user-icons">
            <div className="user-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="user-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="subtitle-area">
        <div className="subtitle-title">数据概览</div>
        <div className="subtitle-desc">内部研发数据与外部客户数据分类管理</div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 pb-6">
        {/* Two Data Cards */}
        <div className="flex gap-6 mb-6">
          <DataCard
            title="内部研发测试数据"
            items={[
              { label: '薄膜铌酸锂', icon: '◉' },
              { label: '波导传输损耗', icon: '◈' },
              { label: '电光调制', icon: '◎' },
              { label: '频率转换', icon: '◉' },
            ]}
            cylinderLabel="长期可靠性"
          />
          <DataCard
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
        <div className="flex gap-6">
          {/* Chart */}
          <div className="panel flex-1" style={{ height: 220 }}>
            <div className="chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="chart-title">
                项目仪表盘统计
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'rgba(0,220,255,0.8)' }} />
                  项目数量
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'rgba(0,200,180,0.7)' }} />
                  新项目数量
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <LineChart />
              </div>
            </div>
          </div>

          {/* Gauge */}
          <div className="panel" style={{ width: 240, height: 220 }}>
            <div className="gauge-panel">
              <div className="gauge-title">标准仪表盘组件</div>
              <Gauge />
              <div className="gauge-legend">
                <div className="gauge-legend-item">
                  <div className="gauge-legend-dot" style={{ background: 'rgba(0,220,255,0.8)' }} />
                  内部数据总量
                </div>
                <div className="gauge-legend-item">
                  <div className="gauge-legend-dot" style={{ background: 'rgba(0,120,180,0.5)' }} />
                  外部数据总量
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="panel" style={{ width: 260, height: 220 }}>
            <div className="recent-panel">
              <div className="recent-title">最近更新</div>
              <div className="recent-header">
                <span>信息</span>
                <span>更改</span>
              </div>
              {[
                { info: '铌酸锂薄膜器件性能测试', count: 'V2.3' },
                { info: '铌酸锂波导损耗测试数据', count: 'V1.8' },
                { info: '铌酸锂调制器频率响应', count: 'V3.1' },
                { info: '铌酸锂可靠性加速老化', count: 'V2.5' },
              ].map((row) => (
                <div key={row.info} className="recent-row">
                  <span className="info">{row.info}</span>
                  <span className="count">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
