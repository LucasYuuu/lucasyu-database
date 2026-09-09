'use client'

import { useState, useEffect } from 'react'

interface DataItem {
  id: string
  name: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

export default function Home() {
  const [dataList, setDataList] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', value: '', description: '' })

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/data')
      const data = await res.json()
      setDataList(data)
    } catch {
      alert('加载数据失败')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    setFormData({ name: '', value: '', description: '' })
    setShowForm(false)
    fetchData()
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    await fetch(`/api/data/${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    setEditingItem(null)
    setFormData({ name: '', value: '', description: '' })
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条数据吗？')) return
    await fetch(`/api/data/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const startEdit = (item: DataItem) => {
    setEditingItem(item)
    setFormData({ name: item.name, value: item.value, description: item.description })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          测试数据库管理
        </h1>

        <button
          onClick={() => { setEditingItem(null); setFormData({ name: '', value: '', description: '' }); setShowForm(true) }}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + 新增数据
        </button>

        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? '编辑数据' : '新增数据'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="输入名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">值</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="输入值"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  placeholder="输入描述"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingItem ? handleUpdate : handleAdd}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {editingItem ? '保存修改' : '确认新增'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditingItem(null) }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">值</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">描述</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">更新时间</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.value}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.updated_at).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dataList.length === 0 && (
              <p className="p-6 text-center text-gray-500">暂无数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
