'use client'

import { useState } from 'react'

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-grid relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded border border-white/10 text-xs text-gray-400 bg-white/5">
              AI 生成
            </div>
          </div>

          <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
            锌酸锂光学测试数据平台
          </h1>

          <nav className="flex items-center gap-8">
            <button className="nav-link text-sm flex items-center gap-1">
              数据仓库
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="nav-link text-sm">项目概览</button>
            <button
              className="nav-link text-sm"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="nav-link text-sm">用户中心</button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-8 py-10">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Card - Internal R&D */}
            <div className="card-blue rounded-2xl p-8 glow-blue relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">内部研发测试数据</h2>
              <p className="text-sm text-blue-300/60 mb-8">
                器件性能 | 电光调制 | 非线性光学 | 可靠性测试
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="btn-blue rounded-lg px-5 py-3 text-left text-sm text-blue-100">
                  薄膜锌酸锂
                </button>
                <button className="btn-blue rounded-lg px-5 py-3 text-left text-sm text-blue-100">
                  波导传输损耗
                </button>
                <button className="btn-blue rounded-lg px-5 py-3 text-left text-sm text-blue-100">
                  调制响应
                </button>
                <button className="btn-blue rounded-lg px-5 py-3 text-left text-sm text-blue-100">
                  频率转换
                </button>
              </div>

              {/* 3D Chip Illustration */}
              <div className="absolute right-8 bottom-12 animate-float">
                <div className="relative w-44 h-44">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl rotate-6" />
                  <div className="absolute inset-0 bg-blue-500/15 rounded-2xl -rotate-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 relative">
                      <div className="absolute inset-0 border-2 border-blue-400/30 rounded-xl" />
                      <div className="absolute inset-3 border border-blue-400/20 rounded-lg" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-400/30 rounded-full" />
                        </div>
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
                        <div className="w-1 h-4 bg-blue-400/30 rounded" />
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                        <div className="w-1 h-4 bg-blue-400/30 rounded" />
                      </div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
                        <div className="h-1 w-4 bg-blue-400/30 rounded" />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                        <div className="h-1 w-4 bg-blue-400/30 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 animate-rotate-slow">
                    <div className="w-6 h-6 border border-blue-400/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - External Clients */}
            <div className="card-green rounded-2xl p-8 glow-green relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">外部客户测试数据</h2>
              <p className="text-sm text-green-300/60 mb-8">
                客户样品 | 委托测试 | 报告归档 | 权限共享
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="btn-green rounded-lg px-5 py-3 text-left text-sm text-green-100">
                  客户样品编号
                </button>
                <button className="btn-green rounded-lg px-5 py-3 text-left text-sm text-green-100">
                  测试任务
                </button>
                <button className="btn-green rounded-lg px-5 py-3 text-left text-sm text-green-100">
                  原始数据
                </button>
                <button className="btn-green rounded-lg px-5 py-3 text-left text-sm text-green-100">
                  分析报告
                </button>
              </div>

              {/* 3D Cloud Illustration */}
              <div className="absolute right-8 bottom-12 animate-float" style={{ animationDelay: '1s' }}>
                <div className="relative w-44 h-44">
                  <div className="absolute inset-0 bg-green-500/10 rounded-2xl rotate-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-24 h-18 relative">
                        <div className="absolute top-0 left-4 w-16 h-12 bg-green-400/15 rounded-full" />
                        <div className="absolute top-2 left-0 w-12 h-10 bg-green-400/10 rounded-full" />
                        <div className="absolute top-2 right-0 w-10 h-8 bg-green-400/10 rounded-full" />
                      </div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 space-y-1">
                        <div className="w-16 h-1.5 bg-green-400/20 rounded" />
                        <div className="w-12 h-1.5 bg-green-400/15 rounded" />
                        <div className="w-14 h-1.5 bg-green-400/20 rounded" />
                        <div className="w-10 h-1.5 bg-green-400/15 rounded" />
                      </div>
                      <div className="absolute -top-1 -right-3 animate-rotate-slow">
                        <svg className="w-5 h-5 text-green-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="stats-bar rounded-xl mt-8 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-400">总测试项目</div>
                <div className="text-sm font-medium text-white">总测试项目</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-400">内部项目占比</div>
                <div className="text-sm font-medium text-white">内部项目占比</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-400">客户项目占比</div>
                <div className="text-sm font-medium text-white">客户项目占比</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-400">最近更新</div>
                <div className="text-sm font-medium text-white">775x</div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-rotate-slow">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
