'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = []
    const colors = ['rgba(0,150,255,', 'rgba(0,200,180,', 'rgba(120,0,255,']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.fill()

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0,150,255,${0.06 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}

function OpticalChip() {
  return (
    <div className="relative" style={{ width: 300, height: 300 }}>
      {/* Rotating Rings */}
      <div className="ring ring-1" />
      <div className="ring ring-2" />
      <div className="ring ring-3" />

      {/* Ring Orbs */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          className="absolute top-1/2 left-1/2"
          style={{
            width: 8,
            height: 8,
            background: 'radial-gradient(circle, rgba(0,200,255,0.8), rgba(0,100,255,0.2))',
            borderRadius: '50%',
            boxShadow: '0 0 12px rgba(0,200,255,0.5)',
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(110px)`,
            animation: `spin 20s linear infinite`,
          }}
        />
      ))}

      {/* Light Beams */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <div
          key={`beam-${deg}`}
          className="light-beam"
          style={{
            width: 150,
            background: `linear-gradient(90deg, rgba(0,180,255,0.4), transparent)`,
            transform: `rotate(${deg}deg)`,
            animationDelay: `${deg * 0.02}s`,
          }}
        />
      ))}

      {/* Waveguide Lines */}
      {[-1, 1].map((dir) => (
        <div key={`wg-${dir}`}>
          <div
            className="waveguide"
            style={{
              width: 200,
              top: '50%',
              left: dir === -1 ? undefined : '50%',
              right: dir === -1 ? '50%' : undefined,
              transform: `translateY(-50%)`,
            }}
          />
          <div
            className="waveguide"
            style={{
              height: 200,
              width: 1,
              left: '50%',
              top: dir === -1 ? undefined : '50%',
              bottom: dir === -1 ? '50%' : undefined,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, transparent, rgba(0,150,255,0.3), transparent)',
            }}
          />
        </div>
      ))}

      {/* Central Chip Body */}
      <div className="chip-body" />
      <div className="chip-inner">
        <div className="chip-dot" />
      </div>

      {/* Chip Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-xs tracking-widest uppercase mt-1"
          style={{ color: 'rgba(0,180,255,0.5)', marginTop: 80 }}
        >
          LN Chip
        </div>
      </div>
    </div>
  )
}

interface MenuItemProps {
  title: string
  desc: string
  icon: React.ReactNode
  color: 'blue' | 'green'
  items: string[]
  style?: React.CSSProperties
}

function MenuItem({ title, desc, icon, color, items, style }: MenuItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`menu-card ${color === 'green' ? 'green' : ''}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tooltip" style={{ top: -8, left: '50%', transform: `translateX(-50%) translateY(${hovered ? '-8px' : '0'})` }}>
        点击进入
      </div>

      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: color === 'blue'
              ? 'linear-gradient(135deg, rgba(0,100,255,0.2), rgba(0,60,180,0.1))'
              : 'linear-gradient(135deg, rgba(0,200,120,0.2), rgba(0,150,80,0.1))',
            border: `1px solid ${color === 'blue' ? 'rgba(0,120,255,0.2)' : 'rgba(0,200,120,0.2)'}`,
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
          <p className="text-xs mb-4" style={{ color: color === 'blue' ? 'rgba(100,180,255,0.5)' : 'rgba(100,200,150,0.5)' }}>
            {desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: color === 'blue'
                    ? 'rgba(0,80,200,0.12)'
                    : 'rgba(0,160,100,0.12)',
                  border: `1px solid ${color === 'blue' ? 'rgba(0,120,255,0.15)' : 'rgba(0,200,120,0.15)'}`,
                  color: color === 'blue' ? 'rgba(100,180,255,0.8)' : 'rgba(100,200,150,0.8)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative" style={{ background: '#030614' }}>
      {/* Background */}
      <div className="bg-cosmos" />
      <div className="grid-overlay" />
      <Particles />

      {/* Scan Line */}
      <div className="scan-line" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5">
          <div className="w-20" />
          <h1
            className="text-lg font-bold tracking-[0.3em] uppercase"
            style={{
              background: 'linear-gradient(90deg, rgba(0,150,255,0.6), rgba(200,220,255,0.9), rgba(0,200,180,0.6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            铌酸锂光芯片测试数据平台
          </h1>
          <nav className="flex items-center gap-6">
            {['数据仓库', '项目概览', '用户中心'].map((item) => (
              <button
                key={item}
                className="text-sm tracking-wide transition-colors duration-300"
                style={{ color: 'rgba(160,200,240,0.5)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(200,230,255,0.9)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(160,200,240,0.5)')}
              >
                {item}
              </button>
            ))}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ border: '1px solid rgba(0,150,255,0.15)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,150,255,0.4)'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0,150,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,150,255,0.15)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,150,255,0.5)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </nav>
        </header>

        {/* Main Layout */}
        <main className="max-w-7xl mx-auto px-10 py-6">
          <div className="grid grid-cols-[1fr_340px_1fr] gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6 pt-8">
              <MenuItem
                title="内部研发数据"
                desc="器件性能 · 电光调制 · 非线性光学 · 可靠性测试"
                color="blue"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,255,0.7)" strokeWidth="1.5">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v6m0 0H3m6 0h12M3 9v10a2 2 0 002 2h4m-6-12h18v10a2 2 0 01-2 2h-4m-6 0v-6m6 6h4a2 2 0 002-2V9m0 12v-6" />
                  </svg>
                }
                items={['薄膜铌酸锂', '波导传输损耗', '调制响应', '频率转换']}
              />

              <MenuItem
                title="光传输特性"
                desc="波导损耗 · 模场分布 · 耦合效率 · 偏振控制"
                color="blue"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,255,0.7)" strokeWidth="1.5">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                items={['TE模态', 'TM模态', '插入损耗', '回波损耗']}
              />

              <MenuItem
                title="电光调制性能"
                desc="半波电压 · 调制带宽 · 消光比 · 啁啾控制"
                color="blue"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,180,255,0.7)" strokeWidth="1.5">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                items={['Vπ电压', '3dB带宽', '消光比', '啁啾参数']}
              />
            </div>

            {/* Center - Optical Chip */}
            <div className="flex flex-col items-center justify-center pt-4" style={{ minHeight: 340 }}>
              <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease-in' }}>
                <OpticalChip />
              </div>
              <div className="mt-8 text-center">
                <div
                  className="text-xs tracking-[0.4em] uppercase mb-2"
                  style={{ color: 'rgba(0,180,255,0.35)' }}
                >
                  Lithium Niobate On Insulator
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: 'rgba(200,220,255,0.6)' }}
                >
                  铌酸锂薄膜光子集成芯片
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 pt-8">
              <MenuItem
                title="外部客户数据"
                desc="客户样品 · 委托测试 · 报告归档 · 权限共享"
                color="green"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,140,0.7)" strokeWidth="1.5">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                items={['客户样品编号', '测试任务', '原始数据', '分析报告']}
              />

              <MenuItem
                title="工艺制程监控"
                desc="薄膜厚度 · 刻蚀深度 · 光刻对准 · 良率分析"
                color="green"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,140,0.7)" strokeWidth="1.5">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
                items={['薄膜厚度', '刻蚀均匀性', '对准精度', '良率趋势']}
              />

              <MenuItem
                title="可靠性评估"
                desc="温度循环 · 湿热老化 · 光功率耐久 · 长期稳定性"
                color="green"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,140,0.7)" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                items={['温度循环', '湿热老化', '光功率耐久', '寿命预测']}
              />
            </div>
          </div>

          {/* Bottom Stats */}
          <div
            className="mt-10 rounded-2xl px-10 py-5 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(0,20,60,0.6), rgba(0,10,30,0.4))',
              border: '1px solid rgba(0,120,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {[
              { label: '总测试项目', value: '1,247', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { label: '内部项目', value: '68%', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { label: '客户项目', value: '32%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { label: '芯片良率', value: '94.2%', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
              { label: '最近更新', value: '刚刚', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
            ].map((stat) => (
              <div key={stat.label} className="stat-item flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,80,200,0.12), rgba(0,50,150,0.06))',
                    border: '1px solid rgba(0,120,255,0.1)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,160,255,0.5)" strokeWidth="1.5">
                    <path d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'rgba(120,160,200,0.5)' }}>
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
