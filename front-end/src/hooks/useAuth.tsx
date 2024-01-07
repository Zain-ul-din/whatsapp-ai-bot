/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import socket from '../lib/socket';
import AuthState from '../../../types/AuthState';

interface AuthProps {
  qrCode: string;
  authState: AuthState;
}

const AuthContext = createContext<AuthProps>({
  qrCode: '',
  authState: 'loading'
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthProps>({
    qrCode: '',
    authState: 'loading'
  });

  useEffect(() => {
    socket.on('qr_code', ({ qrCode }: { qrCode: string }) => {
      setState((prevState) => ({ ...prevState, qrCode }));
    });

    socket.on('auth_state', ({ authState }: { authState: AuthState }) => {
      setState((prevState) => ({ ...prevState, authState }));
    });

    return () => {
      socket.off('qr_code');
      socket.off('auth_state');
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);
export default useAuth;
