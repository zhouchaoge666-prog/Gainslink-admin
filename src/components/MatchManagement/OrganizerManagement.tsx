import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Plus, X, Search } from 'lucide-react';
import { organizerData } from '../../data/mockData';
import type { OrganizerItem } from '../../data/mockData';

const statusMap: Record<OrganizerItem['status'], { label: string; color: string; bg: string }> = {
  active: { label: '已授权', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  suspended: { label: '已禁用', color: 'text-red-600', bg: 'bg-red-50' },
  pending: { label: '待审核', color: 'text-amber-600', bg: 'bg-amber-50' },
};

const typeMap: Record<OrganizerItem['type'], string> = {
  official: '官方',
  partner: '合作机构',
  community: '社区组织',
};

export default function OrganizerManagement() {
  const [organizers, setOrganizers] = useState<OrganizerItem[]>(organizerData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'community' as OrganizerItem['type'],
    contact: '',
    email: '',
    description: '',
    userId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<OrganizerItem | null>(null);

  const filteredOrganizers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return organizers;
    return organizers.filter((org) =>
      org.name.toLowerCase().includes(query) ||
      org.id.toLowerCase().includes(query) ||
      org.contact.toLowerCase().includes(query) ||
      org.email.toLowerCase().includes(query) ||
      (org.userId && org.userId.toLowerCase().includes(query)) ||
      (org.userNickname && org.userNickname.toLowerCase().includes(query)) ||
      typeMap[org.type].includes(query)
    );
  }, [organizers, searchQuery]);

  const openModal = () => {
    setForm({ name: '', type: 'community', contact: '', email: '', description: '', userId: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.email.trim() || !form.userId.trim()) {
      setError('请填写机构名称、联系人、邮箱和平台账号');
      return;
    }
    const userAccount = form.userId.trim();
    const newOrg: OrganizerItem = {
      id: `ORG-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      name: form.name.trim(),
      type: form.type,
      contact: form.contact.trim(),
      email: form.email.trim(),
      status: 'active',
      authorizedMatches: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      description: form.description.trim() || undefined,
      userId: userAccount,
      userNickname: userAccount,
    };
    setOrganizers((prev) => [newOrg, ...prev]);
    closeModal();
  };

  const toggleStatus = (id: string) => {
    setOrganizers((prev) =>       prev.map((org) =>         org.id === id
          ? { ...org, status: org.status === 'active' ? 'suspended' : 'active' }
          : org
      )
    );
  };

  const approve = (id: string) => {
    setOrganizers((prev) =>       prev.map((org) =>         org.id === id ? { ...org, status: 'active' } : org
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">机构授权管理</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索机构/账号/联系人/邮箱"
              className="text-sm text-slate-700 outline-none bg-transparent w-48 placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-1 text-xs px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            新增授权
          </button>
          <div className="text-xs text-slate-500">
            共 <span className="font-medium text-slate-700">{filteredOrganizers.length}</span> 家机构
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-4 py-3 font-medium">机构名称</th>
                <th className="text-left px-4 py-3 font-medium">平台账号</th>
                <th className="text-left px-4 py-3 font-medium">机构类型</th>
                <th className="text-left px-4 py-3 font-medium">联系人</th>
                <th className="text-left px-4 py-3 font-medium">邮箱</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-left px-4 py-3 font-medium">授权赛事</th>
                <th className="text-left px-4 py-3 font-medium">入驻时间</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizers.map((org) => {
                const status = statusMap[org.status];
                return (
                  <tr key={org.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrg(org)}
                        className="text-left"
                      >
                        <div className="font-medium text-slate-800 hover:text-primary transition-colors">{org.name}</div>
                        <div className="text-xs text-slate-400">{org.id}</div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{org.userNickname || org.userId || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{typeMap[org.type]}</td>
                    <td className="px-4 py-3 text-slate-600">{org.contact}</td>
                    <td className="px-4 py-3 text-slate-600">{org.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{org.authorizedMatches}</td>
                    <td className="px-4 py-3 text-slate-600">{org.createdAt}</td>
                    <td className="px-4 py-3">
                      {org.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approve(org.id)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <CheckCircle size={12} />
                            授权
                          </button>
                          <button
                            onClick={() => toggleStatus(org.id)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <XCircle size={12} />
                            拒绝
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleStatus(org.id)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                            org.status === 'active'
                              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {org.status === 'active' ? (
                            <> <XCircle size={12} /> 禁用 </>
                          ) : (
                            <> <CheckCircle size={12} /> 启用 </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800">新增机构授权</h4>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">机构名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="请输入机构名称"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">机构类型</label>
                <select
                  value={form.type}
                  onChange={(e) => updateForm('type', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
                >
                  <option value="official">官方</option>
                  <option value="partner">合作机构</option>
                  <option value="community">社区组织</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gainslink 平台账号</label>
                <input
                  type="text"
                  value={form.userId}
                  onChange={(e) => updateForm('userId', e.target.value)}
                  placeholder="请输入平台账号 ID"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">联系人</label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => updateForm('contact', e.target.value)}
                  placeholder="请输入联系人"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">联系邮箱</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">机构简介（选填）</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="请输入机构简介"
                  rows={3}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary resize-none"
                />
              </div>
              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  确认授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800">机构详情</h4>
              <button onClick={() => setSelectedOrg(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg font-bold">{selectedOrg.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{selectedOrg.name}</div>
                  <div className="text-xs text-slate-500">{selectedOrg.id} · {typeMap[selectedOrg.type]}</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">状态</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[selectedOrg.status].bg} ${statusMap[selectedOrg.status].color}`}>
                    {statusMap[selectedOrg.status].label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Gainslink 平台账号</span>
                  <span className="text-slate-800">{selectedOrg.userId || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">联系人</span>
                  <span className="text-slate-800">{selectedOrg.contact}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">联系邮箱</span>
                  <span className="text-slate-800">{selectedOrg.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">授权赛事</span>
                  <span className="text-slate-800">{selectedOrg.authorizedMatches} 场</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">入驻时间</span>
                  <span className="text-slate-800">{selectedOrg.createdAt}</span>
                </div>
              </div>

              {selectedOrg.description && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">机构简介</div>
                  <div className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{selectedOrg.description}</div>
                </div>
              )}

              <div className="pt-2">
                {selectedOrg.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { approve(selectedOrg.id); setSelectedOrg((prev) => prev ? { ...prev, status: 'active' } : prev); }}
                      className="flex-1 flex items-center justify-center gap-1 text-xs px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <CheckCircle size={13} />
                      授权
                    </button>
                    <button
                      onClick={() => { toggleStatus(selectedOrg.id); setSelectedOrg((prev) => prev ? { ...prev, status: 'suspended' } : prev); }}
                      className="flex-1 flex items-center justify-center gap-1 text-xs px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <XCircle size={13} />
                      拒绝
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      toggleStatus(selectedOrg.id);
                      setSelectedOrg((prev) =>
                        prev
                          ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' }
                          : prev
                      );
                    }}
                    className={`w-full flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                      selectedOrg.status === 'active'
                        ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedOrg.status === 'active' ? (
                      <> <XCircle size={13} /> 禁用 </>
                    ) : (
                      <> <CheckCircle size={13} /> 启用 </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
