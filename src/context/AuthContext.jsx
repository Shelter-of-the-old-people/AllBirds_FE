import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await api.get('/auth/check');
        if (res.data.isLogin) {
          setUser(res.data.user);
        } else {
          setUser(null); 
        }
      } catch (err) {
        console.error("로그인 상태 확인 실패", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (userId, password) => {
    const res = await api.post('/auth/login', { userId, password });
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);