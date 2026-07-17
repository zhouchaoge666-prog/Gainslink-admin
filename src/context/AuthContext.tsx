import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPwd: string, newPwd: string) => { ok: boolean; error?: string };
}

const STORAGE_KEY = 'gl_admin_auth';
const CREDS_KEY   = 'gl_admin_creds';

// Default credentials stored in localStorage (can be changed)
function getStoredCreds(): { username: string; password: string } {
  const raw = localStorage.getItem(CREDS_KEY);
  if (raw) return JSON.parse(raw);
  return { username: 'admin', password: 'admin123' };
}

function saveStoredCreds(creds: { username: string; password: string }) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}

function getStoredSession(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredSession);

  const login = (username: string, password: string): boolean => {
    const creds = getStoredCreds();
    if (username === creds.username && password === creds.password) {
      const u = { username };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const changePassword = (currentPwd: string, newPwd: string) => {
    const creds = getStoredCreds();
    if (currentPwd !== creds.password) {
      return { ok: false, error: '当前密码不正确' };
    }
    if (newPwd.length < 6) {
      return { ok: false, error: '新密码至少 6 位' };
    }
    saveStoredCreds({ ...creds, password: newPwd });
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
