import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = { onClose: () => void };

export default function ChangePasswordModal({ onClose }: Props) {
  const { changePassword } = useAuth();
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPwd !== confirmPwd) { setError('两次输入的新密码不一致'); return; }
    const result = changePassword(currentPwd, newPwd);
    if (!result.ok) { setError(result.error || '修改失败'); return; }
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-slate-800 text-sm">修改密码</h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {success ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <p className="text-sm font-medium text-slate-700">密码修改成功</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">当前密码</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPwd}
                      onChange={e => { setCurrentPwd(e.target.value); setError(''); }}
                      placeholder="••••••"
                      className="w-full px-3 py-2.5 pr-9 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">新密码</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPwd}
                      onChange={e => { setNewPwd(e.target.value); setError(''); }}
                      placeholder="至少 6 位"
                      className="w-full px-3 py-2.5 pr-9 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">确认新密码</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={e => { setConfirmPwd(e.target.value); setError(''); }}
                    placeholder="再次输入新密码"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                {error && <p className="text-xs text-danger font-medium">{error}</p>}

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                    取消
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors">
                    确认修改
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
