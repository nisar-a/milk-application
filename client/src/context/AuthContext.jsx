import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('smart_dairy_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.me();
        setUser(data.data);
      } catch (_error) {
        localStorage.removeItem('smart_dairy_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem('smart_dairy_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('smart_dairy_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
